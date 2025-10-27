
import type { User, Patient, Doctor, Appointment, Bill, MedicalRecord, Room, LabTest } from './types';
import { Heart, Brain, Bone, Baby, Microscope, Stethoscope } from 'lucide-react';


export const users: Record<string, User> = {
  'user-admin': { id: 'user-admin', name: 'Rohan Sharma', email: 'admin@medisys.in', avatar: 'https://picsum.photos/seed/admin/200/200', role: 'admin', password: 'admin' },
  'user-doctor': { id: 'user-doctor', name: 'Dr. Anjali Rao', email: 'anjali.rao@medisys.in', avatar: 'https://picsum.photos/seed/doctor/200/200', role: 'doctor', password: 'doctor' },
  'user-patient': { id: 'user-patient', name: 'Priya Patel', email: 'priya.patel@email.com', avatar: 'https://picsum.photos/seed/patient/200/200', role: 'patient', password: 'patient' },
};

export const initialPatients: Patient[] = [
  { id: 'p001', name: 'Priya Patel', dateOfBirth: '1990-05-15', gender: 'Female', contact: '+91 9876543210', address: '12B, Linking Road, Mumbai', lastVisit: '2024-05-15', avatar: 'https://picsum.photos/seed/avatar1/200/200' },
  { id: 'p002', name: 'Amit Kumar', dateOfBirth: '1985-08-22', gender: 'Male', contact: '+91 9123456789', address: '45, MG Road, Bangalore', lastVisit: '2024-06-01', avatar: 'https://picsum.photos/seed/avatar2/200/200' },
  { id: 'p003', name: 'Suresh Singh', dateOfBirth: '1978-11-30', gender: 'Male', contact: '+91 8877665544', address: '78, Connaught Place, New Delhi', lastVisit: '2024-04-20', avatar: 'https://picsum.photos/seed/avatar3/200/200' },
  { id: 'p004', name: 'Deepika Verma', dateOfBirth: '2001-07-19', gender: 'Female', contact: '+91 7766554433', address: '101, Park Street, Kolkata', lastVisit: '2024-05-28', avatar: 'https://picsum.photos/seed/avatar4/200/200' },
];

export const initialDoctors: Doctor[] = [
  { id: 'd001', name: 'Dr. Anjali Rao', specialty: 'Cardiology', availability: ['Mon', 'Wed', 'Fri'], avatar: 'https://picsum.photos/seed/avatar5/200/200' },
  { id: 'd002', name: 'Dr. Vikram Gupta', specialty: 'Dermatology', availability: ['Tue', 'Thu'], avatar: 'https://picsum.photos/seed/avatar6/200/200' },
  { id: 'd003', name: 'Dr. Sneha Reddy', specialty: 'Pediatrics', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], avatar: 'https://picsum.photos/seed/avatar7/200/200' },
  { id: 'd004', name: 'Dr. Rahul Mehra', specialty: 'Neurology', availability: ['Mon', 'Fri'], avatar: 'https://picsum.photos/seed/avatar8/200/200' },
];

export const initialAppointments: Appointment[] = [
  { id: 'a001', patientId: 'p001', patientName: 'Priya Patel', doctorId: 'd001', doctorName: 'Dr. Anjali Rao', specialty: 'Cardiology', date: '2024-07-20', time: '10:00 AM', status: 'Upcoming' },
  { id: 'a002', patientId: 'p002', patientName: 'Amit Kumar', doctorId: 'd002', doctorName: 'Dr. Vikram Gupta', specialty: 'Dermatology', date: '2024-07-22', time: '02:30 PM', status: 'Upcoming' },
  { id: 'a003', patientId: 'p001', patientName: 'Priya Patel', doctorId: 'd003', doctorName: 'Dr. Sneha Reddy', specialty: 'Pediatrics', date: '2024-06-10', time: '09:00 AM', status: 'Completed' },
];

export const initialBills: Bill[] = [
  { id: 'b001', patientName: 'Priya Patel', date: '2024-06-11', amount: 1200.00, status: 'Paid' },
  { id: 'b002', patientName: 'Amit Kumar', date: '2024-06-02', amount: 500.00, status: 'Pending' },
  { id: 'b003', patientName: 'Priya Patel', date: '2024-05-16', amount: 2000.00, status: 'Paid' },
  { id: 'b004', patientName: 'Suresh Singh', date: '2024-04-21', amount: 4500.00, status: 'Overdue' },
];

export const initialMedicalRecords: MedicalRecord[] = [
    { id: 'mr001', patientId: 'p001', date: '2024-05-15', diagnosis: 'Minor Arrhythmia', notes: 'Prescribed beta-blockers. Follow-up in 2 months.', doctorName: 'Dr. Anjali Rao', prescription: 'Metoprolol 50mg' },
    { id: 'mr002', patientId: 'p001', date: '2024-01-05', diagnosis: 'Common Cold', notes: 'Advised rest and hydration.', doctorName: 'Dr. Sneha Reddy', prescription: 'Paracetamol as needed' },
    { id: 'mr003', patientId: 'p002', date: '2024-06-01', diagnosis: 'Acne Vulgaris', notes: 'Prescribed topical retinoids.', doctorName: 'Dr. Vikram Gupta', prescription: 'Tretinoin Cream 0.05%' },
];

export const initialRooms: Room[] = [
    { id: 'r101', roomNumber: '101', type: 'Private', status: 'Available' },
    { id: 'r102', roomNumber: '102', type: 'Private', status: 'Occupied', patientName: 'Amit Kumar' },
    { id: 'r201', roomNumber: '201', type: 'General Ward', status: 'Available' },
    { id: 'r202', roomNumber: '202', type: 'General Ward', status: 'Available' },
    { id: 'icu01', roomNumber: 'ICU-01', type: 'ICU', status: 'Occupied', patientName: 'Suresh Singh' },
];

export const initialLabTests: LabTest[] = [
    { id: 'lt001', patientName: 'Priya Patel', testName: 'Complete Blood Count (CBC)', date: '2024-07-18', status: 'Pending' },
    { id: 'lt002', patientName: 'Amit Kumar', testName: 'Lipid Panel', date: '2024-07-17', status: 'Completed', result: 'Total Cholesterol: 190 mg/dL' },
    { id: 'lt003', patientName: 'Suresh Singh', testName: 'Thyroid Panel', date: '2024-07-19', status: 'Pending' },
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
