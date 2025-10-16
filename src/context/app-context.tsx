'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Role, User, Patient, Doctor, Appointment, Bill, MedicalRecord, Room, LabTest } from '@/lib/types';
import { users, initialPatients, initialDoctors, initialAppointments, initialBills, initialMedicalRecords, initialRooms, initialLabTests } from '@/lib/data';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  bills: Bill[];
  medicalRecords: MedicalRecord[];
  rooms: Room[];
  labTests: LabTest[];
  login: (role: Role, password?: string) => boolean;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRoleState] = useState<Role>('patient');
  const [user, setUser] = useState<User>(users['user-patient']);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [labTests, setLabTests] = useState<LabTest[]>(initialLabTests);

  const login = (newRole: Role, password?: string): boolean => {
    const userToLogin = newRole === 'admin' ? users['user-admin'] : newRole === 'doctor' ? users['user-doctor'] : users['user-patient'];
    if (userToLogin.password === password) {
      setRoleState(newRole);
      setUser(userToLogin);
      return true;
    }
    return false;
  };
  
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setUser(newRole === 'admin' ? users['user-admin'] : newRole === 'doctor' ? users['user-doctor'] : users['user-patient']);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: `a${Date.now()}` };
    setAppointments(prev => [...prev, newAppointment]);
  };

  return (
    <AppContext.Provider value={{ role, setRole, user, patients, doctors, appointments, bills, medicalRecords, rooms, labTests, login, addAppointment }}>
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
