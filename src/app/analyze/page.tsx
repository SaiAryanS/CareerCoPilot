"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CareerPilotClient from '@/components/career-pilot/career-pilot-client';

export default function AnalyzePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 pt-24 sm:pt-28 md:pt-32">
      <CareerPilotClient />
    </main>
  );
}
