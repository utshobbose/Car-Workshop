'use client';
import { useState, useEffect } from 'react';

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

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

      setAppointments(await appsRes.json());
      setMechanics(await mechRes.json());
    };

    fetchData();
  }, []);

  const handleUpdate = async (id, field, value) => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

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
      setAppointments(appointments.map(app => 
        app._id === id ? { ...app, [field]: value } : app
      ));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Client</th>
            <th className="py-2 px-4 border-b">License</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Mechanic</th>
            <th className="py-2 px-4 border-b">Status</th>
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
                  className="border p-1"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={appointment.mechanic?._id}
                  onChange={(e) => handleUpdate(appointment._id, 'mechanic', e.target.value)}
                  className="border p-1"
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
                  className="border p-1"
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
