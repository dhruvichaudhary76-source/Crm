import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Plus, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinanceEntry } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';

interface FinanceApprovalsViewProps {
  onApprove: (id: string) => void;
  onRequestReject: (entry: FinanceEntry) => void;
  onOpenAddModal: () => void;
}

export const FinanceApprovalsView: React.FC<FinanceApprovalsViewProps> = ({
  onApprove,
  onRequestReject,
  onOpenAddModal,
}) => {
  const { financeEntries, currentUser } = useApp();
  const isAdmin = currentUser.role === 'admin';

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Filter entries based on role and tab
  const relevantEntries = React.useMemo(() => {
    return financeEntries.filter((entry) => {
      // If team lead/member, they see requests they submitted (or all if curious)
      const matchesUser = isAdmin ? true : entry.submittedBy.id === currentUser.id;
      const isExpense = entry.type === 'expense';
      return matchesUser && isExpense && entry.status === activeTab;
    });
  }, [financeEntries, isAdmin, currentUser.id, activeTab]);

  const pendingCount = financeEntries.filter(
    (e) => (isAdmin ? true : e.submittedBy.id === currentUser.id) && e.type === 'expense' && e.status === 'pending'
  ).length;

  const approvedCount = financeEntries.filter(
    (e) => (isAdmin ? true : e.submittedBy.id === currentUser.id) && e.type === 'expense' && e.status === 'approved'
  ).length;

  const rejectedCount = financeEntries.filter(
    (e) => (isAdmin ? true : e.submittedBy.id === currentUser.id) && e.type === 'expense' && e.status === 'rejected'
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Banner explaining role-based permissions */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isAdmin ? 'Admin Approval Center' : 'My Expense Requests'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAdmin
                ? 'Review, verify, and approve or reject expenses submitted by Team Leads.'
                : `Logged in as ${currentUser.name} (${currentUser.title}) — Track your submitted expense reimbursements.`}
            </p>
          </div>
        </div>

        {!isAdmin && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Submit Expense
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'pending'
              ? 'bg-amber-100 text-amber-900'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Pending Review
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'approved'
              ? 'bg-emerald-100 text-emerald-900'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Approved ({approvedCount})
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            activeTab === 'rejected'
              ? 'bg-rose-100 text-rose-900'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Content */}
      {relevantEntries.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-10 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700">
            No {activeTab} expense requests
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {activeTab === 'pending'
              ? 'All expense requests have been reviewed and processed!'
              : `No items in ${activeTab} status currently.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {relevantEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-base font-bold text-slate-900">
                    {formatINR(entry.amount)}
                  </span>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    {entry.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <div>
                  {entry.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-amber-600" /> Pending
                    </span>
                  )}
                  {entry.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                    </span>
                  )}
                  {entry.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      <XCircle className="w-3 h-3 text-rose-600" /> Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Details table */}
              <div className="bg-slate-50/70 p-2.5 rounded-lg text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-700">{entry.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="font-semibold text-slate-700">{entry.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold text-slate-700">{formatDate(entry.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Submitted by:</span>
                  <span className="font-semibold text-slate-700">{entry.submittedBy.name} ({entry.submittedBy.role.replace('_', ' ')})</span>
                </div>
                {entry.reviewedBy && (
                  <div className="flex justify-between border-t border-slate-200/60 pt-1 mt-1">
                    <span className="text-slate-400">Reviewed by:</span>
                    <span className="font-semibold text-slate-700">{entry.reviewedBy.name} on {entry.reviewedAt}</span>
                  </div>
                )}
              </div>

              {/* Rejection Note if Rejected */}
              {entry.rejectionReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200/80 rounded-lg text-[11px] text-rose-800 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Reason:</span> {entry.rejectionReason}
                  </div>
                </div>
              )}

              {/* Admin Action Bar */}
              {isAdmin && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  {entry.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(entry.id)}
                        className="flex-1 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Request
                      </button>
                      <button
                        onClick={() => onRequestReject(entry)}
                        className="flex-1 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center gap-1 shadow-xs transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}

                  {entry.status === 'rejected' && (
                    <button
                      onClick={() => onApprove(entry.id)}
                      className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg"
                    >
                      Re-approve this request
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
