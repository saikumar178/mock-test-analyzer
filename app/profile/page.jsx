'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async () => {
    setSaving(true);
    const res = await fetch('/api/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setSuccess('Name updated!');
      window.location.reload(); // Refresh session
    } else {
      alert('Failed to update.');
    }

    setSaving(false);
  };

  if (status === 'loading') {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="text-center mt-10 text-red-600">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 px-4 py-6 bg-white dark:bg-gray-900 rounded shadow-lg text-gray-900 dark:text-white">
      <div className="flex flex-col items-center">
        <img
          src={session.user.image || '/profile_pic.jpg'}
          alt="Profile"
          className="w-24 h-24 rounded-full border mb-4"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          placeholder="Your name"
        />
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-3 w-full"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {success && (
          <p className="text-green-500 font-medium mb-3">{success}</p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
