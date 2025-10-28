"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompanyAnalyticsPage() {
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
        <h1 className="text-4xl font-headline font-bold">Analytics</h1>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Construction className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Analytics and insights dashboard is under development
              </p>
              <Button asChild variant="outline">
                <Link href="/company/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
