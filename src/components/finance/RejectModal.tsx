import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { FinanceEntry } from '../../types';
import { formatINR } from '../../utils/formatters';

interface RejectModalProps {
  entry: FinanceEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  entry,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState<string>('Receipt not attached / outside company policy.');

  if (!isOpen || !entry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(entry.id, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-semibold">Reject Expense Request</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Requested by:</span>
              <span className="text-slate-900 font-semibold">{entry.submittedBy.name}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Amount:</span>
              <span className="text-rose-600 font-bold">{formatINR(entry.amount)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Item:</span>
              <span className="text-slate-800 truncate max-w-[200px]">{entry.description}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Rejection <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this request is rejected so the team lead can make corrections..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
