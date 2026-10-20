import React from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Check, 
  X, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  CreditCard,
  Building2,
  Banknote,
  Smartphone
} from 'lucide-react';
import { FinanceEntry } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

interface FinanceTableProps {
  entries: FinanceEntry[];
  onApprove: (id: string) => void;
  onRequestReject: (entry: FinanceEntry) => void;
  onOpenAddModal: () => void;
}

export const FinanceTable: React.FC<FinanceTableProps> = ({
  entries,
  onApprove,
  onRequestReject,
  onOpenAddModal,
}) => {
  const { currentUser, deleteFinanceEntry } = useApp();
  const isAdmin = currentUser.role === 'admin';

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Banknote className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">No finance entries found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No transactions match your search and filter criteria, or no entries have been added yet.
        </p>
        <button
          onClick={onOpenAddModal}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
        >
          Add First Entry
        </button>
      </div>
    );
  }

  // Payment method icon helper
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5 text-purple-600" />;
      case 'Bank Transfer':
      case 'Net Banking':
        return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'Card':
        return <CreditCard className="w-3.5 h-3.5 text-sky-600" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Banknote className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Type & Amount</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Description & Category</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Submitted By</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const isIncome = entry.type === 'income';

              return (
                <tr 
                  key={entry.id} 
                  className={`hover:bg-slate-50/60 transition-colors ${
                    entry.status === 'pending' ? 'bg-amber-50/20' : ''
                  }`}
                >
                  {/* Type & Amount */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {isIncome ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${
                          isIncome ? 'text-emerald-700' : 'text-slate-900'
                        }`}>
                          {isIncome ? '+' : '-'}{formatINR(entry.amount)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium capitalize">
                          {entry.type}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-medium">
                    {formatDate(entry.date)}
                    <span className="block text-[10px] text-slate-400">{entry.date}</span>
                  </td>

                  {/* Description & Category */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {entry.description}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {entry.category}
                    </div>
                    {entry.rejectionReason && (
                      <div className="text-[10px] text-rose-600 mt-0.5 flex items-center gap-1 font-medium">
                        <span>Rejected:</span> {entry.rejectionReason}
                      </div>
                    )}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                      {getMethodIcon(entry.paymentMethod)}
                      {entry.paymentMethod}
                    </span>
                  </td>

                  {/* Submitted By */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {entry.submittedBy.name}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {entry.submittedBy.role.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {entry.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Approved
                      </span>
                    )}
                    {entry.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                        Pending Approval
                      </span>
                    )}
                    {entry.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Admin Approval Buttons for pending items */}
                      {isAdmin && entry.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onApprove(entry.id)}
                            title="Approve expense request"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => onRequestReject(entry)}
                            title="Reject expense request"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}

                      {/* If rejected, allow Admin to re-approve */}
                      {isAdmin && entry.status === 'rejected' && (
                        <button
                          onClick={() => onApprove(entry.id)}
                          title="Re-approve"
                          className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded-md font-medium"
                        >
                          Re-approve
                        </button>
                      )}

                      {/* Admin delete */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this finance record permanently?')) {
                              deleteFinanceEntry(entry.id);
                            }
                          }}
                          title="Delete entry"
                          className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {!isAdmin && entry.status === 'pending' && (
                        <span className="text-[11px] text-amber-600 font-medium">
                          Awaiting Admin
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (optimized for smartphones) */}
      <div className="md:hidden divide-y divide-slate-100">
        {entries.map((entry) => {
          const isIncome = entry.type === 'income';

          return (
            <div key={entry.id} className="p-3.5 space-y-2.5 hover:bg-slate-50">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {isIncome ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {isIncome ? '+' : '-'}{formatINR(entry.amount)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(entry.date)} · {entry.category}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {entry.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                    </span>
                  )}
                  {entry.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                      <Clock className="w-3 h-3 text-amber-600" /> Pending
                    </span>
                  )}
                  {entry.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                      <XCircle className="w-3 h-3 text-rose-600" /> Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-700 font-medium">
                {entry.description}
              </div>

              {/* Rejection reason if any */}
              {entry.rejectionReason && (
                <div className="text-[11px] text-rose-600 bg-rose-50/70 p-2 rounded-md">
                  <strong>Rejection Note:</strong> {entry.rejectionReason}
                </div>
              )}

              {/* Submitter & Method */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  {getMethodIcon(entry.paymentMethod)} {entry.paymentMethod}
                </span>
                <span>
                  By <strong className="text-slate-700">{entry.submittedBy.name}</strong>
                </span>
              </div>

              {/* Mobile Admin Actions for Pending */}
              {isAdmin && entry.status === 'pending' && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onApprove(entry.id)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => onRequestReject(entry)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg flex items-center justify-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
