// Updated AdminQuestionsPage with wider buttons, add button, and routing to edit/create pages
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/get-questions')
      .then(res => res.json())
      .then(data => {
        if (data?.questions) setQuestions(data.questions);
        else console.error('No questions received');
      })
      .catch(err => console.error('Failed to fetch questions:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/admin/delete-question/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuestions(prev => prev.filter(q => q.id !== id));
        alert('Deleted successfully');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredQuestions =
    subjectFilter === 'All'
      ? questions
      : questions.filter((q) => q.subject.toLowerCase() === subjectFilter.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <button
            onClick={() => router.push('/admin/')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ← Go Back
          </button>
        <h1 className="text-3xl font-bold text-blue-600">📋 Manage Questions</h1>
        
        <button
          onClick={() => router.push('/admin/add-question')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          ➕ Add Question
        </button>
      </div>

      {/* Subject Filter */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Subject:</label>
        <select
          className="border rounded px-3 py-1"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Math">Math</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-400">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="border px-4 py-2">Subject</th>
              <th className="border px-4 py-2">Topic</th>
              <th className="border px-4 py-2">Question</th>
              <th className="border px-4 py-2">Correct</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q) => (
              <tr key={q.id}>
                <td className="border px-4 py-2">{q.subject}</td>
                <td className="border px-4 py-2">{q.topic}</td>
                <td className="border px-4 py-2">{q.question_text}</td>
                
                <td className="border px-4 py-2">{q.correct_option}</td>
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => router.push(`/admin/edit-question/${q.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-1 rounded"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredQuestions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No questions found for this subject.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
