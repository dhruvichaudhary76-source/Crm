import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

interface FinanceSummaryCardsProps {
  onOpenApprovals: () => void;
}

export const FinanceSummaryCards: React.FC<FinanceSummaryCardsProps> = ({ onOpenApprovals }) => {
  const { totalIncome, totalExpenses, currentBalance, pendingCount, pendingAmount, currentUser } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Total Income */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Income</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatINR(totalIncome)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Approved inflows
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Expenses</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatINR(totalExpenses)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Approved outflows
        </div>
      </div>

      {/* Current Balance */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Balance</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl font-bold tracking-tight ${currentBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
          {formatINR(currentBalance)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${currentBalance >= 0 ? 'bg-indigo-500' : 'bg-rose-500'}`}></span>
          {currentBalance >= 0 ? 'Net positive reserves' : 'Deficit state'}
        </div>
      </div>

      {/* Pending Approvals */}
      <div 
        onClick={onOpenApprovals}
        className={`rounded-xl p-4 border transition-all cursor-pointer ${
          pendingCount > 0 
            ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300 hover:bg-amber-50' 
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            Pending Requests
            {pendingCount > 0 && (
              <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {formatINR(pendingAmount)}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs font-medium text-amber-700">
          <span>{currentUser.role === 'admin' ? 'Needs your review' : 'Awaiting admin'}</span>
          <span className="flex items-center gap-0.5 text-amber-800 hover:underline">
            View <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
