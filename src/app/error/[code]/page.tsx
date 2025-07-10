'use client';
import { getHttpErrorInfo } from "@/utils/errors";
import Link from "next/link";
import { use } from "react";

interface ErrorPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function ErrorPage({ params }: ErrorPageProps) {
  const { code } = use(params);

  const errorContent = getHttpErrorInfo(code);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
          {errorContent.title}
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {errorContent.message}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {errorContent.description}
        </p>
        <div className="mt-6 space-x-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Go to Homepage
          </Link>
          {errorContent.showGoBack && (
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
