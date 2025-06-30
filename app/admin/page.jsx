'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/get-users')
        .then(res => res.json())
        .then(data => setUsers(data.users))
        .catch(err => console.error('Failed to fetch users:', err));
    }
  }, [status]);

  if (status === 'loading') return <div className="text-center mt-10">Loading...</div>;
  if (!session || session.user.role !== 'ADMIN') return <div className="text-red-600 text-center mt-10">Access Denied</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Admin Panel</h1>
      <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-10"
          >
            ← Go Back
          </button>
      <Link href="/admin/questions" className="bg-green-600 text-white px-4 py-2 rounded mb-6 inline-block hover:bg-green-700">Manage Questions</Link>

      <h2 className="text-xl font-semibold mt-6 mb-3">Registered Students</h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-black-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.isVerified ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
