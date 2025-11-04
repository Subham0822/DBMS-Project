import { NextResponse } from 'next/server';
import { appointmentAPI } from '@/lib/supabase/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    let result;
    if (patientId) {
      result = await appointmentAPI.getByPatient(parseInt(patientId));
    } else if (doctorId) {
      result = await appointmentAPI.getByDoctor(parseInt(doctorId));
    } else {
      result = await appointmentAPI.getAll();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await appointmentAPI.book(body);

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    // The RPC returns an array with { success, message, appointment_id }
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      const response = result.data[0];
      if (!response.success) {
        return NextResponse.json({ error: response.message || 'Failed to book appointment' }, { status: 400 });
      }
      return NextResponse.json({ 
        success: true, 
        message: response.message,
        appointment_id: response.appointment_id 
      }, { status: 201 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
