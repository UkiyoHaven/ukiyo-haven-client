'use client';
import { useState, useEffect } from 'react';
import api from '../../utils/api';

type JournalEntry = {
  id: number;
  entry: string;
  createdAt: string;
};

export default function Journal() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);  // Track which entry is being edited
  const [editEntry, setEditEntry] = useState('');  // Track the edited entry

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

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    await api.delete(`/journal/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEntries(entries.filter(item => item.id !== id));  // Update UI after deletion
  };

  const handleEdit = async (id: number) => {
    setEditMode(id);  // Enter edit mode for the selected journal entry
    const entryToEdit = entries.find(item => item.id === id);
    if (entryToEdit) setEditEntry(entryToEdit.entry);
  };

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem('token');
    await api.patch(`/journal/${id}`, { entry: editEntry }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditMode(null);  // Exit edit mode
    const res = await api.get('/journal', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEntries(res.data);  // Refresh entries after update
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
            {editMode === item.id ? (
              <>
                <textarea
                  value={editEntry}
                  onChange={(e) => setEditEntry(e.target.value)}
                  className="w-80 h-40 p-2 border text-black"
                />
                <button onClick={() => handleUpdate(item.id)} className="mt-2 bg-green-500 text-white py-2 px-4 rounded">Update</button>
              </>
            ) : (
              <>
                <p>{item.entry}</p>
                <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                <button onClick={() => handleEdit(item.id)} className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="ml-2 bg-red-500 text-white py-2 px-4 rounded">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
