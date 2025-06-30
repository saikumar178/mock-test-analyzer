'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {use} from 'react';

export default function EditQuestionPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {id} = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    question_text: '',
    option_1: '',
    option_2: '',
    option_3: '',
    option_4: '',
    correct_option: '',
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetch(`/api/admin/get-questions/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.question) {
            setFormData(data.question);
          } else {
            setError('Question not found');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load question');
          setLoading(false);
        });
    }
  }, [status, id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/edit-question/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Question updated successfully');
      router.push('/admin/questions');
    } else {
      alert('Update failed');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Edit Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['subject', 'topic', 'question_text', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_option'].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize mb-1" htmlFor={field}>{field.replace('_', ' ')}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
        <div className='m-2 p-2 '>
        <button 
            onClick={() => router.push('/admin/questions')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-5"
          >
            ← Go Back
          </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Update Question
        </button>
        </div>
      </form>
    </div>
  );
}
