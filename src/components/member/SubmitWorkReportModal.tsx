import React, { useState } from 'react';
import { X, FileText, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SubmitWorkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitWorkReportModal: React.FC<SubmitWorkReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitWorkReport, currentUser } = useApp();

  const [summary, setSummary] = useState('');
  const [hoursWorked, setHoursWorked] = useState('8');
  const [leadsContactedCount, setLeadsContactedCount] = useState('3');
  const [tasksCompletedCount, setTasksCompletedCount] = useState('2');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('Please summarize your work accomplishments for today.');
      return;
    }

    submitWorkReport({
      summary: summary.trim(),
      hoursWorked: parseFloat(hoursWorked) || 8,
      leadsContactedCount: parseInt(leadsContactedCount) || 0,
      tasksCompletedCount: parseInt(tasksCompletedCount) || 0,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit Daily Work Report</h3>
              <p className="text-xs text-slate-500">Log today's hours, calls, and completed tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Quick numerical counters */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                className="w-full text-center text-base font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1"
                required
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Leads Contacted
              </label>
              <input
                type="number"
                min="0"
                value={leadsContactedCount}
                onChange={(e) => setLeadsContactedCount(e.target.value)}
                className="w-full text-center text-base font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1"
                required
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tasks Completed
              </label>
              <input
                type="number"
                min="0"
                value={tasksCompletedCount}
                onChange={(e) => setTasksCompletedCount(e.target.value)}
                className="w-full text-center text-base font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1"
                required
              />
            </div>
          </div>

          {/* Work Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Work Completed Today <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Completed 4 client follow-up calls, assisted 2 customers with onboarding, sent quotations to Rajesh and Ananya."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
              autoFocus
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Notes for Admin / Team Lead (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Awaiting client reply by tomorrow afternoon"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

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
              className="flex-2 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
            >
              Submit Daily Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
