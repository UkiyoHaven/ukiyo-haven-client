'use client';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

type Goal = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  deadline?: string;
};

export default function Goals() {
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
  };

  const handleCompleteGoal = async (id: number) => {
    const token = localStorage.getItem('token');
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
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl">Personal Growth Goals</h1>
      <form onSubmit={handleCreateGoal} className="mt-4 flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Goal Title"
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          required
          className="border p-2"
        />
        <textarea
          placeholder="Description"
          value={newGoal.description}
          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          className="border p-2"
        />
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          className="border p-2"
        />
        <button type="submit" className="bg-calmBlue text-white py-2 px-4 rounded">Create Goal</button>
      </form>

      <div className="mt-10 w-80">
        <h2 className="text-2xl">Your Goals</h2>
        {goals.map((goal) => (
          <div key={goal.id} className="mt-4 p-4 border rounded">
            <p><strong>{goal.title}</strong></p>
            <p>{goal.description}</p>
            {goal.deadline && <small>Deadline: {new Date(goal.deadline).toLocaleDateString()}</small>}
            <button onClick={() => handleCompleteGoal(goal.id)} disabled={goal.completed} className="mt-2 bg-green-500 text-white py-2 px-4 rounded">
              {goal.completed ? 'Completed' : 'Mark as Completed'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
