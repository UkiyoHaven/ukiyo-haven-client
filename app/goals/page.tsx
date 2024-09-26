'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { AxiosError } from 'axios';
import withAuth from '@/utils/withAuth';
import NavBar from '@/components/NavBar'; // Import NavBar

type Goal = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  deadline?: string;
};

function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/goals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    };
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in local storage');
      return;
    }

    try {
      await api.post(
        '/goals',
        {
          title: newGoal.title,
          description: newGoal.description,
          deadline: newGoal.deadline || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewGoal({ title: '', description: '', deadline: '' });
      const res = await api.get('/goals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Error creating goal:', err.response?.data || err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const handleCompleteGoal = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await api.patch(
        `/goals/${id}`,
        { completed: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await api.get('/goals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Error completing goal:', err.response?.data || err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  return (
    <>
      <NavBar />  {/* Add Navigation Bar */}
      <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl mb-8">Personal Growth Goals</h1>
    <form className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Goal Title"
        className="w-80 p-3 border rounded bg-gray-900 text-gray-300"
      />
      <textarea
        placeholder="Description"
        className="w-80 h-32 p-3 border rounded bg-gray-900 text-gray-300"
      />
      <input
        type="date"
        className="w-80 p-3 border rounded bg-gray-900 text-gray-300"
      />
      <button className="mt-6 bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition">
        Create Goal
      </button>
    </form>
    <div className="mt-10 w-80">
      <h2 className="text-2xl">Your Goals</h2>
      {goals.map((goal, index) => (
        <div key={index} className="mt-4 p-4 bg-gray-800 rounded shadow-md">
          <h3 className="font-semibold">{goal.title}</h3>
          <p>{goal.description}</p>
          <small>{new Date(goal.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  </div>
    </>
  );
}

export default withAuth(Goals);
