// Supabase Database Types
// This file contains TypeScript types for the database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Department: {
        Row: {
          Department_ID: number;
          Department_Name: string;
          Location: string | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Department_ID?: number;
          Department_Name: string;
          Location?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Department_ID?: number;
          Department_Name?: string;
          Location?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Specialization: {
        Row: {
          Specialization_ID: number;
          Specialization_Name: string;
          Department_ID: number | null;
          Description: string | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Specialization_ID?: number;
          Specialization_Name: string;
          Department_ID?: number | null;
          Description?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Specialization_ID?: number;
          Specialization_Name?: string;
          Department_ID?: number | null;
          Description?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Doctor: {
        Row: {
          Doctor_ID: number;
          First_Name: string;
          Last_Name: string;
          Gender: string | null;
          Age: number | null;
          Qualification: string | null;
          Experience_Years: number | null;
          Consultation_Charges: number | null;
          Availability_Status: string;
          Contact_Number: string | null;
          Email: string;
          Specialization_ID: number | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Doctor_ID?: number;
          First_Name: string;
          Last_Name: string;
          Gender?: string | null;
          Age?: number | null;
          Qualification?: string | null;
          Experience_Years?: number | null;
          Consultation_Charges?: number | null;
          Availability_Status?: string;
          Contact_Number?: string | null;
          Email: string;
          Specialization_ID?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Doctor_ID?: number;
          First_Name?: string;
          Last_Name?: string;
          Gender?: string | null;
          Age?: number | null;
          Qualification?: string | null;
          Experience_Years?: number | null;
          Consultation_Charges?: number | null;
          Availability_Status?: string;
          Contact_Number?: string | null;
          Email?: string;
          Specialization_ID?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Patient: {
        Row: {
          Patient_ID: number;
          First_Name: string;
          Last_Name: string;
          Gender: string | null;
          Age: number | null;
          DOB: string | null;
          Blood_Group: string | null;
          Contact_Number: string | null;
          Email: string | null;
          Emergency_Contact: string | null;
          Address_ID: number | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Patient_ID?: number;
          First_Name: string;
          Last_Name: string;
          Gender?: string | null;
          Age?: number | null;
          DOB?: string | null;
          Blood_Group?: string | null;
          Contact_Number?: string | null;
          Email?: string | null;
          Emergency_Contact?: string | null;
          Address_ID?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Patient_ID?: number;
          First_Name?: string;
          Last_Name?: string;
          Gender?: string | null;
          Age?: number | null;
          DOB?: string | null;
          Blood_Group?: string | null;
          Contact_Number?: string | null;
          Email?: string | null;
          Emergency_Contact?: string | null;
          Address_ID?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Appointment: {
        Row: {
          Appointment_ID: number;
          Doctor_ID: number;
          Patient_ID: number;
          Appointment_Date: string;
          Appointment_Time: string;
          Status: string;
          Admin_ID: number | null;
          Notes: string | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Appointment_ID?: number;
          Doctor_ID: number;
          Patient_ID: number;
          Appointment_Date: string;
          Appointment_Time: string;
          Status?: string;
          Admin_ID?: number | null;
          Notes?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Appointment_ID?: number;
          Doctor_ID?: number;
          Patient_ID?: number;
          Appointment_Date?: string;
          Appointment_Time?: string;
          Status?: string;
          Admin_ID?: number | null;
          Notes?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Billing: {
        Row: {
          Bill_ID: number;
          Appointment_ID: number | null;
          Patient_ID: number;
          Total_Amount: number;
          Discount_Amount: number;
          Final_Amount: number;
          Payment_Status: string;
          Payment_Date: string | null;
          Payment_Method: string | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Bill_ID?: number;
          Appointment_ID?: number | null;
          Patient_ID: number;
          Total_Amount: number;
          Discount_Amount?: number;
          Payment_Status?: string;
          Payment_Date?: string | null;
          Payment_Method?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Bill_ID?: number;
          Appointment_ID?: number | null;
          Patient_ID?: number;
          Total_Amount?: number;
          Discount_Amount?: number;
          Payment_Status?: string;
          Payment_Date?: string | null;
          Payment_Method?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Lab_Test: {
        Row: {
          Test_ID: number;
          Patient_ID: number;
          Doctor_ID: number | null;
          Test_Name: string;
          Test_Date: string;
          Result: string | null;
          Status: string;
          Cost: number | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Test_ID?: number;
          Patient_ID: number;
          Doctor_ID?: number | null;
          Test_Name: string;
          Test_Date?: string;
          Result?: string | null;
          Status?: string;
          Cost?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Test_ID?: number;
          Patient_ID?: number;
          Doctor_ID?: number | null;
          Test_Name?: string;
          Test_Date?: string;
          Result?: string | null;
          Status?: string;
          Cost?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Medical_Record: {
        Row: {
          Record_ID: number;
          Patient_ID: number;
          Doctor_ID: number;
          Visit_Date: string;
          Diagnosis: string | null;
          Notes: string | null;
          Symptoms: string | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Record_ID?: number;
          Patient_ID: number;
          Doctor_ID: number;
          Visit_Date?: string;
          Diagnosis?: string | null;
          Notes?: string | null;
          Symptoms?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Record_ID?: number;
          Patient_ID?: number;
          Doctor_ID?: number;
          Visit_Date?: string;
          Diagnosis?: string | null;
          Notes?: string | null;
          Symptoms?: string | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
      Room: {
        Row: {
          Room_ID: number;
          Room_Number: string;
          Type: string | null;
          Availability_Status: string;
          Charges_Per_Day: number | null;
          Created_At: string;
          Updated_At: string;
        };
        Insert: {
          Room_ID?: number;
          Room_Number: string;
          Type?: string | null;
          Availability_Status?: string;
          Charges_Per_Day?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
        Update: {
          Room_ID?: number;
          Room_Number?: string;
          Type?: string | null;
          Availability_Status?: string;
          Charges_Per_Day?: number | null;
          Created_At?: string;
          Updated_At?: string;
        };
      };
    };
    Views: {
      v_patient_complete_info: {
        Row: {
          Patient_ID: number;
          Patient_Name: string;
          Gender: string | null;
          Age: number | null;
          DOB: string | null;
          Blood_Group: string | null;
          Contact_Number: string | null;
          Email: string | null;
          Emergency_Contact: string | null;
          Full_Address: string | null;
          Insurance_Provider: string | null;
          Policy_Number: string | null;
          Coverage_Percentage: number | null;
        };
      };
      v_doctor_details: {
        Row: {
          Doctor_ID: number;
          Doctor_Name: string;
          Gender: string | null;
          Age: number | null;
          Qualification: string | null;
          Experience_Years: number | null;
          Consultation_Charges: number | null;
          Availability_Status: string;
          Contact_Number: string | null;
          Email: string;
          Specialization_Name: string | null;
          Department_Name: string | null;
        };
      };
      v_upcoming_appointments: {
        Row: {
          Appointment_ID: number;
          Appointment_Date: string;
          Appointment_Time: string;
          Patient_Name: string;
          Patient_Contact: string | null;
          Doctor_Name: string;
          Specialization_Name: string | null;
          Status: string;
          Notes: string | null;
        };
      };
    };
    Functions: {
      book_appointment: {
        Args: {
          p_doctor_id: number;
          p_patient_id: number;
          p_appointment_date: string;
          p_appointment_time: string;
          p_admin_id?: number;
          p_notes?: string;
        };
        Returns: {
          success: boolean;
          message: string;
          appointment_id: number;
        }[];
      };
      generate_bill: {
        Args: {
          p_patient_id: number;
          p_appointment_id?: number;
          p_consultation_charges?: number;
          p_medicine_charges?: number;
          p_lab_charges?: number;
          p_room_charges?: number;
          p_discount_percentage?: number;
        };
        Returns: {
          success: boolean;
          message: string;
          bill_id: number;
          total_amount: number;
          final_amount: number;
        }[];
      };
      get_available_doctors: {
        Args: {
          p_specialization_name?: string;
          p_date?: string;
        };
        Returns: {
          doctor_id: number;
          doctor_name: string;
          specialization: string;
          qualification: string;
          experience_years: number;
          consultation_charges: number;
          contact_number: string;
          email: string;
        }[];
      };
    };
  };
}
