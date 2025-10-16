export type Role = 'admin' | 'doctor' | 'patient';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  password?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: string;
  lastVisit: string;
  avatar: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
  avatar: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export type Bill = {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
};

export type MedicalRecord = {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  notes: string;
  doctorName: string;
  prescription?: string;
};

export type Room = {
  id: string;
  roomNumber: string;
  type: 'General Ward' | 'Private' | 'ICU';
  status: 'Available' | 'Occupied';
  patientName?: string;
};

export type LabTest = {
    id: string;
    patientName: string;
    testName: string;
    date: string;
    status: 'Pending' | 'Completed';
    result?: string;
};

export type Department = {
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
};
