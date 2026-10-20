import React from 'react';
import { CalendarRange, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { FinanceEntry } from '../../types';
import { formatINR, formatMonthYear } from '../../utils/formatters';

interface FinanceMonthlySummaryProps {
  entries: FinanceEntry[];
}

interface MonthlyGroup {
  monthKey: string; // YYYY-MM
  totalIncome: number;
  totalExpense: number;
  net: number;
  incomeCount: number;
  expenseCount: number;
}

export const FinanceMonthlySummary: React.FC<FinanceMonthlySummaryProps> = ({ entries }) => {
  const monthlyGroups = React.useMemo(() => {
    const groupsMap = new Map<string, MonthlyGroup>();

    entries.forEach((entry) => {
      // Only approved entries count toward the monthly finance totals
      if (entry.status !== 'approved') return;

      const monthKey = entry.date.slice(0, 7); // "2026-10"
      if (!groupsMap.has(monthKey)) {
        groupsMap.set(monthKey, {
          monthKey,
          totalIncome: 0,
          totalExpense: 0,
          net: 0,
          incomeCount: 0,
          expenseCount: 0,
        });
      }

      const group = groupsMap.get(monthKey)!;
      if (entry.type === 'income') {
        group.totalIncome += entry.amount;
        group.incomeCount += 1;
      } else if (entry.type === 'expense') {
        group.totalExpense += entry.amount;
        group.expenseCount += 1;
      }
    });

    groupsMap.forEach((g) => {
      g.net = g.totalIncome - g.totalExpense;
    });

    return Array.from(groupsMap.values()).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [entries]);

  if (monthlyGroups.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
        No approved monthly records found. Add or approve entries to view the monthly summary.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {monthlyGroups.map((month) => {
        const isSurplus = month.net >= 0;
        const totalTurnover = month.totalIncome + month.totalExpense;
        const incomePercent = totalTurnover > 0 ? Math.round((month.totalIncome / totalTurnover) * 100) : 0;
        const expensePercent = totalTurnover > 0 ? 100 - incomePercent : 0;

        return (
          <div
            key={month.monthKey}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CalendarRange className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {formatMonthYear(month.monthKey)}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {month.incomeCount} inflows · {month.expenseCount} outflows
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Net Balance
                </span>
                <span className={`text-base font-bold ${isSurplus ? 'text-indigo-600' : 'text-rose-600'}`}>
                  {isSurplus ? '+' : ''}{formatINR(month.net)}
                </span>
              </div>
            </div>

            {/* Income & Expense Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/60">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Total Inflow
                </div>
                <div className="text-lg font-bold text-emerald-700">
                  {formatINR(month.totalIncome)}
                </div>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-100/60">
                <div className="flex items-center gap-1.5 text-rose-800 font-semibold mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  Total Outflow
                </div>
                <div className="text-lg font-bold text-rose-700">
                  {formatINR(month.totalExpense)}
                </div>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1.5 font-medium">
                <span>Inflow Ratio: {incomePercent}%</span>
                <span>Outflow Ratio: {expensePercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300" 
                  style={{ width: `${incomePercent}%` }} 
                  title={`Income: ${incomePercent}%`}
                />
                <div 
                  className="bg-rose-500 h-full transition-all duration-300" 
                  style={{ width: `${expensePercent}%` }} 
                  title={`Expense: ${expensePercent}%`}
                />
              </div>
            </div>

            {/* Status note */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <PiggyBank className="w-3.5 h-3.5 text-indigo-500" />
                {isSurplus ? 'Month closed in surplus' : 'Month closed with expense deficit'}
              </span>
              <span className="font-semibold text-slate-700">
                {month.totalIncome > 0 ? `${Math.round((month.net / month.totalIncome) * 100)}% savings rate` : 'N/A'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
