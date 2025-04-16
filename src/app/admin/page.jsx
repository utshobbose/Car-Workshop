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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === 'appointments' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'mechanics' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('mechanics')}
          >
            Manage Mechanics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'appointments' ? (
          <AppointmentTable />
        ) : (
          <MechanicManagement />
        )}
      </div>
    </AuthRoute>
  );
}
