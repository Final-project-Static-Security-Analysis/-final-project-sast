import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-hidden pt-14">
        <Outlet />
      </main>
    </div>
  );
}