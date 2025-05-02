'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/get-history')
        .then(res => res.json())
        .then(data => setAttempts(data.attempts))
        .catch(err => console.error('Error fetching attempts:', err));
    }
  }, [status]);

  if (status === 'loading') return <div className="text-center mt-10">Loading...</div>;
  if (!session) return <div className="text-center mt-10 text-red-600">Please login first.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Your Test History</h1>

      {attempts.length === 0 ? (
        <p>No test attempts yet.</p>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="border p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
              <p><span className="font-semibold">Attempt ID:</span> {attempt.id}</p>
              <p><span className="font-semibold">Score:</span> {attempt.score}</p>
              <p><span className="font-semibold">Date:</span> {new Date(attempt.started_at).toLocaleString()}</p>
              <button
                onClick={() => router.push(`/history/${attempt.id}`)}
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                View Details
              </button>
              <button
  onClick={() => router.push('/analysis')}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
>
  Analyze Performance
</button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
