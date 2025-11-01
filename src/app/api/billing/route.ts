import { NextResponse } from 'next/server';
import { billingAPI } from '@/lib/supabase/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    let result;
    if (patientId) {
      result = await billingAPI.getByPatient(parseInt(patientId));
    } else {
      result = await billingAPI.getAll();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await billingAPI.generate(body);

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate bill' },
      { status: 500 }
    );
  }
}
