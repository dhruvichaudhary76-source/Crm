import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  ExternalLink,
  Sliders,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({ isOpen, onClose }) => {
  const { 
    sheetsConfig, 
    updateSheetsConfig, 
    syncGoogleSheets, 
    leads, 
    financeEntries, 
    workReports 
  } = useApp();

  const [sheetUrl, setSheetUrl] = useState(sheetsConfig.sheetUrlOrId);
  const [webhookUrl, setWebhookUrl] = useState(sheetsConfig.webhookUrl || '');
  const [autoSync, setAutoSync] = useState(sheetsConfig.autoSync);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSheetsConfig({
      sheetUrlOrId: sheetUrl.trim(),
      webhookUrl: webhookUrl.trim(),
      autoSync,
    });
    setStatusMessage('Google Sheets configuration saved.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await syncGoogleSheets();
      setStatusMessage(res.message);
    } catch {
      setStatusMessage('Sync encountered an error.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Export CSV helper for instant download of all leads / reports / finances
  const handleDownloadCSV = (dataset: 'leads' | 'finances' | 'reports') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (dataset === 'leads') {
      filename = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['ID', 'Customer Name', 'Phone', 'Email', 'City', 'Assigned To', 'Status', 'Follow-up Date', 'Value (INR)', 'Created At'];
      rows = leads.map(l => [
        l.id,
        `"${l.customerName}"`,
        `"${l.phone}"`,
        `"${l.email || ''}"`,
        `"${l.city || ''}"`,
        `"${l.assignedToName}"`,
        l.status,
        l.followUpDate,
        String(l.estimatedValue || 0),
        l.createdAt,
      ]);
    } else if (dataset === 'finances') {
      filename = `finances_export_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['ID', 'Type', 'Amount (INR)', 'Date', 'Category', 'Description', 'Method', 'Status', 'Submitted By'];
      rows = financeEntries.map(f => [
        f.id,
        f.type,
        String(f.amount),
        f.date,
        `"${f.category}"`,
        `"${f.description}"`,
        f.paymentMethod,
        f.status,
        `"${f.submittedBy.name}"`,
      ]);
    } else {
      filename = `work_reports_export_${new Date().toISOString().split('T')[0]}.csv`;
      headers = ['ID', 'Date', 'Staff Name', 'Hours Worked', 'Leads Contacted', 'Tasks Completed', 'Summary'];
      rows = workReports.map(r => [
        r.id,
        r.date,
        `"${r.staffName}"`,
        String(r.hoursWorked),
        String(r.leadsContactedCount),
        String(r.tasksCompletedCount),
        `"${r.summary.replace(/"/g, '""')}"`,
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Google Sheets Integration</h3>
              <p className="text-xs text-slate-500">Live two-way records sync & reporting pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status banner */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Status: Connected to Google Sheets
                </p>
                <p className="text-[11px] text-emerald-700">
                  Last Synced: {sheetsConfig.lastSyncedAt || 'Active'}
                </p>
              </div>
            </div>

            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          {statusMessage && (
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Form Configuration */}
          <form onSubmit={handleSaveConfig} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Spreadsheet URL / ID
              </label>
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Connects sheets tabs: [Leads_CRM], [Finance_Ledger], and [Daily_Reports].
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Apps Script Webhook URL (Optional for instant live sync)
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="autoSync"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="autoSync" className="text-xs text-slate-700 font-medium">
                Automatically push lead updates and approved expenses to Google Sheets
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs"
            >
              Save Configuration
            </button>
          </form>

          {/* Direct CSV Downloads */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Direct CSV / Spreadsheet Downloads
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleDownloadCSV('leads')}
                className="p-2.5 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-xs text-slate-800 block">Customer Leads</span>
                <span className="text-[10px] text-slate-400">{leads.length} records · CSV</span>
              </button>

              <button
                onClick={() => handleDownloadCSV('finances')}
                className="p-2.5 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-xs text-slate-800 block">Finance Records</span>
                <span className="text-[10px] text-slate-400">{financeEntries.length} entries · CSV</span>
              </button>

              <button
                onClick={() => handleDownloadCSV('reports')}
                className="p-2.5 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-xs text-slate-800 block">Work Reports</span>
                <span className="text-[10px] text-slate-400">{workReports.length} reports · CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <a
            href={sheetsConfig.sheetUrlOrId || 'https://docs.google.com/spreadsheets'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>Open Connected Sheet in Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
