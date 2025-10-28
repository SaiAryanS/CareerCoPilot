import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to extract text from PDF buffer
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting PDF extraction, buffer size:', buffer.length);
      
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('PDF parsing error:', errData.parserError);
        reject(new Error(`PDF parsing failed: ${errData.parserError}`));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from all pages
          let text = '';
          if (pdfData.Pages) {
            pdfData.Pages.forEach((page: any) => {
              if (page.Texts) {
                page.Texts.forEach((textItem: any) => {
                  if (textItem.R) {
                    textItem.R.forEach((r: any) => {
                      if (r.T) {
                        try {
                          // Try to decode, but if it fails, use the raw text
                          text += decodeURIComponent(r.T) + ' ';
                        } catch (decodeError) {
                          // If decoding fails, use the raw text
                          text += r.T + ' ';
                        }
                      }
                    });
                  }
                });
              }
              text += '\n';
            });
          }
          
          console.log('PDF extraction successful, text length:', text.length);
          resolve(text.trim());
        } catch (error) {
          reject(new Error(`Failed to process PDF data: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });
      
      // Parse the buffer
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error('PDF extraction error:', error);
      reject(new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

// Helper function to analyze a resume against job description
async function analyzeResume(resumeText: string, jobDescription: string): Promise<any> {
  try {
    console.log('Starting AI analysis, resume length:', resumeText.length);
    
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        prompt: `You are an expert resume analyzer. Analyze this resume against the job description and provide a detailed assessment.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no other text):
{
  "matchScore": <number 0-100>,
  "status": "<Approved|Needs Improvement|Not a Match>",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "impliedSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 500,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('AI response received');
    const analysisText = data.response;
    
    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedData = JSON.parse(jsonMatch[0]);
      console.log('Analysis successful, match score:', parsedData.matchScore);
      return parsedData;
    }
    
    console.error('No JSON found in AI response');
    throw new Error('Invalid analysis response format');
  } catch (error) {
    console.error('Analysis error:', error);
    throw error; // Re-throw to provide more specific error message
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobId = formData.get('jobId') as string;
    const userEmail = formData.get('userEmail') as string;

    if (!jobId || !userEmail) {
      return NextResponse.json({ message: 'Job ID and user email are required' }, { status: 400 });
    }

    // Get all resume files
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('resume_') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ message: 'No resume files provided' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get user and job details
    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user || user.role !== 'company') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Create batch record
    const batch = {
      companyId: user._id,
      jobId: new ObjectId(jobId),
      jobTitle: job.title,
      status: 'processing' as const,
      totalResumes: files.length,
      processedResumes: 0,
      resumes: [] as any[],
      results: [] as any[],
      createdAt: new Date(),
    };

    const batchResult = await db.collection('batchAnalyses').insertOne(batch);
    const batchId = batchResult.insertedId;

    // Process resumes in the background (we'll do it synchronously for now)
    const results = [];
    let processedCount = 0;

    for (const file of files) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const resumeText = await extractTextFromPDF(buffer);
        
        // Analyze resume
        const analysis = await analyzeResume(resumeText, job.description);
        
        const result = {
          fileName: file.name,
          matchScore: analysis.matchScore,
          status: analysis.status,
          matchingSkills: analysis.matchingSkills,
          missingSkills: analysis.missingSkills,
          impliedSkills: analysis.impliedSkills,
          strengths: analysis.strengths,
          recommendations: analysis.recommendations,
          extractedText: resumeText.substring(0, 5000), // Store first 5000 chars
          processedAt: new Date(),
        };

        results.push(result);
        processedCount++;

        // Update progress
        await db.collection('batchAnalyses').updateOne(
          { _id: batchId },
          { 
            $set: { 
              processedResumes: processedCount,
              results: results 
            } 
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing ${file.name}:`, errorMessage, error);
        results.push({
          fileName: file.name,
          matchScore: 0,
          status: 'Error',
          matchingSkills: [],
          missingSkills: [],
          impliedSkills: [],
          strengths: [],
          recommendations: [`Failed to process: ${errorMessage}`],
          extractedText: '',
          processedAt: new Date(),
        });
        processedCount++;
      }
    }

    // Calculate average score
    const avgScore = results.reduce((sum, r) => sum + r.matchScore, 0) / results.length;

    // Mark batch as completed
    await db.collection('batchAnalyses').updateOne(
      { _id: batchId },
      { 
        $set: { 
          status: 'completed',
          processedResumes: processedCount,
          averageScore: Math.round(avgScore),
          results: results.sort((a, b) => b.matchScore - a.matchScore), // Sort by score descending
          completedAt: new Date(),
        } 
      }
    );

    return NextResponse.json({ 
      message: 'Batch processing completed',
      batchId: batchId.toString(),
      totalProcessed: processedCount,
      averageScore: Math.round(avgScore),
    }, { status: 200 });

  } catch (error) {
    console.error('Batch upload failed:', error);
    return NextResponse.json({ 
      message: 'An internal server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
