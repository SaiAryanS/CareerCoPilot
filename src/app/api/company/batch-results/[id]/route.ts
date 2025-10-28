import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batchId = id;

    if (!batchId || !ObjectId.isValid(batchId)) {
      return NextResponse.json({ message: 'Invalid batch ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const batch = await db.collection('batchAnalyses').findOne({ 
      _id: new ObjectId(batchId) 
    });

    if (!batch) {
      return NextResponse.json({ message: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json(batch, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch batch:', error);
    return NextResponse.json({ 
      message: 'An internal server error occurred' 
    }, { status: 500 });
  }
}
