'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';  // Import AxiosError for better error handling
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
        <div className="bg-black/95  h-screen flex items-center justify-center">
            <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4">
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-200">
                        Join the <span className="text-purple-600">floating</span> world <span className="text-purple-600">Ukiyo</span>
                    </h1>
                </div>
                <div className="flex flex-col mx-10 justify-center items-center w-full md:w-1/2 p-8 bg-black/30 rounded-md">
                    <h2 className="text-3xl mb-4 text-gray-200">Welcome Back!</h2>
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mt-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="p-3 text-gray-700 rounded-md border-2"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="p-3 text-gray-700 rounded-md border-2"
                        />
                        <a href="#" className="text-purple-600 text-sm">Forgot your password?</a>
                        <button type="submit" className="p-3 bg-purple-600 rounded-md text-white text-center">Login</button>
                        {error && <p className="text-red-500">{error}</p>}
                        <Link href='/register' key='/register'>Don't have an account? Feel free to <span className='text-purple-600'>SignUp</span></Link>
                    </form>
                </div>
            </div>
        </div>


    );
}
