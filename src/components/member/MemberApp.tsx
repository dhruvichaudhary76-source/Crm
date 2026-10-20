import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Target, 
  CheckSquare, 
  IndianRupee, 
  User, 
  Phone, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare, 
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerLead, TaskItem, FinanceEntry, LeadStatus } from '../../types';
import { formatINR, formatDate, getTodayString } from '../../utils/formatters';
import { UpdateLeadModal } from './UpdateLeadModal';
import { SubmitWorkReportModal } from './SubmitWorkReportModal';
import { AddTransactionModal } from '../finance/AddTransactionModal';

export const MemberApp: React.FC = () => {
  const { 
    currentUser, 
    users,
    leads, 
    updateLeadStatusAndLog, 
    tasks, 
    updateTaskStatus, 
    financeEntries, 
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'leads' | 'work' | 'expenses' | 'profile'>('home');
  const [selectedLeadForUpdate, setSelectedLeadForUpdate] = useState<CustomerLead | null>(null);
  const [isSubmitReportOpen, setIsSubmitReportOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const todayStr = getTodayString();

  // SECURITY: Strictly filter only leads assigned to this employee
  const myLeads = useMemo(() => {
    return leads.filter(l => l.assignedToId === currentUser.id);
  }, [leads, currentUser.id]);

  // Tasks assigned to this employee
  const myTasks = useMemo(() => {
    return tasks.filter(t => t.assignedToId === currentUser.id);
  }, [tasks, currentUser.id]);

  // Expenses submitted by this employee
  const myExpenses = useMemo(() => {
    return financeEntries.filter(f => f.submittedBy.id === currentUser.id);
  }, [financeEntries, currentUser.id]);

  // Manager / Team Lead
  const manager = users.find(u => u.id === currentUser.teamLeadId) || users.find(u => u.role === 'admin');

  // Stats
  const followUpsDueToday = myLeads.filter(l => l.followUpDate === todayStr && l.status !== 'Converted' && l.status !== 'Lost');
  const pendingTasks = myTasks.filter(t => t.status !== 'Done');
  const convertedLeadsCount = myLeads.filter(l => l.status === 'Converted').length;

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-sky-50 text-sky-700 border-sky-300';
      case 'Contacted': return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'Follow-up': return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Interested': return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'Converted': return 'bg-emerald-50 text-emerald-700 border-emerald-400';
      case 'Lost': return 'bg-rose-50 text-rose-700 border-rose-300';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Mobile-Friendly Staff Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">{currentUser.name}</h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {currentUser.title} · <span className="text-indigo-600 font-semibold">{currentUser.department}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('chat')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Team Chat</span>
        </button>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 max-w-3xl mx-auto w-full">
        {/* SECTION 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Welcome Greeting Box */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
              <span className="text-xs font-medium text-indigo-100 uppercase tracking-wider block mb-1">
                Welcome back
              </span>
              <h3 className="text-xl font-bold">{currentUser.name}</h3>
              <p className="text-xs text-indigo-100 mt-1">
                You have <strong>{followUpsDueToday.length} follow-ups due today</strong> and <strong>{pendingTasks.length} pending tasks</strong>.
              </p>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setActiveTab('leads')}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs hover:border-indigo-400 transition-all"
              >
                <span className="text-2xl font-bold text-slate-900 block">{myLeads.length}</span>
                <span className="text-[11px] font-semibold text-slate-500">My Leads</span>
              </button>

              <button
                onClick={() => setActiveTab('work')}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs hover:border-indigo-400 transition-all"
              >
                <span className="text-2xl font-bold text-indigo-600 block">{pendingTasks.length}</span>
                <span className="text-[11px] font-semibold text-slate-500">My Tasks</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-xs hover:border-indigo-400 transition-all"
              >
                <span className="text-2xl font-bold text-emerald-600 block">{convertedLeadsCount}</span>
                <span className="text-[11px] font-semibold text-slate-500">Converted</span>
              </button>
            </div>

            {/* Urgent Follow-ups Due Today */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Follow-ups Due Today ({followUpsDueToday.length})
                </h4>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              {followUpsDueToday.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-xl text-center text-xs text-emerald-800 font-medium">
                  🎉 Great job! No pending follow-ups due today.
                </div>
              ) : (
                <div className="space-y-2">
                  {followUpsDueToday.map((lead) => (
                    <div key={lead.id} className="p-3 bg-amber-50/50 border border-amber-200/70 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{lead.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{lead.phone}</div>
                      </div>

                      <button
                        onClick={() => setSelectedLeadForUpdate(lead)}
                        className="py-1.5 px-3 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-indigo-700"
                      >
                        Log Call
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Big Action Shortcuts */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setIsSubmitReportOpen(true)}
                className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 text-left hover:border-indigo-500 transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Submit Daily Report</span>
                  <span className="text-[10px] text-slate-400">Log hours & tasks</span>
                </div>
              </button>

              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2.5 text-left hover:border-indigo-500 transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Submit Expense</span>
                  <span className="text-[10px] text-slate-400">For manager approval</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: MY LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Assigned Leads ({myLeads.length})</h3>
                <p className="text-xs text-slate-500">Contact leads, update status, and log call results</p>
              </div>
            </div>

            {myLeads.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-200">
                No customer leads assigned to you yet. Admin will assign new leads shortly.
              </div>
            ) : (
              <div className="space-y-3">
                {myLeads.map((lead) => {
                  const isDueToday = lead.followUpDate === todayStr;

                  return (
                    <div 
                      key={lead.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{lead.customerName}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{lead.phone} {lead.city ? `· ${lead.city}` : ''}</div>
                        </div>

                        {lead.estimatedValue && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Value</span>
                            <span className="font-bold text-xs text-slate-900">{formatINR(lead.estimatedValue)}</span>
                          </div>
                        )}
                      </div>

                      {/* Requirement note */}
                      {lead.requirements && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {lead.requirements}
                        </p>
                      )}

                      {/* Follow-up date badge */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Follow-up: <strong className={isDueToday ? 'text-amber-600' : 'text-slate-700'}>{formatDate(lead.followUpDate)}</strong>
                          {isDueToday && <span className="bg-amber-100 text-amber-900 text-[10px] px-1 rounded font-bold ml-1">Today</span>}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {lead.activityLogs.length} call logs
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <a
                          href={`tel:${lead.phone}`}
                          className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-center text-xs flex items-center justify-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5 text-indigo-600" /> Call
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-center text-xs flex items-center justify-center gap-1 border border-emerald-200"
                        >
                          WhatsApp
                        </a>
                        <button
                          onClick={() => setSelectedLeadForUpdate(lead)}
                          className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-center text-xs shadow-xs"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: MY WORK */}
        {activeTab === 'work' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Assigned Tasks ({myTasks.length})</h3>
                <p className="text-xs text-slate-500">View tasks, update progress, and log daily reports</p>
              </div>

              <button
                onClick={() => setIsSubmitReportOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" /> Submit Daily Report
              </button>
            </div>

            {myTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-200">
                No tasks assigned to you currently.
              </div>
            ) : (
              <div className="space-y-3">
                {myTasks.map((task) => {
                  const isDone = task.status === 'Done';

                  return (
                    <div 
                      key={task.id}
                      className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                        isDone ? 'border-slate-200 bg-slate-50/60 opacity-80' : 'border-indigo-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <button
                            onClick={() => updateTaskStatus(task.id, isDone ? 'Todo' : 'Done')}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 transition-colors ${
                              isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-indigo-500'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <div>
                            <h4 className={`text-xs font-bold text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">{task.description}</p>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          task.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                        <span>Assigned by: <strong className="text-slate-600">{task.assignedByName}</strong></span>
                        <span>Due: <strong className="text-slate-700">{formatDate(task.dueDate)}</strong></span>
                      </div>

                      {/* Large Button to Mark Done */}
                      <button
                        onClick={() => updateTaskStatus(task.id, isDone ? 'In Progress' : 'Done')}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                          isDone 
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {isDone ? 'Mark as Not Done' : '✅ Mark Task as Done'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: MY EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Expenses ({myExpenses.length})</h3>
                <p className="text-xs text-slate-500">Submit expense claims and track approval status</p>
              </div>

              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="flex items-center gap-1 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" /> Submit Expense
              </button>
            </div>

            {myExpenses.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-200">
                You have not submitted any expense claims yet.
              </div>
            ) : (
              <div className="space-y-3">
                {myExpenses.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-base font-bold text-slate-900">{formatINR(entry.amount)}</span>
                        <h4 className="text-xs font-semibold text-slate-700 mt-0.5">{entry.description}</h4>
                      </div>

                      {/* Status */}
                      <div>
                        {entry.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                          </span>
                        )}
                        {entry.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
                          </span>
                        )}
                        {entry.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{entry.category} · via {entry.paymentMethod}</span>
                      <span>{formatDate(entry.date)}</span>
                    </div>

                    {entry.rejectionReason && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <div><strong>Admin Note:</strong> {entry.rejectionReason}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center space-y-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-indigo-500 shadow-md"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
                <p className="text-xs text-slate-500">{currentUser.title}</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 mt-1 capitalize">
                  {currentUser.role.replace('_', ' ')} · {currentUser.department}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-left text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Email</span>
                  <span className="text-slate-800 font-medium">{currentUser.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Phone</span>
                  <span className="text-slate-800 font-medium">{currentUser.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Reporting Manager</span>
                  <span className="text-slate-800 font-medium">{manager?.name || 'Aman Chaudhary'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">App Packaging</span>
                  <span className="text-emerald-600 font-semibold">Android APK Ready</span>
                </div>
              </div>
            </div>

            {/* Lifetime stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">Performance Milestones</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xl font-bold text-slate-900 block">{convertedLeadsCount}</span>
                  <span className="text-[11px] text-slate-500">Leads Converted</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-xl font-bold text-indigo-600 block">{myTasks.filter(t => t.status === 'Done').length}</span>
                  <span className="text-[11px] text-slate-500">Tasks Completed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Five Simple Navigation Sections (Bottom Navigation Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 py-2 px-3 shadow-lg flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'leads' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Target className="w-5 h-5" />
          <span className="text-[10px]">My Leads</span>
          {followUpsDueToday.length > 0 && (
            <span className="absolute -top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('work')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'work' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px]">My Work</span>
          {pendingTasks.length > 0 && (
            <span className="absolute -top-0.5 right-2 w-2 h-2 rounded-full bg-indigo-600"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'expenses' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <IndianRupee className="w-5 h-5" />
          <span className="text-[10px]">My Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* Modals */}
      <UpdateLeadModal
        lead={selectedLeadForUpdate}
        isOpen={!!selectedLeadForUpdate}
        onClose={() => setSelectedLeadForUpdate(null)}
        onSave={updateLeadStatusAndLog}
      />

      <SubmitWorkReportModal
        isOpen={isSubmitReportOpen}
        onClose={() => setIsSubmitReportOpen(false)}
      />

      <AddTransactionModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        defaultType="expense"
      />
    </div>
  );
};
