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

  // Rehydrate auth state on client load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return;
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
