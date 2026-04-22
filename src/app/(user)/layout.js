import Header from '@/components/header';
import KycGuard from '@/components/kycGuard';


import Sidebar from '@/components/sidebar';
import React from 'react';

export default function layout({ children }) {
  return (

    <KycGuard>
      <div className="user-layout">
        <div className="user-layout-sidebar">
          <Sidebar />
        </div>
        <div className="user-layout-children">
          <Header />
          <div className="user-layout-children-content">{children}</div>
        </div>
      </div>
    </KycGuard>

  );
}
