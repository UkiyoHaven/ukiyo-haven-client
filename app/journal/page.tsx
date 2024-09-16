'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

type JournalEntry = {
  entry: string;
  createdAt: string;
};

export default function Journal() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    };
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await api.post('/journal', { entry }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEntry('');  // Reset input
    const res = await api.get('/journal', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEntries(res.data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl">Daily Reflection Journal</h1>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your daily reflection..."
          className="w-80 h-40 p-2 border text-black"
        />
        <button type="submit" className="mt-4 bg-calmBlue text-white py-2 px-4 rounded">Save Entry</button>
      </form>
      <div className="mt-10 w-80">
        <h2 className="text-2xl">Your Journal Entries</h2>
        {entries.map((item, index) => (
          <div key={index} className="mt-4 p-4 border rounded">
            <p>{item.entry}</p>
            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
