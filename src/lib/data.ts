import type { User, Patient, Doctor, Appointment, Bill, MedicalRecord, Room, LabTest } from './types';
import { Heart, Brain, Bone, Baby, Microscope, Stethoscope } from 'lucide-react';


export const users: Record<string, User> = {
  'user-admin': { id: 'user-admin', name: 'Admin User', email: 'admin@medisys.com', avatar: 'https://picsum.photos/seed/admin/200/200', role: 'admin', password: 'admin' },
  'user-doctor': { id: 'user-doctor', name: 'Dr. Emily Carter', email: 'emily.carter@medisys.com', avatar: 'https://picsum.photos/seed/doctor/200/200', role: 'doctor', password: 'doctor' },
  'user-patient': { id: 'user-patient', name: 'John Doe', email: 'john.doe@email.com', avatar: 'https://picsum.photos/seed/patient/200/200', role: 'patient', password: 'patient' },
};

export const initialPatients: Patient[] = [
  { id: 'p001', name: 'John Doe', dateOfBirth: '1985-02-10', gender: 'Male', contact: '+1234567890', address: '123 Health St, Wellness City', lastVisit: '2024-05-15', avatar: 'https://picsum.photos/seed/avatar1/200/200' },
  { id: 'p002', name: 'Jane Smith', dateOfBirth: '1992-08-22', gender: 'Female', contact: '+1987654321', address: '456 Care Ave, Meditown', lastVisit: '2024-06-01', avatar: 'https://picsum.photos/seed/avatar2/200/200' },
  { id: 'p003', name: 'Michael Johnson', dateOfBirth: '1978-11-30', gender: 'Male', contact: '+1122334455', address: '789 Cure Blvd, Healville', lastVisit: '2024-04-20', avatar: 'https://picsum.photos/seed/avatar3/200/200' },
  { id: 'p004', name: 'Sarah Williams', dateOfBirth: '2001-07-19', gender: 'Female', contact: '+1555666777', address: '101 Remedy Lane, Clinic City', lastVisit: '2024-05-28', avatar: 'https://picsum.photos/seed/avatar4/200/200' },
];

export const initialDoctors: Doctor[] = [
  { id: 'd001', name: 'Dr. Emily Carter', specialty: 'Cardiology', availability: ['Mon', 'Wed', 'Fri'], avatar: 'https://picsum.photos/seed/avatar5/200/200' },
  { id: 'd002', name: 'Dr. Ben Hanson', specialty: 'Dermatology', availability: ['Tue', 'Thu'], avatar: 'https://picsum.photos/seed/avatar6/200/200' },
  { id: 'd003', name: 'Dr. Olivia Chen', specialty: 'Pediatrics', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], avatar: 'https://picsum.photos/seed/avatar7/200/200' },
  { id: 'd004', name: 'Dr. David Rodriguez', specialty: 'Neurology', availability: ['Mon', 'Fri'], avatar: 'https://picsum.photos/seed/avatar8/200/200' },
];

export const initialAppointments: Appointment[] = [
  { id: 'a001', patientId: 'p001', patientName: 'John Doe', doctorId: 'd001', doctorName: 'Dr. Emily Carter', specialty: 'Cardiology', date: '2024-07-20', time: '10:00 AM', status: 'Upcoming' },
  { id: 'a002', patientId: 'p002', patientName: 'Jane Smith', doctorId: 'd002', doctorName: 'Dr. Ben Hanson', specialty: 'Dermatology', date: '2024-07-22', time: '02:30 PM', status: 'Upcoming' },
  { id: 'a003', patientId: 'p001', patientName: 'John Doe', doctorId: 'd003', doctorName: 'Dr. Olivia Chen', specialty: 'Pediatrics', date: '2024-06-10', time: '09:00 AM', status: 'Completed' },
];

export const initialBills: Bill[] = [
  { id: 'b001', patientName: 'John Doe', date: '2024-06-11', amount: 150.00, status: 'Paid' },
  { id: 'b002', patientName: 'Jane Smith', date: '2024-06-02', amount: 75.00, status: 'Pending' },
  { id: 'b003', patientName: 'John Doe', date: '2024-05-16', amount: 250.00, status: 'Paid' },
  { id: 'b004', patientName: 'Michael Johnson', date: '2024-04-21', amount: 500.00, status: 'Overdue' },
];

export const initialMedicalRecords: MedicalRecord[] = [
    { id: 'mr001', patientId: 'p001', date: '2024-05-15', diagnosis: 'Minor Arrhythmia', notes: 'Prescribed beta-blockers. Follow-up in 2 months.', doctorName: 'Dr. Emily Carter', prescription: 'Metoprolol 50mg' },
    { id: 'mr002', patientId: 'p001', date: '2024-01-05', diagnosis: 'Common Cold', notes: 'Advised rest and hydration.', doctorName: 'Dr. Olivia Chen', prescription: 'Ibuprofen as needed' },
    { id: 'mr003', patientId: 'p002', date: '2024-06-01', diagnosis: 'Acne Vulgaris', notes: 'Prescribed topical retinoids.', doctorName: 'Dr. Ben Hanson', prescription: 'Tretinoin Cream 0.05%' },
];

export const initialRooms: Room[] = [
    { id: 'r101', roomNumber: '101', type: 'Private', status: 'Available' },
    { id: 'r102', roomNumber: '102', type: 'Private', status: 'Occupied', patientName: 'Jane Smith' },
    { id: 'r201', roomNumber: '201', type: 'General Ward', status: 'Available' },
    { id: 'r202', roomNumber: '202', type: 'General Ward', status: 'Available' },
    { id: 'icu01', roomNumber: 'ICU-01', type: 'ICU', status: 'Occupied', patientName: 'Michael Johnson' },
];

export const initialLabTests: LabTest[] = [
    { id: 'lt001', patientName: 'John Doe', testName: 'Complete Blood Count (CBC)', date: '2024-07-18', status: 'Pending' },
    { id: 'lt002', patientName: 'Jane Smith', testName: 'Lipid Panel', date: '2024-07-17', status: 'Completed', result: 'Total Cholesterol: 190 mg/dL' },
    { id: 'lt003', patientName: 'Michael Johnson', testName: 'Thyroid Panel', date: '2024-07-19', status: 'Pending' },
];

export const departments = [
    {
      name: 'Cardiology',
      description: 'Expert care for heart-related conditions.',
      icon: Heart,
    },
    {
      name: 'Neurology',
      description: 'Specialized treatment for brain and nervous system disorders.',
      icon: Brain,
    },
    {
      name: 'Orthopedics',
      description: 'Comprehensive care for bone, joint, and muscle issues.',
      icon: Bone,
    },
    {
      name: 'Pediatrics',
      description: 'Dedicated healthcare for infants, children, and adolescents.',
      icon: Baby,
    },
    {
      name: 'Pathology',
      description: 'Accurate diagnostic testing and analysis of lab samples.',
      icon: Microscope,
    },
    {
      name: 'General Medicine',
      description: 'Primary care and treatment for a wide range of common illnesses.',
      icon: Stethoscope,
    }
  ];
