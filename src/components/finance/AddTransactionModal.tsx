import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../data/mockData';
import { getTodayString, formatINR } from '../../utils/formatters';
import { PaymentMethod } from '../../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
}) => {
  const { currentUser, addFinanceEntry } = useApp();

  const isTeamLeadOrMember = currentUser.role !== 'admin';

  // If user is not admin, default to expense since team leads/members submit expenses
  const [type, setType] = useState<'income' | 'expense'>(
    isTeamLeadOrMember ? 'expense' : defaultType
  );
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }

    if (!date) {
      setError('Please select a valid transaction date');
      return;
    }

    if (!category) {
      setError('Please choose a category');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a clear description');
      return;
    }

    addFinanceEntry({
      type,
      amount: numericAmount,
      date,
      category,
      description: description.trim(),
      paymentMethod,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {type === 'income' 
                ? 'Add New Income Entry' 
                : isTeamLeadOrMember 
                  ? 'Submit Expense for Approval' 
                  : 'Add New Expense Entry'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTeamLeadOrMember && type === 'expense'
                ? `Logged in as ${currentUser.name} (${currentUser.title}) — Request will be sent to Admin.`
                : 'Directly records entry in the company finance ledger in Indian Rupees (₹).'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector (Admin can choose Income or Expense; Team Lead can submit Expense) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('');
                }}
                disabled={isTeamLeadOrMember}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  type === 'income'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                } ${isTeamLeadOrMember ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                Income (+)
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  type === 'expense'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                Expense (-)
              </button>
            </div>
            {isTeamLeadOrMember && (
              <span className="text-[11px] text-slate-400 mt-1 block">
                * Team leads can submit expense requests for admin review.
              </span>
            )}
          </div>

          {/* Amount (₹) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount (in Indian Rupees ₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-base font-semibold border border-slate-200 rounded-lg text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                autoFocus
                required
              />
            </div>
            {amount && !isNaN(parseFloat(amount)) && (
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Entered: {formatINR(parseFloat(amount))}
              </p>
            )}
          </div>

          {/* Date and Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="">-- Select a Category --</option>
              {currentCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'income' ? 'e.g., Client invoice payment for project release' : 'e.g., Team sprint dinner at restaurant / travel cab'}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Notice of Approval policy */}
          {isTeamLeadOrMember && type === 'expense' && (
            <div className="bg-amber-50 border border-amber-200/70 rounded-lg p-2.5 text-[11px] text-amber-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                This request will be marked as <strong>Pending Approval</strong> and forwarded to Admin Aman Chaudhary for approval before it impacts current balance.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {type === 'income' 
                ? 'Record Income' 
                : isTeamLeadOrMember 
                  ? 'Submit Request' 
                  : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
