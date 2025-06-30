// app/leaderboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaders(data.users || []))
      .catch(err => console.error('Failed to fetch leaderboard:', err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-blue-300">
        🏆 Leaderboard
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow-md">
          <thead>
            <tr className="bg-blue-100 dark:bg-gray-800 text-left">
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Tests Attempted</th>
              <th className="px-6 py-3">Average Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => (
              <tr
                key={user.id}
                className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 font-semibold">#{index + 1}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <Image
                    src={user.image || '/profile_pic.jpg'}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full border"
                  />
                  <span className="font-medium">{user.name}</span>
                </td>
                <td className="px-6 py-4">{user.testCount}</td>
                <td className="px-6 py-4">{user.avgScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
