import { supabase } from './client';

/**
 * DATABASE OPERATIONS - SAFE QUERIES (No Ambiguous Column Errors)
 * 
 * ✅ SAFE TO USE (Direct table queries):
 * - Doctor: getAll(), getById(), getAvailable() - Uses v_doctor_details view (works)
 * - Patient: getAll(), getById(), search() - Uses v_patient_complete_info view (works)
 * - Appointment: getAll(), getById(), getByPatient(), getByDoctor() - Direct table queries
 * - Billing: getAll(), getById(), getByPatient() - Direct table queries
 * - Lab_Test: getAll(), getById(), getByPatient() - Direct table queries
 * - Room: getAll(), getAvailable() - Direct table queries
 * - Specialization: Can query directly
 * - Department: Can query directly
 * 
 * ⚠️ USE WITH CAUTION (May have ambiguous column issues):
 * - RPC functions: book_appointment() - Falls back to direct insert if ambiguous
 * - Views: v_upcoming_appointments - Avoided, using direct queries instead
 * - Complex joins: Use separate queries instead
 * 
 * STRATEGY: Query tables directly with explicit column names, then enrich with related data
 * in separate queries to avoid ambiguous column errors.
 */

// ============================================
// AUTHENTICATION
// ============================================

export const authAPI = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async getUserRole() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check which table the user belongs to
    const { data: userLogin } = await supabase
      .from('User_Login')
      .select('Role, Reference_ID')
      .eq('Username', user.email)
      .single();

    return userLogin;
  },
};

// ============================================
// DOCTORS
// ============================================

export const doctorAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('v_doctor_details')
      .select('*')
      .order('Doctor_ID', { ascending: true });
    return { data, error };
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('v_doctor_details')
      .select('*')
      .eq('Doctor_ID', id)
      .single();
    return { data, error };
  },

  async getAvailable(specializationName?: string) {
    const { data, error } = await supabase.rpc('get_available_doctors', {
      p_specialization_name: specializationName || null,
    });
    return { data, error };
  },

  async create(doctor: {
    First_Name: string;
    Last_Name: string;
    Gender?: string;
    Age?: number;
    Qualification?: string;
    Experience_Years?: number;
    Consultation_Charges?: number;
    Contact_Number?: string;
    Email: string;
    Specialization_ID?: number;
  }) {
    const { data, error } = await supabase
      .from('Doctor')
      .insert(doctor)
      .select()
      .single();
    return { data, error };
  },

  async update(id: number, updates: Partial<{
    First_Name: string;
    Last_Name: string;
    Gender: string;
    Age: number;
    Qualification: string;
    Experience_Years: number;
    Consultation_Charges: number;
    Availability_Status: string;
    Contact_Number: string;
    Email: string;
    Specialization_ID: number;
  }>) {
    const { data, error } = await supabase
      .from('Doctor')
      .update(updates)
      .eq('Doctor_ID', id)
      .select()
      .single();
    return { data, error };
  },
};

// ============================================
// PATIENTS
// ============================================

export const patientAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('v_patient_complete_info')
      .select('*')
      .order('Patient_ID', { ascending: true });
    return { data, error };
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('v_patient_complete_info')
      .select('*')
      .eq('Patient_ID', id)
      .single();
    return { data, error };
  },

  async search(searchTerm: string) {
    const { data, error } = await supabase.rpc('search_patients', {
      p_search_term: searchTerm,
    });
    return { data, error };
  },

  async create(patient: {
    First_Name: string;
    Last_Name: string;
    Gender?: string;
    DOB?: string;
    Blood_Group?: string;
    Contact_Number?: string;
    Email?: string;
    Emergency_Contact?: string;
    Address_ID?: number;
  }) {
    const { data, error } = await supabase
      .from('Patient')
      .insert(patient)
      .select()
      .single();
    return { data, error };
  },

  async update(id: number, updates: Partial<{
    First_Name: string;
    Last_Name: string;
    Gender: string;
    DOB: string;
    Blood_Group: string;
    Contact_Number: string;
    Email: string;
    Emergency_Contact: string;
  }>) {
    const { data, error } = await supabase
      .from('Patient')
      .update(updates)
      .eq('Patient_ID', id)
      .select()
      .single();
    return { data, error };
  },

  async getHistory(id: number) {
    const { data, error } = await supabase.rpc('get_patient_history', {
      p_patient_id: id,
    });
    return { data, error };
  },
};

// ============================================
// APPOINTMENTS
// ============================================

export const appointmentAPI = {
  async getAll() {
    // Query Appointment table directly - simplest approach to avoid ambiguous columns
    // Note: Supabase converts table names to lowercase, so use 'appointment' not 'Appointment'
    // Column names also need to be lowercase for inserts, but selects can use either format
    const { data, error } = await supabase
      .from('appointment')
      .select(`
        appointment_id,
        doctor_id,
        patient_id,
        appointment_date,
        appointment_time,
        status,
        admin_id,
        notes,
        created_at,
        updated_at
      `)
      .order('appointment_date', { ascending: true });
    
    if (error) {
      return { data: null, error };
    }

    // Enrich with patient and doctor names by fetching separately
    if (data && data.length > 0) {
      // Get unique patient and doctor IDs
      const patientIds = [...new Set(data.map((apt: any) => apt.patient_id || apt.Patient_ID))];
      const doctorIds = [...new Set(data.map((apt: any) => apt.doctor_id || apt.Doctor_ID))];

      // Fetch patients
      const { data: patients } = await supabase
        .from('patient')
        .select('patient_id, first_name, last_name')
        .in('patient_id', patientIds);

      // Fetch doctors with specializations
      const { data: doctors } = await supabase
        .from('doctor')
        .select('doctor_id, first_name, last_name, specialization_id')
        .in('doctor_id', doctorIds);

      // Fetch specializations
      const specIds = [...new Set(doctors?.map((d: any) => d.specialization_id || d.Specialization_ID).filter(Boolean) || [])];
      const { data: specializations } = await supabase
        .from('specialization')
        .select('specialization_id, specialization_name')
        .in('specialization_id', specIds);

      // Create lookup maps
      const patientMap = new Map(patients?.map((p: any) => [p.patient_id || p.Patient_ID, `${p.first_name || p.First_Name} ${p.last_name || p.Last_Name}`]) || []);
      const doctorMap = new Map(doctors?.map((d: any) => [d.doctor_id || d.Doctor_ID, { name: `${d.first_name || d.First_Name} ${d.last_name || d.Last_Name}`, specId: d.specialization_id || d.Specialization_ID }]) || []);
      const specMap = new Map(specializations?.map((s: any) => [s.specialization_id || s.Specialization_ID, s.specialization_name || s.Specialization_Name]) || []);

      // Enrich appointments
      const enriched = data.map((apt: any) => {
        const doctor = doctorMap.get(apt.doctor_id || apt.Doctor_ID);
        return {
          Appointment_ID: apt.appointment_id || apt.Appointment_ID,
          Doctor_ID: apt.doctor_id || apt.Doctor_ID,
          Patient_ID: apt.patient_id || apt.Patient_ID,
          Appointment_Date: apt.appointment_date || apt.Appointment_Date,
          Appointment_Time: apt.appointment_time || apt.Appointment_Time,
          Status: apt.status || apt.Status,
          Admin_ID: apt.admin_id || apt.Admin_ID,
          Notes: apt.notes || apt.Notes,
          Created_At: apt.created_at || apt.Created_At,
          Updated_At: apt.updated_at || apt.Updated_At,
          Patient_Name: patientMap.get(apt.patient_id || apt.Patient_ID) || 'Unknown Patient',
          Doctor_Name: doctor?.name || 'Unknown Doctor',
          Specialization_Name: doctor?.specId ? (specMap.get(doctor.specId) || 'General') : 'General',
        };
      });

      return { data: enriched, error: null };
    }

    return { data: [], error: null };
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('appointment')
      .select(`
        appointment_id,
        doctor_id,
        patient_id,
        appointment_date,
        appointment_time,
        status,
        admin_id,
        notes,
        created_at,
        updated_at
      `)
      .eq('appointment_id', id)
      .single();
    return { data, error };
  },

  async getByPatient(patientId: number) {
    const { data, error } = await supabase
      .from('appointment')
      .select(`
        appointment_id,
        doctor_id,
        patient_id,
        appointment_date,
        appointment_time,
        status,
        admin_id,
        notes,
        created_at,
        updated_at
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false });
    return { data, error };
  },

  async getByDoctor(doctorId: number) {
    const { data, error } = await supabase
      .from('appointment')
      .select(`
        appointment_id,
        doctor_id,
        patient_id,
        appointment_date,
        appointment_time,
        status,
        admin_id,
        notes,
        created_at,
        updated_at
      `)
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true });
    return { data, error };
  },

  async book(appointment: {
    Doctor_ID: number;
    Patient_ID: number;
    Appointment_Date: string;
    Appointment_Time: string;
    Admin_ID?: number;
    Notes?: string;
  }) {
    // Try RPC first, but if it fails with ambiguous column error, insert directly
    try {
      const { data, error } = await supabase.rpc('book_appointment', {
        p_doctor_id: appointment.Doctor_ID,
        p_patient_id: appointment.Patient_ID,
        p_appointment_date: appointment.Appointment_Date,
        p_appointment_time: appointment.Appointment_Time,
        p_admin_id: appointment.Admin_ID || null,
        p_notes: appointment.Notes || null,
      });
      
      // If RPC returns error about ambiguous columns, fall back to direct insert
      if (error && error.message?.includes('ambiguous')) {
        // Fallback: Insert directly into appointment table
        const { data: insertData, error: insertError } = await supabase
          .from('appointment')
          .insert({
            doctor_id: appointment.Doctor_ID,
            patient_id: appointment.Patient_ID,
            appointment_date: appointment.Appointment_Date,
            appointment_time: appointment.Appointment_Time,
            status: 'Scheduled',
            admin_id: appointment.Admin_ID || null,
            notes: appointment.Notes || null,
          })
          .select('appointment_id')
          .single();
        
        if (insertError) {
          return { data: null, error: insertError };
        }
        
        return { 
          data: [{ success: true, message: 'Appointment booked successfully', appointment_id: insertData?.appointment_id }], 
          error: null 
        };
      }
      
      return { data, error };
    } catch (error: any) {
      // Catch any other errors and try direct insert
      if (error?.message?.includes('ambiguous')) {
        const { data: insertData, error: insertError } = await supabase
          .from('appointment')
          .insert({
            doctor_id: appointment.Doctor_ID,
            patient_id: appointment.Patient_ID,
            appointment_date: appointment.Appointment_Date,
            appointment_time: appointment.Appointment_Time,
            status: 'Scheduled',
            admin_id: appointment.Admin_ID || null,
            notes: appointment.Notes || null,
          })
          .select('appointment_id')
          .single();
        
        if (insertError) {
          return { data: null, error: insertError };
        }
        
        return { 
          data: [{ success: true, message: 'Appointment booked successfully', appointment_id: insertData?.appointment_id }], 
          error: null 
        };
      }
      
      return { data: null, error };
    }
  },

  async cancel(appointmentId: number, reason?: string) {
    const { data, error } = await supabase.rpc('cancel_appointment', {
      p_appointment_id: appointmentId,
      p_reason: reason || null,
    });
    return { data, error };
  },

  async updateStatus(id: number, status: string) {
    const { data, error } = await supabase
      .from('appointment')
      .update({ status: status })
      .eq('appointment_id', id)
      .select()
      .single();
    return { data, error };
  },
};

// ============================================
// BILLING
// ============================================

export const billingAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('Billing')
      .select(`
        *,
        Patient:Patient_ID(First_Name, Last_Name, Contact_Number)
      `)
      .order('Created_At', { ascending: false });
    return { data, error };
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('Billing')
      .select(`
        *,
        Patient:Patient_ID(First_Name, Last_Name),
        Appointment:Appointment_ID(*)
      `)
      .eq('Bill_ID', id)
      .single();
    return { data, error };
  },

  async getByPatient(patientId: number) {
    const { data, error } = await supabase
      .from('Billing')
      .select('*')
      .eq('Patient_ID', patientId)
      .order('Created_At', { ascending: false });
    return { data, error };
  },

  async generate(bill: {
    Patient_ID: number;
    Appointment_ID?: number;
    Consultation_Charges?: number;
    Medicine_Charges?: number;
    Lab_Charges?: number;
    Room_Charges?: number;
    Discount_Percentage?: number;
  }) {
    const { data, error } = await supabase.rpc('generate_bill', {
      p_patient_id: bill.Patient_ID,
      p_appointment_id: bill.Appointment_ID || null,
      p_consultation_charges: bill.Consultation_Charges || 0,
      p_medicine_charges: bill.Medicine_Charges || 0,
      p_lab_charges: bill.Lab_Charges || 0,
      p_room_charges: bill.Room_Charges || 0,
      p_discount_percentage: bill.Discount_Percentage || 0,
    });
    return { data, error };
  },

  async updatePaymentStatus(billId: number, status: string, method?: string) {
    const { data, error } = await supabase
      .from('Billing')
      .update({
        Payment_Status: status,
        Payment_Method: method || null,
      })
      .eq('Bill_ID', billId)
      .select()
      .single();
    return { data, error };
  },
};

// ============================================
// LAB TESTS
// ============================================

export const labTestAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('Lab_Test')
      .select(`
        *,
        Patient:Patient_ID(First_Name, Last_Name),
        Doctor:Doctor_ID(First_Name, Last_Name)
      `)
      .order('Test_Date', { ascending: false });
    return { data, error };
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('Lab_Test')
      .select(`
        *,
        Patient:Patient_ID(*),
        Doctor:Doctor_ID(*)
      `)
      .eq('Test_ID', id)
      .single();
    return { data, error };
  },

  async getByPatient(patientId: number) {
    const { data, error } = await supabase
      .from('Lab_Test')
      .select('*')
      .eq('Patient_ID', patientId)
      .order('Test_Date', { ascending: false });
    return { data, error };
  },

  async create(test: {
    Patient_ID: number;
    Doctor_ID?: number;
    Test_Name: string;
    Test_Date?: string;
    Cost?: number;
  }) {
    const { data, error } = await supabase
      .from('Lab_Test')
      .insert(test)
      .select()
      .single();
    return { data, error };
  },

  async updateResult(testId: number, result: string, status: string = 'Completed') {
    const { data, error } = await supabase
      .from('Lab_Test')
      .update({ Result: result, Status: status })
      .eq('Test_ID', testId)
      .select()
      .single();
    return { data, error };
  },
};

// ============================================
// MEDICAL RECORDS
// ============================================

export const medicalRecordAPI = {
  async getByPatient(patientId: number) {
    const { data, error } = await supabase
      .from('Medical_Record')
      .select(`
        *,
        Doctor:Doctor_ID(First_Name, Last_Name, Qualification)
      `)
      .eq('Patient_ID', patientId)
      .order('Visit_Date', { ascending: false });
    return { data, error };
  },

  async create(record: {
    Patient_ID: number;
    Doctor_ID: number;
    Visit_Date?: string;
    Diagnosis?: string;
    Notes?: string;
    Symptoms?: string;
  }) {
    const { data, error } = await supabase
      .from('Medical_Record')
      .insert(record)
      .select()
      .single();
    return { data, error };
  },
};

// ============================================
// ROOMS
// ============================================

export const roomAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('Room')
      .select('*')
      .order('Room_Number', { ascending: true });
    return { data, error };
  },

  async getAvailable(type?: string) {
    let query = supabase
      .from('Room')
      .select('*')
      .eq('Availability_Status', 'Available');

    if (type) {
      query = query.eq('Type', type);
    }

    const { data, error } = await query.order('Room_Number', { ascending: true });
    return { data, error };
  },

  async assign(patientId: number, roomType?: string) {
    const { data, error } = await supabase.rpc('assign_room', {
      p_patient_id: patientId,
      p_room_type: roomType || null,
    });
    return { data, error };
  },

  async discharge(patientId: number, roomId: number) {
    const { data, error } = await supabase.rpc('discharge_patient', {
      p_patient_id: patientId,
      p_room_id: roomId,
    });
    return { data, error };
  },
};

// ============================================
// REPORTS / MATERIALIZED VIEWS
// ============================================

export const reportsAPI = {
  async getDoctorPerformance() {
    const { data, error } = await supabase
      .from('mv_doctor_performance')
      .select('*')
      .order('Total_Revenue_Generated', { ascending: false });
    return { data, error };
  },

  async getPatientVisitSummary() {
    const { data, error } = await supabase
      .from('mv_patient_visit_summary')
      .select('*')
      .order('Total_Visits', { ascending: false });
    return { data, error };
  },

  async getDepartmentStatistics() {
    const { data, error } = await supabase
      .from('mv_department_statistics')
      .select('*')
      .order('Total_Revenue', { ascending: false });
    return { data, error };
  },

  async getRevenueReport() {
    const { data, error } = await supabase
      .from('mv_revenue_report')
      .select('*')
      .order('Month', { ascending: false })
      .limit(12);
    return { data, error };
  },

  async getRoomOccupancy() {
    const { data, error } = await supabase
      .from('mv_room_occupancy')
      .select('*')
      .order('Room_Number', { ascending: true });
    return { data, error };
  },

  async getDiseasePrevalence() {
    const { data, error } = await supabase
      .from('mv_disease_prevalence')
      .select('*')
      .order('Total_Patients', { ascending: false })
      .limit(10);
    return { data, error };
  },

  async refreshMaterializedViews() {
    const { data, error } = await supabase.rpc('refresh_all_materialized_views');
    return { data, error };
  },
};

// ============================================
// DASHBOARD STATS
// ============================================

export const dashboardAPI = {
  async getStats() {
    const [
      { data: totalPatients },
      { data: totalDoctors },
      { data: upcomingAppointments },
      { data: pendingBills },
    ] = await Promise.all([
      supabase.from('Patient').select('*', { count: 'exact', head: true }),
      supabase.from('Doctor').select('*', { count: 'exact', head: true }),
      supabase
        .from('Appointment')
        .select('*', { count: 'exact', head: true })
        .eq('Status', 'Scheduled')
        .gte('Appointment_Date', new Date().toISOString().split('T')[0]),
      supabase
        .from('Billing')
        .select('*', { count: 'exact', head: true })
        .eq('Payment_Status', 'Pending'),
    ]);

    return {
      totalPatients: totalPatients?.count || 0,
      totalDoctors: totalDoctors?.count || 0,
      upcomingAppointments: upcomingAppointments?.count || 0,
      pendingBills: pendingBills?.count || 0,
    };
  },
};
