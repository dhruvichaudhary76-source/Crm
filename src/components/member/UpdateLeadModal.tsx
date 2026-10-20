import React, { useState } from 'react';
import { X, Phone, Calendar, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { CustomerLead, LeadStatus } from '../../types';
import { getTodayString } from '../../utils/formatters';

interface UpdateLeadModalProps {
  lead: CustomerLead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    leadId: string, 
    status: LeadStatus, 
    log: {
      callNotes: string;
      workCompleted?: string;
      result?: string;
      nextFollowUpDate?: string;
    }
  ) => void;
}

export const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !lead) return null;

  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [callNotes, setCallNotes] = useState('');
  const [workCompleted, setWorkCompleted] = useState('');
  const [result, setResult] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(lead.followUpDate || getTodayString());
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callNotes.trim()) {
      setError('Please write what was discussed on the call or meeting.');
      return;
    }

    onSave(lead.id, status, {
      callNotes: callNotes.trim(),
      workCompleted: workCompleted.trim() || undefined,
      result: result.trim() || undefined,
      nextFollowUpDate: status !== 'Converted' && status !== 'Lost' ? nextFollowUpDate : undefined,
    });

    onClose();
  };

  const statuses: { label: string; value: LeadStatus; color: string }[] = [
    { label: 'New', value: 'New', color: 'bg-sky-50 text-sky-700 border-sky-300' },
    { label: 'Contacted', value: 'Contacted', color: 'bg-blue-50 text-blue-700 border-blue-300' },
    { label: 'Follow-up', value: 'Follow-up', color: 'bg-amber-50 text-amber-700 border-amber-300' },
    { label: 'Interested', value: 'Interested', color: 'bg-purple-50 text-purple-700 border-purple-300' },
    { label: 'Converted 🎉', value: 'Converted', color: 'bg-emerald-50 text-emerald-700 border-emerald-400' },
    { label: 'Lost', value: 'Lost', color: 'bg-rose-50 text-rose-700 border-rose-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Customer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{lead.customerName}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{lead.phone} {lead.city ? `· ${lead.city}` : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Quick Call Actions */}
          <div className="flex items-center gap-2 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" /> Call Customer
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
            >
              WhatsApp
            </a>
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Select Customer Status:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`py-2 px-2.5 rounded-lg font-bold text-center border text-xs transition-all ${
                    status === s.value
                      ? `${s.color} ring-2 ring-indigo-500`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Call notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Call Notes / What was discussed? <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Discussed pricing plan. Customer is interested in team demo..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
              autoFocus
            />
          </div>

          {/* Work Completed */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Work Completed (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Sent quotation on WhatsApp / Prepared customized proposal"
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Next Follow-up Date */}
          {status !== 'Converted' && status !== 'Lost' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Next Follow-up Date
              </label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Large Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors"
            >
              Save Lead Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
