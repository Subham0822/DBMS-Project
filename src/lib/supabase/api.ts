import { supabase } from './client';

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
    const { data, error } = await supabase
      .from('v_upcoming_appointments')
      .select('*')
      .order('Appointment_Date', { ascending: true });
    return { data, error };
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('Appointment')
      .select(`
        *,
        Doctor:Doctor_ID(*),
        Patient:Patient_ID(*)
      `)
      .eq('Appointment_ID', id)
      .single();
    return { data, error };
  },

  async getByPatient(patientId: number) {
    const { data, error } = await supabase
      .from('Appointment')
      .select(`
        *,
        Doctor:Doctor_ID(First_Name, Last_Name, Consultation_Charges)
      `)
      .eq('Patient_ID', patientId)
      .order('Appointment_Date', { ascending: false });
    return { data, error };
  },

  async getByDoctor(doctorId: number) {
    const { data, error } = await supabase
      .from('Appointment')
      .select(`
        *,
        Patient:Patient_ID(First_Name, Last_Name, Contact_Number)
      `)
      .eq('Doctor_ID', doctorId)
      .order('Appointment_Date', { ascending: true });
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
    const { data, error } = await supabase.rpc('book_appointment', {
      p_doctor_id: appointment.Doctor_ID,
      p_patient_id: appointment.Patient_ID,
      p_appointment_date: appointment.Appointment_Date,
      p_appointment_time: appointment.Appointment_Time,
      p_admin_id: appointment.Admin_ID || null,
      p_notes: appointment.Notes || null,
    });
    return { data, error };
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
      .from('Appointment')
      .update({ Status: status })
      .eq('Appointment_ID', id)
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
