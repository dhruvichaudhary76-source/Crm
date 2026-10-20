import React, { useState } from 'react';
import { 
  MessageSquare, 
  IndianRupee, 
  Menu, 
  ChevronDown, 
  ShieldCheck, 
  Award, 
  Check,
  Target,
  Users,
  Briefcase,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/formatters';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    currentView, 
    setCurrentView, 
    currentBalance, 
    pendingCount 
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="h-14 border-b border-slate-200/90 bg-white px-3 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => {
            if (currentUser.role === 'admin') setCurrentView('admin_dashboard');
            else if (currentUser.role === 'team_lead') setCurrentView('team_lead');
            else setCurrentView('member_app');
          }}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="hidden xs:block">
            <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
              Chat Hub
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              CRM & Team Work
            </span>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="ml-1 sm:ml-3 flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin_dashboard')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                currentView === 'admin_dashboard'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Admin CRM</span>
            </button>
          )}

          {currentUser.role === 'team_lead' && (
            <button
              onClick={() => setCurrentView('team_lead')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                currentView === 'team_lead'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Workspace</span>
            </button>
          )}

          {currentUser.role === 'member' && (
            <button
              onClick={() => setCurrentView('member_app')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                currentView === 'member_app'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>My Staff App</span>
            </button>
          )}

          {/* Finance tab (For Admin and Team Lead) */}
          {(currentUser.role === 'admin' || currentUser.role === 'team_lead') && (
            <button
              onClick={() => setCurrentView('finance')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                currentView === 'finance'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Finance</span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* Chat Hub tab (For everyone) */}
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
              currentView === 'chat'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </div>

      {/* Right: Balance Pill & User Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick balance badge (Admin / Team Lead) */}
        {currentUser.role !== 'member' && (
          <div 
            onClick={() => setCurrentView('finance')}
            title="Current Balance in Indian Rupees (₹)"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs cursor-pointer hover:bg-slate-100/70 transition-colors"
          >
            <span className="text-slate-400 text-[10px] uppercase font-bold">Balance:</span>
            <span className="font-bold text-slate-800">
              {formatINR(currentBalance)}
            </span>
          </div>
        )}

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-xs">
              <span className="font-semibold text-slate-900 block leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-indigo-600 font-medium capitalize flex items-center gap-0.5">
                {currentUser.role === 'admin' ? (
                  <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" />
                ) : (
                  <Award className="w-2.5 h-2.5 text-amber-600" />
                )}
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Switch User Menu */}
          {isUserMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] text-slate-400 font-medium">
                  Switch Active Role (Test all 3 experiences)
                </div>
                <div className="py-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-indigo-50/60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-semibold text-slate-800 block leading-tight">
                              {u.name}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-medium capitalize block">
                              {u.role.replace('_', ' ')} · {u.department}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {u.title}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="px-3 py-2 border-t border-slate-100 text-[10px] text-slate-500 bg-slate-50/50 space-y-0.5">
                  <p>• <strong>Admin</strong>: Full CRM, reports, finance, and Google Sheets.</p>
                  <p>• <strong>Team Lead</strong>: Monitor assigned team & tasks.</p>
                  <p>• <strong>Team Member</strong>: 5 simple sections (My Leads, Tasks, Expenses).</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
