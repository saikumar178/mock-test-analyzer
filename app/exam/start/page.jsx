'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ExamStartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(3 * 60 * 60); // 3 hours in seconds
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const timerRef = useRef(null);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/get-questions')
        .then((res) => res.json())
        .then((data) => {
          const shuffled = shuffleArray(data.questions);
          const math = shuffled.filter(q => q.subject.toLowerCase() === 'math').slice(0, 60);
          const physics = shuffled.filter(q => q.subject.toLowerCase() === 'physics').slice(0, 60);
          const chemistry = shuffled.filter(q => q.subject.toLowerCase() === 'chemistry').slice(0, 60);
          setQuestions([...math, ...physics, ...chemistry]);
        })
        .catch(err => console.error('Error fetching questions:', err));
    }
  }, [status]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('answers');
    const savedTime = localStorage.getItem('remainingTime');
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedTime) setRemainingTime(parseInt(savedTime));
  }, []);

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        const updated = prev - 1;
        localStorage.setItem('remainingTime', updated.toString());

        if (updated <= 0) {
          clearInterval(timerRef.current);
          handleSubmit(); // Auto submit
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Warn user on page refresh or tab close
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Required for modern browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleOptionSelect = (id, option) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    try {
      setIsSubmitted(true);
      clearInterval(timerRef.current);

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');

      localStorage.removeItem('answers');
      localStorage.removeItem('remainingTime');
      router.push(`/exam/result?score=${data.score}`);
    } catch (err) {
      alert('Failed to submit. Please try again.');
      console.error(err);
    }
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
      clearInterval(timerRef.current);
      localStorage.removeItem('answers');
      localStorage.removeItem('remainingTime');
      router.push('/dashboard');
    }
  };

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (status === 'loading') return <div className="text-center mt-10">Loading...</div>;
  if (!session) return <div className="text-center mt-10 text-red-600">Please login to take the test.</div>;

  const groupedQuestions = {
    Math: questions.filter(q => q.subject.toLowerCase() === 'math'),
    Physics: questions.filter(q => q.subject.toLowerCase() === 'physics'),
    Chemistry: questions.filter(q => q.subject.toLowerCase() === 'chemistry'),
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mock Test</h1>
        <div className="text-lg text-blue-600 dark:text-blue-400">
          Time Left: {formatTime(remainingTime)}
        </div>
      </div>

      {Object.entries(groupedQuestions).map(([subject, qs]) => (
        <div key={subject} className="mb-6">
          <h2 className="text-xl font-semibold mb-3">{subject}</h2>
          {qs.map((q, idx) => (
            <div key={q.id} className="mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 shadow">
              <p className="mb-2 font-medium">{idx + 1}. {q.question_text}</p>
              {[q.option_1, q.option_2, q.option_3, q.option_4].map((opt, i) => (
                <label key={i} className="block mb-1 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleOptionSelect(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowPreview(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Preview
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        <button
          onClick={handleExit}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Exit
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Preview</h3>
            {Object.entries(groupedQuestions).map(([subject, qs]) => {
              const attempted = qs.filter((q) => answers[q.id?.toString()]);
              return (
                <p key={subject} className="mb-2">
                  {subject}: {attempted.length} / {qs.length} attempted
                </p>
              );
            })}
            <p className="mt-4 font-medium">
              Total attempted: {Object.keys(answers).length}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
