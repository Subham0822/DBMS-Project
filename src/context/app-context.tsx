"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type {
  Role,
  User,
  Patient,
  Doctor,
  Appointment,
  Bill,
  MedicalRecord,
  Room,
  LabTest,
} from "@/lib/types";
import {
  users,
  initialPatients,
  initialDoctors,
  initialAppointments,
  initialBills,
  initialMedicalRecords,
  initialRooms,
  initialLabTests,
} from "@/lib/data";
import { doctorAPI, appointmentAPI, patientAPI } from "@/lib/supabase/api";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  isAuthenticated: boolean;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  bills: Bill[];
  medicalRecords: MedicalRecord[];
  rooms: Room[];
  labTests: LabTest[];
  login: (role: Role, password?: string) => boolean;
  logout: () => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  refreshAppointments: () => Promise<void>;
  refreshDoctors: () => Promise<void>;
  generateBill: (
    bill: Omit<Bill, "id" | "date" | "status"> & Partial<Pick<Bill, "status">>
  ) => void;
  payBill: (billId: string) => void;
  requestLabTest: (payload: { patientName: string; testName: string }) => void;
  completeLabTest: (payload: { id: string; result: string }) => void;
  addMedicalRecord: (
    record: Omit<MedicalRecord, "id" | "date"> &
      Partial<Pick<MedicalRecord, "date">>
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const AUTH_KEY = "medisys_auth";
  const [role, setRoleState] = useState<Role>("patient");
  const [user, setUser] = useState<User>(users["user-patient"]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(
    initialMedicalRecords
  );
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [labTests, setLabTests] = useState<LabTest[]>(initialLabTests);

  const login = (newRole: Role, password?: string): boolean => {
    const userToLogin =
      newRole === "admin"
        ? users["user-admin"]
        : newRole === "doctor"
        ? users["user-doctor"]
        : users["user-patient"];
    if (userToLogin.password === password) {
      setRoleState(newRole);
      setUser(userToLogin);
      setIsAuthenticated(true);
      try {
        localStorage.setItem(
          AUTH_KEY,
          JSON.stringify({
            role: newRole,
            userId: userToLogin.id,
            isAuthenticated: true,
          })
        );
      } catch {}
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {}
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setUser(
      newRole === "admin"
        ? users["user-admin"]
        : newRole === "doctor"
        ? users["user-doctor"]
        : users["user-patient"]
    );
  };

  const addAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment = { ...appointment, id: `a${Date.now()}` };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const refreshAppointments = async () => {
    try {
      const { data, error } = await appointmentAPI.getAll();
      if (!error && data) {
        // Transform DB format to UI format
        const transformed = data.map((apt: any) => ({
          id: `a${apt.Appointment_ID}`,
          patientId: `p${apt.Patient_ID}`,
          patientName: apt.Patient_Name || 'Unknown Patient',
          doctorId: `d${apt.Doctor_ID}`,
          doctorName: apt.Doctor_Name || 'Unknown Doctor',
          specialty: apt.Specialization_Name || 'General',
          date: apt.Appointment_Date,
          time: formatTime(apt.Appointment_Time),
          status: mapStatus(apt.Status),
        }));
        setAppointments(transformed);
      }
    } catch (error) {
      console.error('Failed to refresh appointments:', error);
    }
  };

  const refreshDoctors = async () => {
    try {
      const { data, error } = await doctorAPI.getAll();
      if (!error && data) {
        // Transform DB format to UI format
        const transformed = data.map((doc: any) => ({
          id: `d${doc.Doctor_ID}`,
          name: doc.Doctor_Name || `${doc.First_Name} ${doc.Last_Name}`,
          specialty: doc.Specialization_Name || 'General',
          availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], // Default availability
          avatar: `https://picsum.photos/seed/doctor${doc.Doctor_ID}/200/200`,
        }));
        setDoctors(transformed);
      }
    } catch (error) {
      console.error('Failed to refresh doctors:', error);
      // Fallback to initial doctors on error
      setDoctors(initialDoctors);
    }
  };

  // Helper functions
  const formatTime = (time: string): string => {
    if (!time) return '09:00 AM';
    // Convert HH:MM:SS to HH:MM AM/PM
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const m = minutes.slice(0, 2);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const mapStatus = (status: string): 'Upcoming' | 'Completed' | 'Cancelled' => {
    if (status === 'Scheduled') return 'Upcoming';
    if (status === 'Completed') return 'Completed';
    if (status === 'Cancelled') return 'Cancelled';
    return 'Upcoming';
  };

  const generateBill = (
    bill: Omit<Bill, "id" | "date" | "status"> & Partial<Pick<Bill, "status">>
  ) => {
    const newBill: Bill = {
      id: `b${Date.now()}`,
      patientName: bill.patientName,
      amount: bill.amount,
      date: new Date().toISOString().slice(0, 10),
      status: bill.status ?? "Pending",
    };
    setBills((prev) => [newBill, ...prev]);
  };

  const payBill = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: "Paid" } : b))
    );
  };

  const requestLabTest = (payload: {
    patientName: string;
    testName: string;
  }) => {
    const newTest: LabTest = {
      id: `lt${Date.now()}`,
      patientName: payload.patientName,
      testName: payload.testName,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
    };
    setLabTests((prev) => [newTest, ...prev]);
  };

  const completeLabTest = (payload: { id: string; result: string }) => {
    setLabTests((prev) =>
      prev.map((t) =>
        t.id === payload.id
          ? { ...t, status: "Completed", result: payload.result }
          : t
      )
    );
  };

  const addMedicalRecord = (
    record: Omit<MedicalRecord, "id" | "date"> &
      Partial<Pick<MedicalRecord, "date">>
  ) => {
    const newRecord: MedicalRecord = {
      id: `mr${Date.now()}`,
      patientId: record.patientId,
      diagnosis: record.diagnosis,
      notes: record.notes,
      doctorName: record.doctorName,
      prescription: record.prescription,
      date: record.date ?? new Date().toISOString().slice(0, 10),
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);
  };

  // Rehydrate auth state on client load and fetch data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) {
          // Still fetch doctors even if not logged in
          await refreshDoctors();
          return;
        }
        const data = JSON.parse(raw) as {
          role: Role;
          userId: string;
          isAuthenticated: boolean;
        };
        const storedUser = users[data.userId];
        if (data.isAuthenticated && storedUser) {
          setRoleState(data.role);
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch {}
      
      // Fetch doctors and appointments on mount
      await refreshDoctors();
      await refreshAppointments();
    };

    initializeData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        isAuthenticated,
        patients,
        doctors,
        appointments,
        bills,
        medicalRecords,
        rooms,
        labTests,
        login,
        logout,
        addAppointment,
        refreshAppointments,
        refreshDoctors,
        generateBill,
        payBill,
        requestLabTest,
        completeLabTest,
        addMedicalRecord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
