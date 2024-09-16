'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        // If token is not found, redirect to the login page
        router.push('/login');
      }
    }, [router]);

    // Render the wrapped component only if the token exists
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
