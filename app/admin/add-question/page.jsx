// app/admin/add-question/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddQuestionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    subject: '',
    topic: '',
    question_text: '',
    option_1: '',
    option_2: '',
    option_3: '',
    option_4: '',
    correct_option: '',
    difficulty:'',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    const res = await fetch('/api/admin/add-question-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to add question');
    } else {
      setSuccess('Question added successfully!');
      setForm({
        subject: '',
        topic: '',
        question_text: '',
        option_1: '',
        option_2: '',
        option_3: '',
        option_4: '',
        correct_option: '',
        difficulty:'',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">➕ Add New Question</h1>

      <div className="space-y-4">
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Subject</option>
          <option value="Math">Math</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
        </select>

        <input
          type="text"
          name="topic"
          placeholder="Topic"
          value={form.topic}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="question_text"
          placeholder="Enter question"
          value={form.question_text}
          onChange={handleChange}
          rows={4}
          className="w-full border p-2 rounded"
        />

        {[1, 2, 3, 4].map((num) => (
          <input
            key={num}
            type="text"
            name={`option_${num}`}
            placeholder={`Option ${num}`}
            value={form[`option_${num}`]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}

        <input
          type="text"
          name="correct_option"
          placeholder="Correct Option (should match exactly one of the options)"
          value={form.correct_option}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
  name="difficulty"
  value={form.difficulty}
  onChange={handleChange}
  className="w-full border p-2 rounded"
  required
>
  <option value="">Select Difficulty</option>
  <option value="HARD">HARD</option>
  <option value="MEDIUM">MEDIUM</option>
  <option value="EASY">EASY</option>
</select>

        {error && <p className="text-red-600 font-semibold">{error}</p>}
        {success && <p className="text-green-600 font-semibold">{success}</p>}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => router.push('/admin/questions')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ← Go Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
}
