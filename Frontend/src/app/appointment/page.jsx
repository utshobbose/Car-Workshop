'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentPage() {
  const router = useRouter();
  const [mechanics, setMechanics] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [carList, setCarList] = useState([]);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const [addNewCar, setAddNewCar] = useState(false);
  const [newCarDetails, setNewCarDetails] = useState({ licenseNumber: '', engineNumber: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = localStorage.getItem('userId') || '';
      const r = localStorage.getItem('role') || '';
      setUserId(uid);
      setRole(r);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: { userid: uid }
      })
        .then(res => res.json())
        .then(data => setCarList(data.cars || []));
    }
  }, []);

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

    const finalCar = addNewCar
      ? newCarDetails
      : carList[selectedCarIndex];

      if (!selectedDate || !selectedMechanic) {
        setError('Date and mechanic are required');
        setIsSubmitting(false);
        return;
      }
      
      if (addNewCar) {
        if (!newCarDetails.licenseNumber.trim() || !newCarDetails.engineNumber.trim()) {
          setError('Please provide license and engine number for the new car');
          setIsSubmitting(false);
          return;
        }
      } else {
        if (!carList[selectedCarIndex]) {
          setError('Please select a car');
          setIsSubmitting(false);
          return;
        }
      }
      

    // Optionally save new car before appointment
    if (addNewCar) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/add-car`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          licenseNumber: newCarDetails.licenseNumber,
          engineNumber: newCarDetails.engineNumber
        })
      });
      if (!res.ok) {
        setError('Failed to add new car');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
          'user-role': role
        },
        body: JSON.stringify({
          userId,
          mechanicId: selectedMechanic,
          carDetails: finalCar,
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

          <div>
            <label className="block mb-1">Car</label>
            <select
              disabled={addNewCar}
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={selectedCarIndex}
              onChange={(e) => setSelectedCarIndex(parseInt(e.target.value))}
            >
              {carList.map((car, index) => (
                <option key={index} value={index}>
                  {car.licenseNumber} / {car.engineNumber}
                </option>
              ))}
            </select>
          </div>

          <label className="block mt-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={addNewCar}
              onChange={() => setAddNewCar(!addNewCar)}
            />
            Add a new car
          </label>

          {addNewCar && (
            <>
              <input
                type="text"
                placeholder="License Number"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={newCarDetails.licenseNumber}
                onChange={(e) => setNewCarDetails({ ...newCarDetails, licenseNumber: e.target.value.toUpperCase() })}
              />
              <input
                type="text"
                placeholder="Engine Number"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={newCarDetails.engineNumber}
                onChange={(e) => setNewCarDetails({ ...newCarDetails, engineNumber: e.target.value })}
              />
            </>
          )}

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
