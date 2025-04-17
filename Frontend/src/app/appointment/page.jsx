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

  // useEffect(() => {
  //   if (selectedDate) {
  //     fetch(`http://localhost:5000/api/mechanics?date=${selectedDate}`)
  //       .then(res => res.json())
  //       .then(data => setMechanics(data))
  //       .catch(() => setError('Failed to load mechanics'));
  //   }
  // }, [selectedDate]);
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mechanics?date=${formattedDate}`)
        .then(res => res.json())
        .then(data => setMechanics(data))
        .catch(() => setError('Failed to load mechanics'));
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (
      !selectedDate ||
      !selectedMechanic ||
      !carDetails.licenseNumber.trim() ||
      !carDetails.engineNumber.trim()
    ) {
      setError('All fields are required');
      setIsSubmitting(false);
      // console.log("Date:", selectedDate);
      // console.log("Mechanic:", selectedMechanic);
      // console.log("License:", carDetails.licenseNumber);
      // console.log("Engine:", carDetails.engineNumber);
      return;
    }
    

    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/appointments', {
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
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-100 to-blue-200">
    <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
      <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">Book Your Appointment</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />

        <select
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={selectedMechanic}
          onChange={(e) => setSelectedMechanic(e.target.value)}
          required
          disabled={!selectedDate}
        >
        {mechanics.length === 0 ? (
          <option disabled>No mechanics available</option>
        ) : (
          mechanics.map(mechanic => (
            <option key={mechanic._id} value={mechanic._id} disabled={mechanic.availableSlots === 0}>
              {mechanic.name} - {mechanic.availableSlots} slots available
            </option>
          ))
        )}

        </select>

        <input
          type="text"
          placeholder="License Number"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={carDetails.licenseNumber}
          onChange={(e) => setCarDetails({ ...carDetails, licenseNumber: e.target.value.toUpperCase() })}
          required
        />

        <input
          type="text"
          placeholder="Engine Number"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={carDetails.engineNumber}
          onChange={(e) => setCarDetails({ ...carDetails, engineNumber: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:opacity-90 transition ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  </div>
);
}