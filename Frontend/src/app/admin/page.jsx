'use client';
import { useState } from 'react';
import AuthRoute from '../../app/components/AuthRoute';
import NavbarWrapper from '../../app/components/navbar/NavbarWrapper';
import AppointmentTable from '../../app/components/AppointmentTable/AppointmentTable';
import MechanicManagement from '../../app/components/MechanicManage/MechanicManagement';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('appointments');

  return (
    <AuthRoute adminOnly>
      <NavbarWrapper textColor="text-black" />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-100 to-blue-200">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">Admin Dashboard</h1>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6 border-b border-gray-300">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'appointments' ? 'border-b-4 border-blue-600 text-blue-700' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button
              className={`px-4 py-2 font-medium ml-4 ${
                activeTab === 'mechanics' ? 'border-b-4 border-blue-600 text-blue-700' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('mechanics')}
            >
              Manage Mechanics
            </button>
          </div>

          {/* Tab Content */}
          <div className="rounded-lg bg-gray-50 p-4 shadow-inner">
            {activeTab === 'appointments' ? <AppointmentTable /> : <MechanicManagement />}
          </div>
        </div>
      </div>
    </AuthRoute>
  );
}
