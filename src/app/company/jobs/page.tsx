"use client";

import { useEffect } from "react";
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
import { Plus, Briefcase } from "lucide-react";

export default function CompanyJobsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication and role
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');

    if (!isLoggedIn || userRole !== 'company') {
      router.push('/login');
      return;
    }
  }, [router]);

  return (
    <main className="min-h-screen p-6 pt-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold">Manage Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your job postings
            </p>
          </div>
          <Button asChild>
            <Link href="/company/jobs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
            </Link>
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first job posting to start analyzing candidates
              </p>
              <Button asChild>
                <Link href="/company/jobs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>What are job postings?</CardTitle>
            <CardDescription>
              Job postings help you analyze candidates effectively
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              • <strong>Private Postings:</strong> Only visible to your company
            </p>
            <p className="text-sm">
              • <strong>Bulk Analysis:</strong> Upload multiple resumes to match against a job
            </p>
            <p className="text-sm">
              • <strong>AI Scoring:</strong> Get AI-powered match scores for each candidate
            </p>
            <p className="text-sm">
              • <strong>Ranked Results:</strong> See candidates ranked by fit
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
