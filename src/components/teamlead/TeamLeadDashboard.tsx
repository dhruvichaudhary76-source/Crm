import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  Target, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Calendar,
  MessageSquare,
  IndianRupee,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TaskItem, DailyWorkReport, CustomerLead } from '../../types';
import { formatDate, formatINR, getTodayString } from '../../utils/formatters';
import { AssignTaskModal } from './AssignTaskModal';
import { AddTransactionModal } from '../finance/AddTransactionModal';

export const TeamLeadDashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    tasks, 
    updateTaskStatus, 
    workReports, 
    leads, 
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'members' | 'tasks' | 'reports' | 'leads'>('members');
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Filter only members who report to this Team Lead
  const myTeamMembers = useMemo(() => {
    return users.filter(u => u.teamLeadId === currentUser.id || (u.role === 'member' && u.department === currentUser.department));
  }, [users, currentUser.id, currentUser.department]);

  const myTeamMemberIds = myTeamMembers.map(m => m.id);

  // Tasks assigned to my team members
  const teamTasks = useMemo(() => {
    return tasks.filter(t => myTeamMemberIds.includes(t.assignedToId));
  }, [tasks, myTeamMemberIds]);

  // Daily work reports submitted by my team members
  const teamReports = useMemo(() => {
    return workReports.filter(r => myTeamMemberIds.includes(r.staffId));
  }, [workReports, myTeamMemberIds]);

  // Customer leads assigned to my team members
  const teamLeads = useMemo(() => {
    return leads.filter(l => myTeamMemberIds.includes(l.assignedToId));
  }, [leads, myTeamMemberIds]);

  const pendingTasksCount = teamTasks.filter(t => t.status !== 'Done').length;
  const convertedLeadsCount = teamLeads.filter(l => l.status === 'Converted').length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Team Lead Workspace
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Managing <strong>{currentUser.department}</strong> · {myTeamMembers.length} assigned team member(s)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-xs"
            >
              <IndianRupee className="w-3.5 h-3.5 text-rose-600" />
              Submit Expense
            </button>

            <button
              onClick={() => setIsAssignTaskOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Assign Task
            </button>
          </div>
        </div>

        {/* 4 Summary Cards for Team Lead */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Assigned Team</span>
            <span className="text-2xl font-bold text-slate-900">{myTeamMembers.length}</span>
            <span className="text-[10px] text-slate-400 block mt-1">{currentUser.department}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Active Tasks</span>
            <span className="text-2xl font-bold text-indigo-600">{pendingTasksCount}</span>
            <span className="text-[10px] text-indigo-600 block mt-1">In progress / pending</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Team Leads</span>
            <span className="text-2xl font-bold text-slate-900">{teamLeads.length}</span>
            <span className="text-[10px] text-emerald-600 block mt-1">{convertedLeadsCount} Converted</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Daily Reports</span>
            <span className="text-2xl font-bold text-slate-900">{teamReports.length}</span>
            <span className="text-[10px] text-slate-400 block mt-1">Logged by team</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            My Team Members ({myTeamMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors ${
              activeTab === 'tasks'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Team Tasks ({teamTasks.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors ${
              activeTab === 'reports'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Daily Work Reports ({teamReports.length})
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-colors ${
              activeTab === 'leads'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            Team Leads Pipeline ({teamLeads.length})
          </button>
        </div>

        {/* Tab 1: Assigned Team Members */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTeamMembers.map((member) => {
              const memberLeads = leads.filter(l => l.assignedToId === member.id);
              const memberTasks = tasks.filter(t => t.assignedToId === member.id);
              const doneTasks = memberTasks.filter(t => t.status === 'Done').length;

              return (
                <div key={member.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{member.name}</h4>
                        <p className="text-xs text-slate-500">{member.title}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold">{member.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-base font-bold text-slate-900 block">{memberLeads.length}</span>
                      <span className="text-[10px] text-slate-400">Leads Handled</span>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      <span className="text-base font-bold text-emerald-700 block">
                        {memberLeads.filter(l => l.status === 'Converted').length}
                      </span>
                      <span className="text-[10px] text-emerald-600">Converted</span>
                    </div>
                    <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                      <span className="text-base font-bold text-indigo-700 block">{doneTasks}/{memberTasks.length}</span>
                      <span className="text-[10px] text-indigo-600">Tasks Done</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => setIsAssignTaskOpen(true)}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      + Assign Task
                    </button>
                    <button
                      onClick={() => setCurrentView('chat')}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Message in Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Team Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {teamTasks.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border text-center text-xs text-slate-400">
                No tasks assigned to your team yet.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                  {teamTasks.map((t) => (
                    <div key={t.id} className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/50">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => updateTaskStatus(t.id, t.status === 'Done' ? 'Todo' : 'Done')}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 ${
                            t.status === 'Done' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {t.status === 'Done' && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div>
                          <h4 className={`font-bold text-slate-900 ${t.status === 'Done' ? 'line-through text-slate-400' : ''}`}>
                            {t.title}
                          </h4>
                          <p className="text-slate-500 text-[11px] mt-0.5">{t.description}</p>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Assigned to: <strong className="text-slate-700">{t.assignedToName}</strong> · Due: {formatDate(t.dueDate)}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        t.status === 'Done' ? 'bg-emerald-50 text-emerald-700' :
                        t.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Daily Work Reports */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Daily Work Reports from Your Team
            </h3>

            {teamReports.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No daily reports submitted by your team yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {teamReports.map((r) => (
                  <div key={r.id} className="py-3.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{r.staffName} · {formatDate(r.date)}</span>
                      <div className="flex items-center gap-3 text-slate-600 text-[11px]">
                        <span>⏱️ {r.hoursWorked} hrs</span>
                        <span>📞 {r.leadsContactedCount} leads</span>
                        <span>✅ {r.tasksCompletedCount} tasks</span>
                      </div>
                    </div>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                      {r.summary}
                    </p>
                    {r.notes && <p className="text-[11px] text-slate-500 italic pl-1">Notes: {r.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Team Leads Pipeline */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Assigned Member</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Follow-up</th>
                    <th className="py-3 px-4">Est. Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {l.customerName}
                        <span className="block font-normal font-mono text-[11px] text-slate-400">{l.phone}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{l.assignedToName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{formatDate(l.followUpDate)}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{l.estimatedValue ? formatINR(l.estimatedValue) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        <AssignTaskModal
          isOpen={isAssignTaskOpen}
          onClose={() => setIsAssignTaskOpen(false)}
          allowedAssigneeIds={myTeamMemberIds}
        />

        <AddTransactionModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          defaultType="expense"
        />
      </div>
    </div>
  );
};
