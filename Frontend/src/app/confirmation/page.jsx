    'use client';
    import { useEffect, useState } from 'react';

    export default function ConfirmationPage() {
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
    const stored = localStorage.getItem('lastAppointment');
    if (stored) setAppointment(JSON.parse(stored));
    }, []);

    return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Appointment Confirmed!</h1>
        
        {appointment ? (
            <div className="text-gray-700 space-y-2">
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Mechanic ID:</strong> {appointment.mechanic}</p>
            <p><strong>License No:</strong> {appointment.license}</p>
            <p><strong>Engine No:</strong> {appointment.engine}</p>
            </div>
        ) : (
            <p>Loading your appointment...</p>
        )}
        </div>
    </div>
    );
    }
