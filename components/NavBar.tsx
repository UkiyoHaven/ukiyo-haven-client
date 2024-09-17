'use client';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-calmBlue text-white w-full py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold">
          Ukiyo Haven
        </h1>
        <div className="space-x-8">
          <Link href="/goals" className="hover:text-gray-200">Goals</Link>
          <Link href="/journal" className="hover:text-gray-200">Journal</Link>
          <Link href="/discussions" className="hover:text-gray-200">Discussions</Link>
          <Link href="/login" className="hover:text-gray-200">Login</Link>
          <Link href="/register" className="hover:text-gray-200">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
