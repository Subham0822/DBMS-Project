import { NextResponse } from 'next/server';
import { roomAPI } from '@/lib/supabase/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const available = searchParams.get('available');

    let result;
    if (available === 'true') {
      result = await roomAPI.getAvailable(type || undefined);
    } else {
      result = await roomAPI.getAll();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
