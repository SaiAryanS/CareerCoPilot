import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  skills: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private']).default('private'),
});

// GET - Fetch all jobs for the logged-in company
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

    // Fetch jobs created by this company
    const jobs = await db.collection('jobs')
      .find({ createdBy: user._id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(jobs, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json({ 
      message: 'An internal server error occurred' 
    }, { status: 500 });
  }
}

// POST - Create a new job
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = jobSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        message: 'Invalid input', 
        errors: validation.error.errors 
      }, { status: 400 });
    }

    const { title, description, skills, visibility } = validation.data;
    const { userEmail } = body;

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

    // Create job
    const job = {
      title,
      description,
      skills: skills || [],
      visibility: visibility || 'private',
      createdBy: user._id,
      companyId: user._id,
      companyName: user.companyInfo?.companyName || 'Unknown Company',
      createdAt: new Date(),
    };

    const result = await db.collection('jobs').insertOne(job);

    return NextResponse.json({ 
      message: 'Job created successfully',
      jobId: result.insertedId,
      job: { ...job, _id: result.insertedId }
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create job:', error);
    return NextResponse.json({ 
      message: 'An internal server error occurred' 
    }, { status: 500 });
  }
}
