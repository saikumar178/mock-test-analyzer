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
        .then(res => res.json())
        .then(setAnalysis)
        .catch(err => console.error('Analysis fetch error:', err.message));

      fetch('/api/get-history')
        .then(res => res.json())
        .then(data => setHistory(data.attempts || []))
        .catch(err => console.error('History fetch error:', err.message));
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
          <p>Total Tests: <strong>{analysis.totalTests ?? 0}</strong></p>
          <p>Average Score: <strong>{analysis.avgScore.toFixed(2)}</strong></p>
          <p>
            Weak Topics:{' '}
            <strong>
              {analysis.weakTopics?.length
                ? analysis.weakTopics.map(t => t.topic).join(', ')
                : 'N/A'}
            </strong>
          </p>
          <p>
            Last Attempt:{' '}
            <strong>
              {analysis.lastAttempt
                ? new Date(analysis.lastAttempt).toLocaleString()
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
            {history.slice(0, 5).map((record, idx) => (
              <li
                key={record.id || idx}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div>
                  <p>
                    Score: <strong>{record.score}</strong> | Date:{' '}
                    <strong>{new Date(record.started_at).toLocaleString()}</strong>
                  </p>
                </div>
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
