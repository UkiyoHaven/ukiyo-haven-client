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
        <div className="bg-black/95  h-screen flex items-center justify-center">
            <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4">
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-200">
                    Join the <span className="text-purple-600">floating</span> world <span className="text-purple-600">Ukiyo</span>
                    </h1>
                </div>
                <div className="flex flex-col mx-10 justify-center items-center w-full md:w-1/2 p-8 bg-black/30 rounded-md">
                    <h2 className="text-3xl mb-4 text-gray-200">Glad to Have you!</h2>
                    <form onSubmit={handleRegister} className="w-full flex flex-col gap-4 mt-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="p-3 text-gray-700 rounded-md border-2"
                        />
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
                        {error && <p className="text-red-500">{error}</p>}
                        <button type="submit" className="p-3 bg-purple-600 rounded-md text-white text-center">Register</button>
                        <Link href='/login' key='/login'>Already have an account? <span className='text-purple-600'>Login</span> instead</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
