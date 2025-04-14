'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      if (adminOnly) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/check-admin', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (!res.ok) {
            router.push('/');
            return;
          }
        } catch (error) {
          console.error('Admin check failed:', error);
          router.push('/');
          return;
        }
      }

      setVerified(true);
    };

    verifyAuth();
  }, []);

  if (!verified) return <div>Loading...</div>;

  return children;
}