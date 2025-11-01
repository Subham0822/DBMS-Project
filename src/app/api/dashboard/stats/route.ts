import { NextResponse } from 'next/server';
import { dashboardAPI } from '@/lib/supabase/api';

export async function GET() {
  try {
    const stats = await dashboardAPI.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
