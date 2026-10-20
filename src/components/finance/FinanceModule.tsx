import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ArrowDownRight, 
  ArrowUpRight, 
  ListFilter, 
  CalendarDays, 
  CalendarRange, 
  CheckSquare,
  IndianRupee,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FinanceSummaryCards } from './FinanceSummaryCards';
import { FinanceFilters, FilterState } from './FinanceFilters';
import { FinanceTable } from './FinanceTable';
import { FinanceDailySummary } from './FinanceDailySummary';
import { FinanceMonthlySummary } from './FinanceMonthlySummary';
import { FinanceApprovalsView } from './FinanceApprovalsView';
import { AddTransactionModal } from './AddTransactionModal';
import { RejectModal } from './RejectModal';
import { FinanceEntry } from '../../types';
import { getTodayString } from '../../utils/formatters';

export const FinanceModule: React.FC = () => {
  const { 
    financeEntries, 
    approveFinanceEntry, 
    rejectFinanceEntry, 
    currentUser, 
    pendingCount,
    resetData 
  } = useApp();

  const isAdmin = currentUser.role === 'admin';

  // Navigation tab within Finance module
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'monthly' | 'approvals'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'income' | 'expense'>('expense');
  const [rejectingEntry, setRejectingEntry] = useState<FinanceEntry | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    status: 'all',
    paymentMethod: 'all',
    dateRange: 'all',
    customStartDate: '',
    customEndDate: '',
  });

  // Filter logic
  const filteredEntries = useMemo(() => {
    return financeEntries.filter((entry) => {
      // Search filter (description, category, paymentMethod, submitter name)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesDesc = entry.description.toLowerCase().includes(q);
        const matchesCategory = entry.category.toLowerCase().includes(q);
        const matchesMethod = entry.paymentMethod.toLowerCase().includes(q);
        const matchesSubmitter = entry.submittedBy.name.toLowerCase().includes(q);
        if (!matchesDesc && !matchesCategory && !matchesMethod && !matchesSubmitter) {
          return false;
        }
      }

      // Type filter
      if (filters.type !== 'all' && entry.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && entry.status !== filters.status) {
        return false;
      }

      // Payment method filter
      if (filters.paymentMethod !== 'all' && entry.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const todayStr = getTodayString();
        const entryDate = entry.date;

        if (filters.dateRange === 'today') {
          if (entryDate !== todayStr) return false;
        } else if (filters.dateRange === 'week') {
          // Check if entry date is within past 7 days
          const now = new Date();
          const pastWeek = new Date(now);
          pastWeek.setDate(pastWeek.getDate() - 7);
          const pastWeekStr = pastWeek.toISOString().split('T')[0];
          if (entryDate < pastWeekStr || entryDate > todayStr) return false;
        } else if (filters.dateRange === 'month') {
          const currentMonth = todayStr.slice(0, 7);
          if (entryDate.slice(0, 7) !== currentMonth) return false;
        } else if (filters.dateRange === 'custom') {
          if (filters.customStartDate && entryDate < filters.customStartDate) return false;
          if (filters.customEndDate && entryDate > filters.customEndDate) return false;
        }
      }

      return true;
    });
  }, [financeEntries, filters]);

  const handleOpenAdd = (type: 'income' | 'expense') => {
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  const handleApprove = (id: string) => {
    approveFinanceEntry(id);
  };

  const handleRequestReject = (entry: FinanceEntry) => {
    setRejectingEntry(entry);
  };

  const handleConfirmReject = (id: string, reason: string) => {
    rejectFinanceEntry(id, reason);
    setRejectingEntry(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <IndianRupee className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Finance Work
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Track team income, operational expenses, balance, and approvals in Indian Rupees (₹).
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin ? (
              <>
                <button
                  onClick={() => handleOpenAdd('income')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  + Income
                </button>
                <button
                  onClick={() => handleOpenAdd('expense')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  + Expense
                </button>
              </>
            ) : (
              <button
                onClick={() => handleOpenAdd('expense')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                Submit Expense for Approval
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('Reset finance data back to initial demo sample?')) {
                  resetData();
                }
              }}
              title="Reset to sample demo data"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <FinanceSummaryCards onOpenApprovals={() => setActiveTab('approvals')} />

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            All Entries
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'daily'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Daily Summary
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'monthly'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            Monthly Summary
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'approvals'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Approvals
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: All Entries with Search & Filters */}
        {activeTab === 'all' && (
          <div>
            <FinanceFilters
              filters={filters}
              setFilters={setFilters}
              totalMatching={filteredEntries.length}
            />

            <FinanceTable
              entries={filteredEntries}
              onApprove={handleApprove}
              onRequestReject={handleRequestReject}
              onOpenAddModal={() => handleOpenAdd('expense')}
            />
          </div>
        )}

        {/* Tab 2: Daily Summary */}
        {activeTab === 'daily' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Day-by-day breakdown of approved inflows and outflows</span>
              <span>Showing {filteredEntries.length} total entries</span>
            </div>
            <FinanceDailySummary entries={filteredEntries} />
          </div>
        )}

        {/* Tab 3: Monthly Summary */}
        {activeTab === 'monthly' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Monthly aggregate balance and savings rate</span>
            </div>
            <FinanceMonthlySummary entries={financeEntries} />
          </div>
        )}

        {/* Tab 4: Approvals */}
        {activeTab === 'approvals' && (
          <FinanceApprovalsView
            onApprove={handleApprove}
            onRequestReject={handleRequestReject}
            onOpenAddModal={() => handleOpenAdd('expense')}
          />
        )}
      </div>

      {/* Add / Submit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType={addModalType}
      />

      {/* Admin Reject Reason Modal */}
      <RejectModal
        entry={rejectingEntry}
        isOpen={!!rejectingEntry}
        onClose={() => setRejectingEntry(null)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};
