'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/get-analysis')
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch');
          }
          return res.json();
        })
        .then(setAnalysis)
        .catch((err) => console.error('Failed to fetch analysis:', err.message));
    }
  }, [status]);
  

  if (status === 'loading') {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center mt-10 text-xl font-medium text-red-600">
        Please login to view your dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user.name}!</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        You can now take the combined test for Math, Physics, and Chemistry.
      </p>

      {analysis && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">Your Performance</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Total Tests: <strong>{analysis.total_tests || 0}</strong>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Average Score:{' '}
            <strong>
              {typeof analysis.avg_score === 'number'
                ? analysis.avg_score.toFixed(2)
                : '0.00'}
            </strong>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Weak Topics: <strong>{analysis.weak_topics || 'N/A'}</strong>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Last Attempt:{' '}
            <strong>
              {analysis.last_attempt
                ? new Date(analysis.last_attempt).toLocaleString()
                : 'Never'}
            </strong>
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">
            Recent Test History
          </h2>
          <ul className="space-y-2">
            {history.map((record, idx) => (
              <li
                key={record.id || idx}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    Score: <strong>{record.score}</strong> | Date:{' '}
                    <strong>
                      {new Date(record.test_date).toLocaleString()}
                    </strong>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Subject: {record.subject || 'Mixed'}
                  </p>
                </div>
                {/* Delete button (optional) */}
                {/* <button className="text-red-600 hover:text-red-800">🗑️</button> */}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/exam/start"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg font-medium transition"
      >
        🎯 Start Full Test
      </Link>
    </div>
  );
}
