"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

interface Job {
  _id: string;
  title: string;
  description: string;
}

export default function BulkUploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Check authentication and role
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');

    if (!isLoggedIn || userRole !== 'company') {
      router.push('/login');
      return;
    }

    // Fetch company jobs
    fetchJobs();
  }, [router]);

  const fetchJobs = async () => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const response = await fetch(`/api/company/jobs?userEmail=${userEmail}`);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const newFiles: UploadedFile[] = fileArray.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Validate file count
    if (files.length + newFiles.length > 50) {
      toast({
        variant: "destructive",
        title: "Too Many Files",
        description: "You can upload up to 50 resumes per batch.",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    );

    if (droppedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid Files",
        description: "Please upload only PDF files.",
      });
      return;
    }

    const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    if (files.length + newFiles.length > 50) {
      toast({
        variant: "destructive",
        title: "Too Many Files",
        description: "You can upload up to 50 resumes per batch.",
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStartAnalysis = async () => {
    if (!selectedJob) {
      toast({
        variant: "destructive",
        title: "Job Required",
        description: "Please select a job description first.",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No Files",
        description: "Please upload at least one resume.",
      });
      return;
    }

    setIsProcessing(true);
    setIsLoading(true);
    setOverallProgress(0);

    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const formData = new FormData();
      formData.append('jobId', selectedJob);
      formData.append('userEmail', userEmail || '');
      
      files.forEach((fileObj, index) => {
        formData.append(`resume_${index}`, fileObj.file);
      });

      toast({
        title: "Processing Started",
        description: `Analyzing ${files.length} resumes. This may take a few minutes...`,
      });

      // Simulate progress while waiting for API
      const progressInterval = setInterval(() => {
        setOverallProgress((prev) => Math.min(prev + 5, 90));
      }, 500);

      const response = await fetch('/api/company/batch-upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setOverallProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process batch');
      }

      toast({
        title: "Analysis Complete!",
        description: `${data.totalProcessed} resumes analyzed. Average score: ${data.averageScore}%`,
      });

      // Redirect to results page
      setTimeout(() => {
        router.push(`/company/candidates/${data.batchId}`);
      }, 1500);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to start batch analysis.",
      });
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-headline font-bold">Bulk Resume Upload</h1>
          <p className="text-muted-foreground mt-2">
            Upload multiple resumes and analyze them against a job description
          </p>
        </div>

        {/* Job Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Job Description</CardTitle>
            <CardDescription>
              Choose the job posting to match candidates against
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a job posting" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job._id} value={job._id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {jobs.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No jobs found. <a href="/company/jobs/new" className="underline">Create a job</a> first.
              </p>
            )}
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Upload Resumes</CardTitle>
            <CardDescription>
              Drag and drop PDF files or click to browse (up to 50 resumes)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragging ? (
                <p className="text-lg font-medium">Drop the files here...</p>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop resume files here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to select files (PDF only, max 50 files)
                  </p>
                </>
              )}
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Uploaded Files ({files.length}/50)
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                    disabled={isProcessing}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4">
                  {files.map((fileObj) => (
                    <div
                      key={fileObj.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {fileObj.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(fileObj.file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {fileObj.status === 'success' && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {fileObj.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        {fileObj.status === 'pending' && !isProcessing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(fileObj.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processing Progress */}
        {isProcessing && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Batch</CardTitle>
              <CardDescription>
                Analyzing resumes against job requirements...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={overallProgress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {overallProgress}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/company/dashboard')}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStartAnalysis}
            disabled={!selectedJob || files.length === 0 || isProcessing}
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start Batch Analysis
            <Badge variant="secondary" className="ml-2">
              {files.length} files
            </Badge>
          </Button>
        </div>
      </div>
    </main>
  );
}
