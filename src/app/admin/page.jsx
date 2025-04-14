'use client';
import { useEffect, useState } from 'react';
import AuthRoute from '../../app/components/AuthRoute';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/auth/check-admin', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        setIsAdmin(data.isAdmin);
        if (!data.isAdmin) window.location.href = '/';
      } catch (error) {
        console.error('Admin check failed:', error);
      }
    };

    verifyAdmin();
  }, []);

  return (
    <AuthRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {isAdmin ? (
          <div className="bg-green-100 p-4 rounded-lg">
            <p>Welcome Admin!</p>
            {/* Add admin features later */}
          </div>
        ) : (
          <div className="bg-red-100 p-4 rounded-lg">
            <p>You don't have admin privileges</p>
          </div>
        )}
      </div>
    </AuthRoute>
  );
}