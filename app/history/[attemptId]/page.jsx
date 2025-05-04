'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function AttemptDetailsPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/get-attempt/${attemptId}`)
      .then((res) => res.json())
      .then((data) => {
        setAttempt(data.attempt);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch attempt details:', err);
        setLoading(false);
      });
  }, [attemptId]);
  const handleExit = () => {
      router.push('/history');
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!attempt) return <div className="text-center mt-10 text-red-600">Attempt not found</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Attempt Details</h1>

      <div className="space-y-6">
        {attempt.records.map((record, index) => (
          <div key={record.id} className="border p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
            <h2 className="font-semibold mb-2">
              {index + 1}. {record.question.question_text}
            </h2>
            <div className="ml-4">
              <p>
                <strong>Your Answer:</strong>{' '}
                <span className={record.correct ? 'text-green-600' : 'text-red-600'}>
                  {record.selected_option || 'Not answered'}
                </span>
              </p>
              <p>
                <strong>Correct Answer:</strong> {record.question.correct_option}
              </p>
            </div>
          </div>
        ))}
        
      </div>
      <button
          onClick={handleExit}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Exit
        </button>
    </div>
  );
}