import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ message: 'User email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get user
    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user || user.role !== 'company') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Fetch batches for this company
    const batches = await db.collection('batchAnalyses')
      .find({ companyId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Fetch jobs count
    const jobsCount = await db.collection('jobs')
      .countDocuments({ createdBy: user._id });

    // Calculate stats
    const totalBatches = batches.length;
    const totalResumesAnalyzed = batches.reduce((sum, b) => sum + (b.totalResumes || 0), 0);
    const completedBatches = batches.filter(b => b.status === 'completed');
    const avgMatchScore = completedBatches.length > 0
      ? Math.round(completedBatches.reduce((sum, b) => sum + (b.averageScore || 0), 0) / completedBatches.length)
      : 0;

    return NextResponse.json({
      batches,
      stats: {
        totalBatches,
        totalResumesAnalyzed,
        activeJobs: jobsCount,
        avgMatchScore,
      },
      companyName: user.companyInfo?.companyName || 'Your Company',
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return NextResponse.json({ 
      message: 'An internal server error occurred' 
    }, { status: 500 });
  }
}
