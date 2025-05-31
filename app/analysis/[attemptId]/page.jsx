'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AnalysisPage() {
  const [data, setData] = useState(null);
  const params = useParams();
  const attemptId = params.attemptId;

  useEffect(() => {
    fetch(`/api/get-ana/${attemptId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched analysis:', data);
        setData(data);
      })
      .catch((err) => console.error('Error loading analysis:', err));
  }, [attemptId]);

  if (!data) {
    return <div className="text-center mt-10">Loading analysis...</div>;
  }

  if (!Array.isArray(data.weakTopics) || !Array.isArray(data.strongTopics)) {
    return <div className="text-center mt-10">Invalid analysis data.</div>;
  }

  // Combine weak + strong topics for chart
  const chartData = [...data.weakTopics, ...data.strongTopics];
  const labels = chartData.map((item) => item.topic);
  const accuracies = chartData.map((item) => parseFloat(item.accuracy));


  const chartConfig = {
    labels,
    datasets: [
      {
        label: 'Accuracy %',
        data: accuracies,
        backgroundColor: chartData.map((item) =>
          parseFloat(item.accuracy) >= 80 ? '#22c55e' : '#ef4444'
        ),        
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}% accuracy`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Performance Analysis</h1>

      <div className="mb-8">
        <Bar data={chartConfig} options={options} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">🚨 Weak Topics</h2>
          {data.weakTopics.length === 0 ? (
            <p>No weak topics detected yet!</p>
          ) : (
            <ul className="list-disc ml-6">
              {data.weakTopics.map(({ topic, accuracy }) => (
  <p key={topic}>🚨 {topic} — Accuracy: {accuracy}%</p>
))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">💪 Strong Topics</h2>
          {data.strongTopics.length === 0 ? (
            <p>No strong topics detected yet!</p>
          ) : (
            <ul className="list-disc ml-6">
              {data.strongTopics.map(({ topic, accuracy }) => (
  <p key={topic}>💪 {topic} — Accuracy: {accuracy}%</p>
))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
