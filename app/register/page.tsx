'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      router.push('/login');  // Redirect to login after registration
    } catch (err) {
      if (err instanceof AxiosError) {
        // Access the error response if it's an Axios error
        console.error('Error during registration:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        // Handle any other type of error
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="text-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-black"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-calmBlue text-white py-2 px-4 rounded">Register</button>
      </form>
    </div>
  );
}
