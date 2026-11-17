'use client';
import { useEffect } from 'react';
import Button from '@/components/ui/button/button';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-8">
      <div className="max-w-md">
        <h1 className="font-display text-2xl text-ink mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-neutral-700 mb-6">
          The page hit an unexpected error. Reloading usually fixes it.
        </p>
        <Button type="button" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    </div>
  );
}