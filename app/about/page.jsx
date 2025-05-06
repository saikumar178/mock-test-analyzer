'use client';

import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch('/api/total-users');
        const data = await res.json();
        setUserCount(data.count);
      } catch (error) {
        console.error('Failed to fetch user count', error);
      }
    };

    fetchUserCount();
  }, []);

  const getFormattedCount = (count) => {
    if (count === null) return '...';
    if(count< 10) return count;
    if (count >= 10) return '10+';
    if (count >= 20) return '20+';
    if (count >= 50) return '50+';
    if (count >= 100) return '100+';
    if (count >= 500) return '500+';
    return '1000+';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>

      <p className="mb-6">
        Welcome to <span className="font-semibold">Mock Test Analyzer</span> – your personalized tool to track and improve your test performance. 
        Whether you're preparing for competitive exams or just brushing up on concepts, we're here to help you get better with every attempt.
      </p>

      <div className="mb-6 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg shadow">
        🎉 <strong>{getFormattedCount(userCount)}</strong> students have joined us so far!
      </div>

      <h2 className="text-2xl font-semibold mb-2">🚀 Our Mission</h2>
      <p className="mb-6">
        To empower students by providing clear, actionable insights into their mock test performance — helping them identify strengths and overcome weaknesses efficiently.
      </p>

      <h2 className="text-2xl font-semibold mb-2">🧠 Key Features</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Track all your test attempts in one place</li>
        <li>Analyze your performance by subject and topic</li>
        <li>Visualize your progress using interactive charts</li>
        <li>Identify weak areas to focus on improvement</li>
        <li>Access overall and per-attempt analysis</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">💡 Who is this for?</h2>
      <p className="mb-6">
        Students preparing for competitive exams, school assessments, or anyone looking to evaluate and improve their academic performance with data-driven feedback.
      </p>

      <h2 className="text-2xl font-semibold mb-2">📬 Get in Touch</h2>
      <p className="mb-2">
        Have feedback or need help? Reach out to us anytime at <a href="mailto:karu3570@gmail.com" className="text-blue-600 hover:underline">support@mocktestanalyzer.com</a>.
      </p>
    </div>
  );
}
