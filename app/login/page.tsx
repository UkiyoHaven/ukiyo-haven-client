'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';  // Import AxiosError for better error handling

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });

      // If the response contains the access token, save it and redirect
      if (response.data?.access_token) {
        localStorage.setItem('token', response.data.access_token);  // Save JWT token
        router.push('/dashboard');  // Redirect to dashboard after login
      } else {
        setError('Login failed. No token received.');
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        // If error is due to invalid credentials
        setError('Invalid credentials. Please try again.');
      } else {
        // For any other type of error
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
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
        <button type="submit" className="bg-calmBlue text-white py-2 px-4 rounded">Login</button>
      </form>
    </div>
  );
}
