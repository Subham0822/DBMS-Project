import { NextResponse } from 'next/server';
import { labTestAPI } from '@/lib/supabase/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    let result;
    if (patientId) {
      result = await labTestAPI.getByPatient(parseInt(patientId));
    } else {
      result = await labTestAPI.getAll();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lab tests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await labTestAPI.create(body);

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lab test' },
      { status: 500 }
    );
  }
}
