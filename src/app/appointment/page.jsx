'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentPage() {
  const router = useRouter();
  const [mechanics, setMechanics] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [carDetails, setCarDetails] = useState({
    licenseNumber: '',
    engineNumber: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const userId = localStorage.getItem('userId');
  // const role = localStorage.getItem('role');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('')


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId') || '');
      setRole(localStorage.getItem('role') || '');
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetch(`http://localhost:5000/api/mechanics?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => setMechanics(data))
        .catch(() => setError('Failed to load mechanics'));
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!selectedDate || !selectedMechanic || !carDetails.licenseNumber || !carDetails.engineNumber) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
          'user-role': role
        },
        body: JSON.stringify({
          mechanicId: selectedMechanic,
          carDetails,
          appointmentDate: selectedDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      router.push('/confirmation');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Book Your Appointment
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Appointment Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Select Mechanic</label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={selectedMechanic}
            onChange={(e) => setSelectedMechanic(e.target.value)}
            required
            disabled={!selectedDate}
          >
            <option value="">Choose a mechanic</option>
            {Array.isArray(mechanics) &&
             mechanics.map(mechanic => (
              <option key={mechanic._id} value={mechanic._id} disabled={mechanic.availableSlots === 0}>
                {mechanic.name} - {mechanic.availableSlots} slots available
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">License Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ABC123"
              value={carDetails.licenseNumber}
              onChange={(e) => setCarDetails({ ...carDetails, licenseNumber: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Engine Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Engine number"
              value={carDetails.engineNumber}
              onChange={(e) => setCarDetails({ ...carDetails, engineNumber: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white rounded-md transition-colors ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}
