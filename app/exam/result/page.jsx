'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ExamResultPage() {
  const { data: session, status } = useSession();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/get-latest-attempt')
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch latest result');
          return await res.json();
        })
        .then(setAnalysis)
        .catch((err) => {
          console.error('Error fetching latest result:', err);
          setError('Could not load your latest result.');
        });
    }
  }, [status]);
  

  if (status === 'loading') {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center mt-10 text-xl font-medium text-red-600">
        Please login to view your results.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">📊 Exam Results</h1>

      {error && (
        <div className="text-red-600 text-center mb-4 font-medium">{error}</div>
      )}

      {analysis ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
            Your Performance Overview
          </h2>

          <p className="text-gray-800 dark:text-gray-200 mb-2">
            Total Tests Taken: <strong>{analysis.totalTests ?? "0"}</strong>
          </p>

          <p className="text-gray-800 dark:text-gray-200 mb-2">
            Average Score:{' '}
            <strong>
            {typeof analysis.avgScore === "number"
              ? analysis.avgScore.toFixed(2)
              : "N/A"}
          </strong>
          </p>

          <p className="text-gray-800 dark:text-gray-200 mb-2">
            Weak Topics:{' '}
            <strong>
              {analysis.weakTopics?.length
                ? analysis.weakTopics.map((t) => t.topic).join(", ")
                : "N/A"}
            </strong>
          </p>

          <p className="text-gray-800 dark:text-gray-200">
            Last Attempt:{' '}
            <strong>
              {analysis.lastAttempt
                ? new Date(analysis.lastAttempt).toLocaleString()
                : "Never Attempted"}
            </strong>
          </p>
        </div>
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No performance data found.
        </div>
      )}

      <div className="text-center">
        <Link
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg transition font-medium"
        >
          🔙 Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
