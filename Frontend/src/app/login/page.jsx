'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backend}/api/auth/login`, formData);
      const data = res.data;

      // ✅ Store user ID and role for session
      localStorage.setItem('userId', data._id);
      localStorage.setItem('role', data.role);

      router.push(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-100 to-blue-200">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">Log In</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input type="password" placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:opacity-90 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
