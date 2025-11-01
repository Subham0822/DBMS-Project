import { NextResponse } from 'next/server';
import { reportsAPI } from '@/lib/supabase/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let result;
    switch (type) {
      case 'doctor-performance':
        result = await reportsAPI.getDoctorPerformance();
        break;
      case 'patient-summary':
        result = await reportsAPI.getPatientVisitSummary();
        break;
      case 'department-stats':
        result = await reportsAPI.getDepartmentStatistics();
        break;
      case 'revenue':
        result = await reportsAPI.getRevenueReport();
        break;
      case 'room-occupancy':
        result = await reportsAPI.getRoomOccupancy();
        break;
      case 'disease-prevalence':
        result = await reportsAPI.getDiseasePrevalence();
        break;
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}
