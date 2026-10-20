import React from 'react';
import { 
  Hash, 
  IndianRupee, 
  Target, 
  Users, 
  Briefcase, 
  Smartphone, 
  MessageSquare, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { 
    channels, 
    activeChannelId, 
    setActiveChannelId, 
    users, 
    currentUser, 
    activeDirectUserId, 
    setActiveDirectUserId,
    currentView,
    setCurrentView,
    pendingCount,
    leads
  } = useApp();

  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveDirectUserId(null);
    setCurrentView('chat');
    onCloseMobile();
  };

  const handleSelectDirectUser = (userId: string) => {
    setActiveDirectUserId(userId);
    setCurrentView('chat');
    onCloseMobile();
  };

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand header for mobile */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800 lg:hidden">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span>Chat Hub CRM</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Role Module Action Card */}
        <div className="p-3 border-b border-slate-800 space-y-1.5">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => {
                setCurrentView('admin_dashboard');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs transition-all ${
                currentView === 'admin_dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight font-bold">Admin CRM Hub</span>
                  <span className="text-[10px] text-slate-400 font-normal">{leads.length} Leads & Reports</span>
                </div>
              </div>
            </button>
          )}

          {currentUser.role === 'team_lead' && (
            <button
              onClick={() => {
                setCurrentView('team_lead');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs transition-all ${
                currentView === 'team_lead'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight font-bold">Team Workspace</span>
                  <span className="text-[10px] text-slate-400 font-normal">Tasks & Reports</span>
                </div>
              </div>
            </button>
          )}

          {currentUser.role === 'member' && (
            <button
              onClick={() => {
                setCurrentView('member_app');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs transition-all ${
                currentView === 'member_app'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight font-bold">My Staff App</span>
                  <span className="text-[10px] text-slate-400 font-normal">5 Simple Sections</span>
                </div>
              </div>
            </button>
          )}

          {/* Finance Work module (Admin and Team Lead) */}
          {currentUser.role !== 'member' && (
            <button
              onClick={() => {
                setCurrentView('finance');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-2 rounded-lg font-medium text-xs transition-all ${
                currentView === 'finance'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Finance Work</span>
              </div>
              {pendingCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Scrollable channels & DM lists */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Channels Section */}
          <div>
            <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              <span>Channels</span>
            </div>
            <div className="space-y-0.5">
              {channels.map((ch) => {
                const isActive = currentView === 'chat' && !activeDirectUserId && activeChannelId === ch.id;

                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChannel(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`w-3.5 h-3.5 shrink-0 ${ch.id === 'crm-leads' ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="truncate">{ch.name}</span>
                    </div>

                    {ch.id === 'finance-work' && pendingCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div>
            <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              <span>Direct Messages</span>
            </div>
            <div className="space-y-0.5">
              {otherUsers.map((user) => {
                const isActive = currentView === 'chat' && activeDirectUserId === user.id;

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectDirectUser(user.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
                    </div>
                    <div className="truncate text-left flex-1">
                      <span className="truncate block">{user.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current User footer card */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {currentUser.role.replace('_', ' ')} · {currentUser.department}
              </p>
            </div>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
