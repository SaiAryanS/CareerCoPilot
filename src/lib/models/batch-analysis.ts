import { ObjectId } from 'mongodb';

export interface BatchResumeUpload {
  fileName: string;
  resumeText: string;
  uploadedAt: Date;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  error?: string;
}

export interface BatchAnalysisResult {
  fileName: string;
  matchScore: number;
  scoreRationale: string;
  matchingSkills: string[];
  missingSkills: string[];
  impliedSkills: string;
  status: string;
  analysisDate: Date;
  ranking: number;
}

export interface BatchAnalysis {
  _id?: ObjectId;
  batchId: string;
  companyId: ObjectId;
  jobDescriptionId: ObjectId;
  jobTitle: string;
  uploadedResumes: BatchResumeUpload[];
  results: BatchAnalysisResult[];
  createdAt: Date;
  completedAt?: Date;
  totalResumes: number;
  processedResumes: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export type UserRole = 'individual' | 'company' | 'coach';

export interface CompanyInfo {
  companyName: string;
  companySize: string;
  industry: string;
  website?: string;
}

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  role: UserRole;
  companyInfo?: CompanyInfo;
  createdAt: Date;
}

export interface JobDescription {
  _id?: ObjectId;
  title: string;
  description: string;
  visibility: 'public' | 'private';
  createdBy: ObjectId;
  companyId?: ObjectId;
  isActive: boolean;
  createdAt: Date;
}
