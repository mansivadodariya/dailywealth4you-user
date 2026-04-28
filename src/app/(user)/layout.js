import Header from '@/components/header';
import KycGuard from '@/components/kycGuard';
import Sidebar from '@/components/sidebar';
// import SocketProvider from '@/components/SocketProvider';
import React from 'react';

export default function layout({ children }) {
  return (
    <KycGuard>
      {/* Socket connection lives here — active on every page */}
      {/* <SocketProvider /> */}
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
