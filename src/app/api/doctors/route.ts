import { NextResponse } from 'next/server';
import { doctorAPI } from '@/lib/supabase/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const available = searchParams.get('available');

    let result;
    if (available === 'true') {
      result = await doctorAPI.getAvailable(specialization || undefined);
    } else {
      result = await doctorAPI.getAll();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await doctorAPI.create(body);

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}
