'use client';
import { useState, useEffect } from 'react';
import { backend } from '@/app/context(testing)/api';

export default function MechanicManagement() {
  const [mechanics, setMechanics] = useState([]);
  const [newMechanic, setNewMechanic] = useState('');

  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetch(`${backend}/api/mechanics`)
      .then(res => res.json())
      .then(setMechanics);
  }, []);

  const addMechanic = async () => {
    const res = await fetch(`${backend}/api/mechanics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,
        'user-role': role
      },
      body: JSON.stringify({ name: newMechanic })
    });

    if (res.ok) {
      setMechanics([...mechanics, await res.json()]);
      setNewMechanic('');
    }
  };

  const toggleMechanic = async (id, isActive) => {
    const res = await fetch(`${backend}/api/mechanics/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,
        'user-role': role
      },
      body: JSON.stringify({ isActive: !isActive })
    });

    if (res.ok) {
      setMechanics(mechanics.map(m => 
        m._id === id ? { ...m, isActive: !isActive } : m
      ));
    }
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={newMechanic}
          onChange={(e) => setNewMechanic(e.target.value)}
          placeholder="New mechanic name"
          className="border p-2 mr-2 flex-grow"
        />
        <button 
          onClick={addMechanic}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Mechanic
        </button>
      </div>

      <div className="space-y-2">
        {mechanics.map(mechanic => (
          <div key={mechanic._id} className="flex items-center justify-between p-2 border">
            <span>{mechanic.name}</span>
            <button
              onClick={() => toggleMechanic(mechanic._id, mechanic.isActive)}
              className={`px-3 py-1 rounded text-white ${
                mechanic.isActive ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {mechanic.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
