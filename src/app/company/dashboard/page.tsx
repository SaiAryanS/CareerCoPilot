"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Briefcase,
  Users,
  TrendingUp,
  FileText,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BatchSummary {
  _id: string;
  jobTitle: string;
  totalResumes: number;
  processedResumes: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  averageScore?: number;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalResumesAnalyzed: 0,
    activeJobs: 0,
    avgMatchScore: 0,
  });

  useEffect(() => {
    // Check authentication and role
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');
    const storedUserName = sessionStorage.getItem('userName');

    if (!isLoggedIn || userRole !== 'company') {
      router.push('/login');
      return;
    }

    setUserName(storedUserName || 'User');
    
    // Fetch company data from API
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      const response = await fetch(`/api/company/dashboard?userEmail=${userEmail}`);
      
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches);
        setStats(data.stats);
        setCompanyName(data.companyName);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      processing: "secondary",
      pending: "outline",
      failed: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold">Company Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {userName} · {companyName}
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/company/bulk-upload">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/company/jobs/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Job
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBatches}</div>
              <p className="text-xs text-muted-foreground">
                Bulk analysis sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resumes Analyzed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResumesAnalyzed}</div>
              <p className="text-xs text-muted-foreground">
                Total candidates evaluated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">
                Open positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgMatchScore}%</div>
              <p className="text-xs text-muted-foreground">
                Across all analyses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Batches */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Batch Analyses</CardTitle>
            <CardDescription>
              Your latest bulk resume analysis sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {batches.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No batches yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by uploading resumes for a job posting
                </p>
                <Button asChild>
                  <Link href="/company/bulk-upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resumes
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {batches.map((batch) => (
                  <div
                    key={batch._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{batch.jobTitle}</h3>
                        {getStatusBadge(batch.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {batch.processedResumes}/{batch.totalResumes} resumes
                        </span>
                        {batch.averageScore && (
                          <span>Avg: {batch.averageScore}%</span>
                        )}
                        <span>
                          {new Date(batch.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      disabled={batch.status !== 'completed'}
                    >
                      <Link href={`/company/candidates/${batch._id}`}>
                        View Results
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/company/bulk-upload">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Upload className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Bulk Upload</CardTitle>
                <CardDescription>
                  Upload multiple resumes for analysis
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/company/jobs">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Briefcase className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Manage Jobs</CardTitle>
                <CardDescription>
                  View and edit your job postings
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/company/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View hiring insights and trends
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
