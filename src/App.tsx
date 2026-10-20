import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/chat/ChatView';
import { FinanceModule } from './components/finance/FinanceModule';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeamLeadDashboard } from './components/teamlead/TeamLeadDashboard';
import { MemberApp } from './components/member/MemberApp';

function MainLayout() {
  const { currentView, currentUser } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Render view component dynamically
  const renderView = () => {
    switch (currentView) {
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'team_lead':
        return <TeamLeadDashboard />;
      case 'member_app':
        return <MemberApp />;
      case 'finance':
        return <FinanceModule />;
      case 'chat':
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden text-slate-800">
      {/* Top Header */}
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic View: Admin CRM, Team Lead, Member App (5 sections), Finance, or Chat */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
