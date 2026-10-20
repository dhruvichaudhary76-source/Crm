import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, 
  FinanceEntry, 
  ChatMessage, 
  Channel, 
  TransactionStatus,
  CustomerLead,
  LeadStatus,
  LeadActivityLog,
  TaskItem,
  DailyWorkReport,
  GoogleSheetsConfig
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CHANNELS, 
  INITIAL_FINANCE_ENTRIES, 
  INITIAL_CHAT_MESSAGES,
  INITIAL_LEADS,
  INITIAL_TASKS,
  INITIAL_WORK_REPORTS,
  INITIAL_SHEETS_CONFIG
} from '../data/mockData';
import { getTodayString } from '../utils/formatters';

export type AppView = 'chat' | 'finance' | 'admin_dashboard' | 'team_lead' | 'member_app';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeChannelId: string;
  setActiveChannelId: (id: string) => void;
  activeDirectUserId: string | null;
  setActiveDirectUserId: (id: string | null) => void;
  channels: Channel[];
  
  // Finance state & actions
  financeEntries: FinanceEntry[];
  addFinanceEntry: (data: {
    type: 'income' | 'expense';
    amount: number;
    date: string;
    category: string;
    description: string;
    paymentMethod: FinanceEntry['paymentMethod'];
  }) => void;
  approveFinanceEntry: (id: string) => void;
  rejectFinanceEntry: (id: string, reason?: string) => void;
  deleteFinanceEntry: (id: string) => void;
  
  // Aggregated totals
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  pendingCount: number;
  pendingAmount: number;

  // CRM Leads
  leads: CustomerLead[];
  createLead: (leadData: Omit<CustomerLead, 'id' | 'createdAt' | 'lastUpdated' | 'activityLogs'>) => void;
  updateLeadStatusAndLog: (
    leadId: string, 
    status: LeadStatus, 
    log: {
      callNotes: string;
      workCompleted?: string;
      result?: string;
      nextFollowUpDate?: string;
    }
  ) => void;
  updateLead: (leadId: string, updates: Partial<CustomerLead>) => void;

  // Tasks
  tasks: TaskItem[];
  createTask: (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'assignedById' | 'assignedByName'>) => void;
  updateTaskStatus: (taskId: string, status: TaskItem['status']) => void;

  // Daily Work Reports
  workReports: DailyWorkReport[];
  submitWorkReport: (reportData: {
    summary: string;
    hoursWorked: number;
    leadsContactedCount: number;
    tasksCompletedCount: number;
    notes?: string;
  }) => void;

  // Google Sheets Integration
  sheetsConfig: GoogleSheetsConfig;
  updateSheetsConfig: (updates: Partial<GoogleSheetsConfig>) => void;
  syncGoogleSheets: () => Promise<{ success: boolean; message: string }>;

  // Chat state & actions
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => void;

  // Reset
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_FINANCE = 'chathub_finance_entries_v1';
const STORAGE_KEY_CHAT = 'chathub_chat_messages_v1';
const STORAGE_KEY_USER = 'chathub_current_user_v1';
const STORAGE_KEY_LEADS = 'chathub_leads_v1';
const STORAGE_KEY_TASKS = 'chathub_tasks_v1';
const STORAGE_KEY_REPORTS = 'chathub_work_reports_v1';
const STORAGE_KEY_SHEETS = 'chathub_sheets_config_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const users = INITIAL_USERS;
  const channels = INITIAL_CHANNELS;

  // Current logged in user (Default: Aman Chaudhary - Admin)
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = users.find(u => u.id === parsed.id);
        if (match) return match;
      }
    } catch {
      // ignore
    }
    return users[0]; // Aman (Admin)
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (currentUser.role === 'admin') return 'admin_dashboard';
    if (currentUser.role === 'team_lead') return 'team_lead';
    return 'member_app';
  });

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch {
      // ignore
    }
    // Switch to role-native view automatically when role changes
    if (user.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else if (user.role === 'team_lead') {
      setCurrentView('team_lead');
    } else {
      setCurrentView('member_app');
    }
  };

  const [activeChannelId, setActiveChannelId] = useState<string>('crm-leads');
  const [activeDirectUserId, setActiveDirectUserId] = useState<string | null>(null);

  // Finance Entries
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FINANCE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FINANCE_ENTRIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FINANCE, JSON.stringify(financeEntries));
    } catch {}
  }, [financeEntries]);

  // CRM Leads
  const [leads, setLeads] = useState<CustomerLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEADS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LEADS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
    } catch {}
  }, [leads]);

  // Tasks
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Daily Work Reports
  const [workReports, setWorkReports] = useState<DailyWorkReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_WORK_REPORTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(workReports));
    } catch {}
  }, [workReports]);

  // Google Sheets Config
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHEETS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SHEETS_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHEETS, JSON.stringify(sheetsConfig));
    } catch {}
  }, [sheetsConfig]);

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHAT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CHAT_MESSAGES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  // Aggregated totals
  const { totalIncome, totalExpenses, currentBalance, pendingCount, pendingAmount } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let pCount = 0;
    let pAmount = 0;

    financeEntries.forEach(entry => {
      if (entry.type === 'income') {
        if (entry.status === 'approved') {
          income += entry.amount;
        }
      } else if (entry.type === 'expense') {
        if (entry.status === 'approved') {
          expense += entry.amount;
        } else if (entry.status === 'pending') {
          pCount += 1;
          pAmount += entry.amount;
        }
      }
    });

    return {
      totalIncome: income,
      totalExpenses: expense,
      currentBalance: income - expense,
      pendingCount: pCount,
      pendingAmount: pAmount,
    };
  }, [financeEntries]);

  // Add finance entry
  const addFinanceEntry = (data: {
    type: 'income' | 'expense';
    amount: number;
    date: string;
    category: string;
    description: string;
    paymentMethod: FinanceEntry['paymentMethod'];
  }) => {
    const isNotAdmin = currentUser.role !== 'admin';
    const initialStatus: TransactionStatus = (isNotAdmin && data.type === 'expense') ? 'pending' : 'approved';

    const newEntry: FinanceEntry = {
      id: 'fin_' + Date.now(),
      type: data.type,
      amount: data.amount,
      date: data.date,
      category: data.category,
      description: data.description,
      paymentMethod: data.paymentMethod,
      status: initialStatus,
      submittedBy: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
      },
      reviewedBy: initialStatus === 'approved' ? {
        id: currentUser.id,
        name: currentUser.name,
      } : undefined,
      reviewedAt: initialStatus === 'approved' ? getTodayString() : undefined,
      createdAt: new Date().toISOString(),
    };

    setFinanceEntries(prev => [newEntry, ...prev]);

    // Send friendly notification in the #finance-work channel
    const formattedAmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.amount);
    const notificationText = initialStatus === 'pending'
      ? `📋 Submitted expense request of ${formattedAmt} for "${data.description}" (${data.category}, via ${data.paymentMethod}) awaiting Admin approval.`
      : `✅ Recorded ${data.type === 'income' ? 'income' : 'expense'} of ${formattedAmt} for "${data.description}" (${data.category}, via ${data.paymentMethod}).`;

    const chatNote: ChatMessage = {
      id: 'msg_' + Date.now(),
      channelId: 'finance-work',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content: notificationText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, chatNote]);
  };

  // Approve entry (Admin only)
  const approveFinanceEntry = (id: string) => {
    if (currentUser.role !== 'admin') {
      alert('Only Administrators can approve finance requests.');
      return;
    }

    let approvedItem: FinanceEntry | undefined;

    setFinanceEntries(prev =>
      prev.map(item => {
        if (item.id === id) {
          approvedItem = item;
          return {
            ...item,
            status: 'approved',
            reviewedBy: {
              id: currentUser.id,
              name: currentUser.name,
            },
            reviewedAt: getTodayString(),
            rejectionReason: undefined,
          };
        }
        return item;
      })
    );

    if (approvedItem) {
      const formattedAmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(approvedItem.amount);
      const chatNote: ChatMessage = {
        id: 'msg_' + Date.now(),
        channelId: 'finance-work',
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        content: `🎉 APPROVED expense request of ${formattedAmt} from ${approvedItem.submittedBy.name} for "${approvedItem.description}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, chatNote]);
    }
  };

  // Reject entry (Admin only)
  const rejectFinanceEntry = (id: string, reason?: string) => {
    if (currentUser.role !== 'admin') {
      alert('Only Administrators can reject finance requests.');
      return;
    }

    let rejectedItem: FinanceEntry | undefined;

    setFinanceEntries(prev =>
      prev.map(item => {
        if (item.id === id) {
          rejectedItem = item;
          return {
            ...item,
            status: 'rejected',
            reviewedBy: {
              id: currentUser.id,
              name: currentUser.name,
            },
            reviewedAt: getTodayString(),
            rejectionReason: reason || 'Not approved / outside policy.',
          };
        }
        return item;
      })
    );

    if (rejectedItem) {
      const formattedAmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rejectedItem.amount);
      const chatNote: ChatMessage = {
        id: 'msg_' + Date.now(),
        channelId: 'finance-work',
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        content: `⚠️ REJECTED expense request of ${formattedAmt} from ${rejectedItem.submittedBy.name} for "${rejectedItem.description}". Reason: ${reason || 'Not approved.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, chatNote]);
    }
  };

  // Delete entry (Admin only)
  const deleteFinanceEntry = (id: string) => {
    if (currentUser.role !== 'admin') {
      alert('Only Administrators can delete finance records.');
      return;
    }
    setFinanceEntries(prev => prev.filter(item => item.id !== id));
  };

  // CRM Create Lead
  const createLead = (leadData: Omit<CustomerLead, 'id' | 'createdAt' | 'lastUpdated' | 'activityLogs'>) => {
    const newLead: CustomerLead = {
      ...leadData,
      id: 'lead_' + Date.now(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      activityLogs: [
        {
          id: 'log_' + Date.now(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: getTodayString(),
          staffId: currentUser.id,
          staffName: currentUser.name,
          callNotes: `Lead created and assigned to ${leadData.assignedToName}`,
          statusAfter: leadData.status,
          nextFollowUpDate: leadData.followUpDate,
        },
      ],
    };

    setLeads(prev => [newLead, ...prev]);

    // Send alert to #crm-leads channel
    const chatNote: ChatMessage = {
      id: 'msg_' + Date.now(),
      channelId: 'crm-leads',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content: `🎯 New Lead Assigned: ${newLead.customerName} (${newLead.phone}) assigned to ${newLead.assignedToName}. Follow-up due: ${newLead.followUpDate}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, chatNote]);
  };

  // CRM Update Lead Status and Add Call / Activity Log
  const updateLeadStatusAndLog = (
    leadId: string, 
    status: LeadStatus, 
    log: {
      callNotes: string;
      workCompleted?: string;
      result?: string;
      nextFollowUpDate?: string;
    }
  ) => {
    let updatedCustomerName = '';

    setLeads(prev =>
      prev.map(item => {
        if (item.id === leadId) {
          updatedCustomerName = item.customerName;
          const newLog: LeadActivityLog = {
            id: 'log_' + Date.now(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: getTodayString(),
            staffId: currentUser.id,
            staffName: currentUser.name,
            callNotes: log.callNotes,
            workCompleted: log.workCompleted,
            result: log.result,
            statusAfter: status,
            nextFollowUpDate: log.nextFollowUpDate || item.followUpDate,
          };

          return {
            ...item,
            status,
            followUpDate: log.nextFollowUpDate || item.followUpDate,
            lastUpdated: new Date().toISOString(),
            activityLogs: [newLog, ...item.activityLogs],
          };
        }
        return item;
      })
    );

    // Notify channel
    const chatNote: ChatMessage = {
      id: 'msg_' + Date.now(),
      channelId: 'crm-leads',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content: `📞 Lead Update: ${currentUser.name} updated "${updatedCustomerName}" status to "${status}". Notes: ${log.callNotes}${log.nextFollowUpDate ? ` | Next follow-up: ${log.nextFollowUpDate}` : ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, chatNote]);
  };

  // Update lead general fields
  const updateLead = (leadId: string, updates: Partial<CustomerLead>) => {
    setLeads(prev =>
      prev.map(item => (item.id === leadId ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item))
    );
  };

  // Task creation
  const createTask = (taskData: Omit<TaskItem, 'id' | 'createdAt' | 'assignedById' | 'assignedByName'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: 'task_' + Date.now(),
      assignedById: currentUser.id,
      assignedByName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);

    // Send note to operations channel
    const chatNote: ChatMessage = {
      id: 'msg_' + Date.now(),
      channelId: 'operations',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content: `📌 Task Assigned: "${newTask.title}" assigned to ${newTask.assignedToName} (Due: ${newTask.dueDate}, Priority: ${newTask.priority}).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, chatNote]);
  };

  // Update task status
  const updateTaskStatus = (taskId: string, status: TaskItem['status']) => {
    let taskTitle = '';
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          taskTitle = t.title;
          return {
            ...t,
            status,
            completedAt: status === 'Done' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );

    if (status === 'Done') {
      const chatNote: ChatMessage = {
        id: 'msg_' + Date.now(),
        channelId: 'operations',
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        content: `🎉 Task Completed: ${currentUser.name} marked "${taskTitle}" as Done.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, chatNote]);
    }
  };

  // Submit Daily Work Report
  const submitWorkReport = (reportData: {
    summary: string;
    hoursWorked: number;
    leadsContactedCount: number;
    tasksCompletedCount: number;
    notes?: string;
  }) => {
    const newReport: DailyWorkReport = {
      id: 'rep_' + Date.now(),
      staffId: currentUser.id,
      staffName: currentUser.name,
      staffRole: currentUser.role,
      date: getTodayString(),
      summary: reportData.summary,
      hoursWorked: reportData.hoursWorked,
      leadsContactedCount: reportData.leadsContactedCount,
      tasksCompletedCount: reportData.tasksCompletedCount,
      notes: reportData.notes,
      createdAt: new Date().toISOString(),
    };

    setWorkReports(prev => [newReport, ...prev]);

    const chatNote: ChatMessage = {
      id: 'msg_' + Date.now(),
      channelId: 'operations',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content: `📝 Daily Work Report Submitted by ${currentUser.name}: ${reportData.hoursWorked} hrs worked, ${reportData.leadsContactedCount} leads contacted, ${reportData.tasksCompletedCount} tasks completed.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, chatNote]);
  };

  // Google Sheets Config
  const updateSheetsConfig = (updates: Partial<GoogleSheetsConfig>) => {
    setSheetsConfig(prev => ({ ...prev, ...updates }));
  };

  // Sync with Google Sheets
  const syncGoogleSheets = async (): Promise<{ success: boolean; message: string }> => {
    setSheetsConfig(prev => ({ ...prev, status: 'syncing' }));

    // Simulate reliable sync or dispatch to Webhook
    return new Promise(resolve => {
      setTimeout(() => {
        const timeStr = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        setSheetsConfig(prev => ({
          ...prev,
          status: 'connected',
          lastSyncedAt: timeStr,
        }));
        resolve({
          success: true,
          message: `Successfully synchronized ${leads.length} leads, ${financeEntries.length} finance entries, and ${workReports.length} daily reports with Google Sheets.`,
        });
      }, 900);
    });
  };

  // Send chat message
  const sendChatMessage = (content: string) => {
    if (!content.trim()) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      channelId: activeDirectUserId ? undefined : activeChannelId,
      recipientId: activeDirectUserId || undefined,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, newMsg]);
  };

  // Reset data to initial mock
  const resetData = () => {
    setFinanceEntries(INITIAL_FINANCE_ENTRIES);
    setLeads(INITIAL_LEADS);
    setTasks(INITIAL_TASKS);
    setWorkReports(INITIAL_WORK_REPORTS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setSheetsConfig(INITIAL_SHEETS_CONFIG);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.removeItem(STORAGE_KEY_FINANCE);
    localStorage.removeItem(STORAGE_KEY_CHAT);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_LEADS);
    localStorage.removeItem(STORAGE_KEY_TASKS);
    localStorage.removeItem(STORAGE_KEY_REPORTS);
    localStorage.removeItem(STORAGE_KEY_SHEETS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        currentView,
        setCurrentView,
        activeChannelId,
        setActiveChannelId,
        activeDirectUserId,
        setActiveDirectUserId,
        channels,
        financeEntries,
        addFinanceEntry,
        approveFinanceEntry,
        rejectFinanceEntry,
        deleteFinanceEntry,
        totalIncome,
        totalExpenses,
        currentBalance,
        pendingCount,
        pendingAmount,
        leads,
        createLead,
        updateLeadStatusAndLog,
        updateLead,
        tasks,
        createTask,
        updateTaskStatus,
        workReports,
        submitWorkReport,
        sheetsConfig,
        updateSheetsConfig,
        syncGoogleSheets,
        chatMessages,
        sendChatMessage,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
