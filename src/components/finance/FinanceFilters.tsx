import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { PAYMENT_METHODS } from '../../data/mockData';

export interface FilterState {
  search: string;
  type: 'all' | 'income' | 'expense';
  status: 'all' | 'approved' | 'pending' | 'rejected';
  paymentMethod: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  customStartDate: string;
  customEndDate: string;
}

interface FinanceFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatching: number;
}

export const FinanceFilters: React.FC<FinanceFiltersProps> = ({
  filters,
  setFilters,
  totalMatching,
}) => {
  const hasActiveFilters = 
    filters.search !== '' || 
    filters.type !== 'all' || 
    filters.status !== 'all' || 
    filters.paymentMethod !== 'all' || 
    filters.dateRange !== 'all';

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      paymentMethod: 'all',
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
    });
  };

  return (
    <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs mb-4 space-y-3">
      {/* Top Search & Quick Select row */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search description, category, method, or member..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {(['all', 'today', 'week', 'month', 'custom'] as const).map((range) => {
            const labels: Record<string, string> = {
              all: 'All Time',
              today: 'Today',
              week: 'This Week',
              month: 'This Month',
              custom: 'Custom Range',
            };
            const active = filters.dateRange === range;
            return (
              <button
                key={range}
                onClick={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {labels[range]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Date Pickers row if 'custom' is active */}
      {filters.dateRange === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 border-t border-slate-100 text-xs text-slate-600">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date Range:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.customStartDate}
              onChange={(e) => setFilters(prev => ({ ...prev, customStartDate: e.target.value }))}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span>to</span>
            <input
              type="date"
              value={filters.customEndDate}
              onChange={(e) => setFilters(prev => ({ ...prev, customEndDate: e.target.value }))}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Secondary dropdown row: Type, Status, Payment Method */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Type:</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
              className="py-1 px-2 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income (+)</option>
              <option value="expense">Expenses (-)</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Status:</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="py-1 px-2 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Payment Method filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Method:</span>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="py-1 px-2 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Methods</option>
              {PAYMENT_METHODS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter and Clear button */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800">{totalMatching}</strong> entries
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:underline font-medium ml-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
