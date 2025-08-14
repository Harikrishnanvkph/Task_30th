'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import PDFEditor to avoid SSR issues
const PDFEditor = dynamic(() => import('@/components/PDFEditor'), {
  ssr: false,
  loading: () => <LoadingScreen />
});

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading PDF Editor...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PDFEditor
        showToolbar={true}
        showSidebar={true}
        showStatusBar={true}
        showMenuBar={true}
        theme="system"
        language="en"
        user={{
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          role: 'editor'
        }}
      />
    </Suspense>
  );
}
