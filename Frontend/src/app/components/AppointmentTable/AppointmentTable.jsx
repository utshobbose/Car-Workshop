'use client';
import { useState, useEffect } from 'react';

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId') || '');
      setRole(localStorage.getItem('role') || '');
    }
  }, []);

  useEffect(() => {
    if (!userId || !role) return;

    const fetchData = async () => {
      const [appsRes, mechRes] = await Promise.all([
        fetch('http://localhost:5000/api/appointments', {
          headers: {
            'user-id': userId,
            'user-role': role
          }
        }),
        fetch('http://localhost:5000/api/mechanics')
      ]);

      const apps = await appsRes.json();
      const mechs = await mechRes.json();
      setAppointments(apps);
      setMechanics(mechs);
    };

    fetchData();
  }, [userId, role]);

  const handleUpdate = async (id, field, value) => {
    const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,
        'user-role': role
      },
      body: JSON.stringify({ [field]: value })
    });

    if (res.ok) {
      setAppointments(prev =>
        prev.map(app => (app._id === id ? { ...app, [field]: value } : app))
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-blue-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Client</th>
            <th className="py-2 px-4 border-b text-left">License</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Mechanic</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment._id}>
              <td className="py-2 px-4 border-b">{appointment.user?.name}</td>
              <td className="py-2 px-4 border-b">{appointment.carDetails.licenseNumber}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="date"
                  value={new Date(appointment.appointmentDate).toISOString().split('T')[0]}
                  onChange={(e) => handleUpdate(appointment._id, 'appointmentDate', e.target.value)}
                  className="border p-1 rounded"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={appointment.mechanic?._id}
                  onChange={(e) => handleUpdate(appointment._id, 'mechanic', e.target.value)}
                  className="border p-1 rounded"
                >
                  {mechanics.map(mechanic => (
                    <option key={mechanic._id} value={mechanic._id}>
                      {mechanic.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={appointment.status}
                  onChange={(e) => handleUpdate(appointment._id, 'status', e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
