import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Target, 
  PhoneCall, 
  CalendarClock, 
  CheckCircle, 
  XCircle, 
  FileSpreadsheet, 
  Check, 
  X, 
  Clock, 
  Search, 
  FileText, 
  ArrowUpRight,
  TrendingUp,
  Filter,
  ExternalLink,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerLead, LeadStatus, User } from '../../types';
import { formatINR, formatDate, getTodayString } from '../../utils/formatters';
import { CreateLeadModal } from './CreateLeadModal';
import { GoogleSheetsModal } from './GoogleSheetsModal';
import { RejectModal } from '../finance/RejectModal';
import { FinanceEntry } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    leads, 
    tasks, 
    workReports, 
    financeEntries, 
    approveFinanceEntry, 
    rejectFinanceEntry,
    totalIncome, 
    totalExpenses, 
    currentBalance, 
    pendingCount,
    sheetsConfig,
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'crm' | 'team' | 'finance'>('crm');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [leadSearch, setLeadSearch] = useState<string>('');
  
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [rejectingFinance, setRejectingFinance] = useState<FinanceEntry | null>(null);

  // CRM KPI Metrics
  const todayStr = getTodayString();
  const totalLeadsCount = leads.length;
  const contactedCount = leads.filter(l => l.status === 'Contacted').length;
  const followUpsDueCount = leads.filter(l => l.followUpDate === todayStr || l.status === 'Follow-up').length;
  const convertedCount = leads.filter(l => l.status === 'Converted').length;
  const lostCount = leads.filter(l => l.status === 'Lost').length;
  const conversionRate = totalLeadsCount > 0 ? Math.round((convertedCount / totalLeadsCount) * 100) : 0;

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (leadStatusFilter !== 'all' && lead.status !== leadStatusFilter) return false;
      if (assignedFilter !== 'all' && lead.assignedToId !== assignedFilter) return false;
      if (leadSearch) {
        const q = leadSearch.toLowerCase();
        const matchesName = lead.customerName.toLowerCase().includes(q);
        const matchesPhone = lead.phone.toLowerCase().includes(q);
        const matchesStaff = lead.assignedToName.toLowerCase().includes(q);
        const matchesReq = lead.requirements?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesPhone && !matchesStaff && !matchesReq) return false;
      }
      return true;
    });
  }, [leads, leadStatusFilter, assignedFilter, leadSearch]);

  // Team members (excluding super-admin Aman)
  const staffMembers = users.filter(u => u.role !== 'admin');

  // Pending finance requests
  const pendingExpenses = financeEntries.filter(f => f.type === 'expense' && f.status === 'pending');

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Contacted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Follow-up': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Interested': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Converted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Briefcase className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Admin Control Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete oversight of customer leads, team performance, work reports, finances, and Google Sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSheetsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Sheets ({sheetsConfig.status === 'connected' ? 'Synced' : 'Connect'})</span>
            </button>

            <button
              onClick={() => setIsCreateLeadOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create & Assign Lead</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards for Leads */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Leads</span>
              <Target className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{totalLeadsCount}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-medium">All pipeline inquiries</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Contacted</span>
              <PhoneCall className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{contactedCount}</div>
            <div className="text-[10px] text-blue-600 mt-1 font-medium">First touch completed</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Follow-ups Due</span>
              <CalendarClock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700">{followUpsDueCount}</div>
            <div className="text-[10px] text-amber-600 mt-1 font-medium">Due today / pending</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Converted</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-700">{convertedCount}</div>
            <div className="text-[10px] text-emerald-600 mt-1 font-medium">{conversionRate}% win rate</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Lost</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{lostCount}</div>
            <div className="text-[10px] text-rose-500 mt-1 font-medium">Closed unqualified</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Net Balance</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-bold text-slate-900 truncate">{formatINR(currentBalance)}</div>
            <div className="text-[10px] text-slate-400 mt-1">₹ Indian Rupees</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'crm'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            Customer Leads CRM ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'team'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Team Activity & Work Reports ({workReports.length})
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'finance'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            Finance & Approvals
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Leads CRM Management */}
        {activeTab === 'crm' && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, phone, assigned staff or notes..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Status:</span>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Interested">Interested</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Assigned To:</span>
                  <select
                    value={assignedFilter}
                    onChange={(e) => setAssignedFilter(e.target.value)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium"
                  >
                    <option value="all">All Employees</option>
                    {staffMembers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Customer & Contact</th>
                      <th className="py-3 px-4">Assigned Staff</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Follow-up Date</th>
                      <th className="py-3 px-4">Est. Value (₹)</th>
                      <th className="py-3 px-4">Latest Call Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map((lead) => {
                      const latestLog = lead.activityLogs[0];
                      const isDueToday = lead.followUpDate === todayStr;

                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{lead.customerName}</div>
                            <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                              {lead.phone} {lead.city ? `· ${lead.city}` : ''}
                            </div>
                            {lead.requirements && (
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-xs">
                                {lead.requirements}
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-semibold text-slate-800">{lead.assignedToName}</span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className={`font-semibold ${isDueToday ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>
                              {formatDate(lead.followUpDate)}
                              {isDueToday && <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1 rounded">Today</span>}
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-900">
                            {lead.estimatedValue ? formatINR(lead.estimatedValue) : '—'}
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            {latestLog ? (
                              <div>
                                <span className="text-[11px] text-slate-800 font-medium line-clamp-1">
                                  {latestLog.callNotes}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  By {latestLog.staffName} · {latestLog.timestamp}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">No calls logged yet</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Team Members & Daily Work Reports */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            {/* Employee Cards Matrix */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Team Members & Lead Activity Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {staffMembers.map((staff) => {
                  const staffLeads = leads.filter(l => l.assignedToId === staff.id);
                  const staffConverted = staffLeads.filter(l => l.status === 'Converted').length;
                  const staffTasksDone = tasks.filter(t => t.assignedToId === staff.id && t.status === 'Done').length;
                  const staffPendingTasks = tasks.filter(t => t.assignedToId === staff.id && t.status !== 'Done').length;

                  return (
                    <div key={staff.id} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{staff.name}</h4>
                          <span className="text-[10px] text-slate-400 capitalize block">
                            {staff.role.replace('_', ' ')} · {staff.department}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <span className="text-xs font-bold text-slate-800 block">{staffLeads.length}</span>
                          <span className="text-[10px] text-slate-400">Assigned Leads</span>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <span className="text-xs font-bold text-emerald-700 block">{staffConverted}</span>
                          <span className="text-[10px] text-emerald-600">Converted</span>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <span className="text-xs font-bold text-indigo-700 block">{staffTasksDone}</span>
                          <span className="text-[10px] text-indigo-600">Tasks Done</span>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <span className="text-xs font-bold text-amber-700 block">{staffPendingTasks}</span>
                          <span className="text-[10px] text-amber-600">Pending Tasks</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Work Reports History */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Submitted Daily Work Reports</h3>
                  <p className="text-xs text-slate-500">Employee daily submissions with hours worked, leads contacted, and tasks summary</p>
                </div>
                <button
                  onClick={() => setIsSheetsModalOpen(true)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Sync to Google Sheets
                </button>
              </div>

              {workReports.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No daily reports recorded yet.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {workReports.map((report) => (
                    <div key={report.id} className="py-3.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{report.staffName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({formatDate(report.date)})</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span>⏱️ <strong>{report.hoursWorked}</strong> hrs</span>
                          <span>📞 <strong>{report.leadsContactedCount}</strong> leads</span>
                          <span>✅ <strong>{report.tasksCompletedCount}</strong> tasks</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {report.summary}
                      </p>
                      {report.notes && (
                        <p className="text-[11px] text-slate-500 italic pl-1">
                          Notes: {report.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Finance Entries & Approval Queue */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Finance & Expense Approvals</h3>
                <p className="text-xs text-slate-500">Review all company expenditures and approve or reject team requests</p>
              </div>
              <button
                onClick={() => setCurrentView('finance')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Open Full Finance Module &rarr;
              </button>
            </div>

            {/* Pending Approvals Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-2">
                <span>Pending Approval Requests</span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {pendingExpenses.length}
                </span>
              </h4>

              {pendingExpenses.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No pending expense requests! All items are reviewed.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingExpenses.map((entry) => (
                    <div key={entry.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{formatINR(entry.amount)}</span>
                          <span className="text-xs text-slate-600 font-medium">{entry.description}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {entry.category} · via {entry.paymentMethod} · Submitted by <strong className="text-slate-700">{entry.submittedBy.name}</strong> on {formatDate(entry.date)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => approveFinanceEntry(entry.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => setRejectingFinance(entry)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        <CreateLeadModal
          isOpen={isCreateLeadOpen}
          onClose={() => setIsCreateLeadOpen(false)}
        />

        <GoogleSheetsModal
          isOpen={isSheetsModalOpen}
          onClose={() => setIsSheetsModalOpen(false)}
        />

        <RejectModal
          entry={rejectingFinance}
          isOpen={!!rejectingFinance}
          onClose={() => setRejectingFinance(null)}
          onConfirm={(id, reason) => {
            rejectFinanceEntry(id, reason);
            setRejectingFinance(null);
          }}
        />
      </div>
    </div>
  );
};
