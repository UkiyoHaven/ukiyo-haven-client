'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';

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
      router.push('/login');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Error during registration:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="bg-softGray min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold text-calmBlue mb-6">Create Account</h1>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-calmBlue text-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-calmBlue text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-calmBlue text-black"
          />
          {error && <p className="text-dangerRed">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-calmBlue text-white rounded-md font-semibold hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center">
          Already have an account? <Link href="/login" className="text-calmBlue hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
