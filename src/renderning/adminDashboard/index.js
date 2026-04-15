'use client';

import React from 'react';
import { useSelector } from 'react-redux';

export default function AdminDashboard() {
  const { role } = useSelector((state) => state.login);

  return (
    <main
      style={{
        minHeight: '100dvh',
        padding: '40px',
        background: '#030f0f',
        color: '#fafafa',
        fontFamily: 'var(--font-manrope)',
      }}
    >
      <h1
        style={{
          margin: '0 0 12px',
          fontFamily: 'var(--font-red-hat-display)',
        }}
      >
        Admin Dashboard
      </h1>
      <p style={{ margin: '0 0 20px', color: '#8e8e8e' }}>
        Admin login successful.
      </p>
      <div
        style={{
          maxWidth: '420px',
          padding: '20px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <p style={{ margin: 0, color: '#8e8e8e' }}>Role</p>
        <h2 style={{ margin: '8px 0 0', color: '#dbe64c' }}>{role}</h2>
      </div>
    </main>
  );
}
