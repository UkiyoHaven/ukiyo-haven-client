'use client';

export default function Page() {
    localStorage.removeItem('token');  // Remove the token
    window.location.href = '/login';  // Redirect to the login page
  };
