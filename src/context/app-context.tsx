'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Role, User, Patient, Doctor, Appointment, Bill, MedicalRecord } from '@/lib/types';
import { users, initialPatients, initialDoctors, initialAppointments, initialBills, initialMedicalRecords } from '@/lib/data';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  bills: Bill[];
  medicalRecords: MedicalRecord[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>('patient');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  
  const user = role === 'admin' ? users['user-admin'] : role === 'doctor' ? users['user-doctor'] : users['user-patient'];

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };
  
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: `a${Date.now()}` };
    setAppointments(prev => [...prev, newAppointment]);
  };

  return (
    <AppContext.Provider value={{ role, setRole, user, patients, doctors, appointments, bills, medicalRecords, addAppointment }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
