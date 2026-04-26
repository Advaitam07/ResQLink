"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentUser } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('ResQLink_currentUser');
      if (!user) {
        router.push('/login');
      } else {
        setIsLoaded(true);
      }
    }
  }, [router]);

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-transparent">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="p-10 max-w-[1400px] mx-auto w-full">
      {children}
    </main>
  );
}
