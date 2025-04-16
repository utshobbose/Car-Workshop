'use client';
import { useEffect, useState } from 'react';

export default function Navbar({ textColor = 'text-white' }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (userId && role) {
      setUser({ id: userId, role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <nav className={`w-full absolute top-0 left-0 z-20 px-6 py-4 flex items-center justify-between ${textColor}`}>
      <div className="text-xl font-bold">Car Workshop</div>
      <div className="space-x-4 text-sm md:text-base">
        <a href="/" className="hover:underline">Home</a>
        <a href="/appointment" className="hover:underline">Appointment</a>
        {user?.role === 'admin' && (
          <a href="/admin" className="hover:underline">Admin</a>
        )}
        {!user ? (
          <>
            <a href="/signup" className="hover:underline">Sign Up</a>
            <a href="/login" className="hover:underline">Login</a>
          </>
        ) : (
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        )}
      </div>
    </nav>
  );
}
