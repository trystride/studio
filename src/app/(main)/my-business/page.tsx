
"use client";
import { CreateBusinessForm } from '@/components/forms/CreateBusinessForm';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MyBusinessPage() {
  const { user } = useAuth();

  if (user && user.role !== 'business_owner') {
    return (
       <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <Alert variant="destructive" className="max-w-lg text-center">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is for business owners only.
            If you are a business owner and believe this is an error, please check your account settings or contact support.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/map">Back to Map</Link>
        </Button>
      </div>
    );
  }
  
  // AuthGuard in layout should handle non-logged in users,
  // but this provides an extra check for role.
  if (!user) {
    return null; // Or a loading state if AuthGuard hasn't redirected yet
  }

  return (
    <div>
      <CreateBusinessForm />
    </div>
  );
}
