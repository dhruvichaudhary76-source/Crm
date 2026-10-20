import React from 'react';
import { Calendar, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { FinanceEntry } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';

interface FinanceDailySummaryProps {
  entries: FinanceEntry[];
}

interface DailyGroup {
  date: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
  items: FinanceEntry[];
}

export const FinanceDailySummary: React.FC<FinanceDailySummaryProps> = ({ entries }) => {
  // Group entries by date
  const dailyGroups = React.useMemo(() => {
    const groupsMap = new Map<string, DailyGroup>();

    entries.forEach((entry) => {
      if (!groupsMap.has(entry.date)) {
        groupsMap.set(entry.date, {
          date: entry.date,
          totalIncome: 0,
          totalExpense: 0,
          net: 0,
          items: [],
        });
      }

      const group = groupsMap.get(entry.date)!;
      group.items.push(entry);

      // Only approved items count towards the daily net
      if (entry.status === 'approved') {
        if (entry.type === 'income') {
          group.totalIncome += entry.amount;
        } else if (entry.type === 'expense') {
          group.totalExpense += entry.amount;
        }
      }
    });

    // Calculate net for each
    groupsMap.forEach((g) => {
      g.net = g.totalIncome - g.totalExpense;
    });

    // Sort dates descending
    return Array.from(groupsMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [entries]);

  if (dailyGroups.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
        No daily records available for the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dailyGroups.map((group) => {
        const isPositive = group.net >= 0;

        return (
          <div 
            key={group.date}
            className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden"
          >
            {/* Daily Header Summary */}
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {formatDate(group.date)}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{group.date}</span>
                </div>
              </div>

              {/* Day stats */}
              <div className="flex items-center gap-3 sm:gap-4 text-xs">
                <div className="flex items-center gap-1 text-emerald-700">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">In:</span>
                  <span className="font-semibold">{formatINR(group.totalIncome)}</span>
                </div>
                <div className="flex items-center gap-1 text-rose-700">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Out:</span>
                  <span className="font-semibold">{formatINR(group.totalExpense)}</span>
                </div>
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200 font-bold">
                  <span className="text-slate-400 text-[10px] uppercase">Net:</span>
                  <span className={isPositive ? 'text-indigo-600' : 'text-rose-600'}>
                    {isPositive ? '+' : ''}{formatINR(group.net)}
                  </span>
                </div>
              </div>
            </div>

            {/* List of items in this day */}
            <div className="divide-y divide-slate-100">
              {group.items.map((item) => {
                const isIncome = item.type === 'income';

                return (
                  <div key={item.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50/50">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                        isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {isIncome ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{item.description}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.category} · via {item.paymentMethod} · by {item.submittedBy.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`font-bold ${isIncome ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {isIncome ? '+' : '-'}{formatINR(item.amount)}
                      </div>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                        item.status === 'approved' ? 'text-emerald-600' :
                        item.status === 'pending' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
