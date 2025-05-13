'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { backend } from '@/app/context(testing)/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    licenseNumber: '',
    engineNumber: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backend}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      res.ok ? router.push('/login') : setError(data.error || 'Signup failed');
    } catch {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">Create Account</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["Full Name", "Address", "Phone", "Car License Number", "Car Engine Number", "Email", "Password"].map((placeholder, i) => (
            <input key={i} type={placeholder === "Password" ? "password" : placeholder === "Email" ? "email" : "text"}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setFormData({ ...formData, [Object.keys(formData)[i]]: e.target.value })} />
          ))}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg hover:opacity-90 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
