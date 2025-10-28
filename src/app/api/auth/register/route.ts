
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const passwordValidation = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,30}$/
);

const registerSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    password: z.string().refine((value) => passwordValidation.test(value)),
    role: z.enum(['individual', 'company', 'coach']).default('individual'),
    // Company-specific fields (optional)
    companyName: z.string().optional(),
    companySize: z.string().optional(),
    industry: z.string().optional(),
    website: z.string().optional(),
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.errors }, { status: 400 });
    }

    const { username, email, phoneNumber, password, role, companyName, companySize, industry, website } = validation.data;

    // Validate company fields if role is company
    if (role === 'company' && (!companyName || companyName.trim().length === 0)) {
      return NextResponse.json({ message: 'Company name is required for company accounts' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email or phone number already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user document
    const userDocument: any = {
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role: role || 'individual',
      createdAt: new Date(),
    };

    // Add company info if role is company
    if (role === 'company' && companyName) {
      userDocument.companyInfo = {
        companyName,
        companySize: companySize || undefined,
        industry: industry || undefined,
        website: website || undefined,
      };
    }

    // Create new user
    const result = await usersCollection.insertOne(userDocument);

    return NextResponse.json({ message: 'User registered successfully', userId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
