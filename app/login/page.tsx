'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.access_token) {
        localStorage.setItem('token', response.data.access_token);
        router.push('/dashboard');
      } else {
        setError('Login failed. No token received.');
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="bg-softGray min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold text-calmBlue mb-6">Welcome Back</h1>
        <form onSubmit={handleLogin} className="space-y-6">
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
          <a href="#" className="text-calmBlue text-sm">Forgot your password?</a>
          {error && <p className="text-[#ff6b6b]">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-calmBlue text-white rounded-md font-semibold hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center">
          Don't have an account? <Link href="/register" className="text-calmBlue hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
