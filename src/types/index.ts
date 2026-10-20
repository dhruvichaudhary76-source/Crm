export type UserRole = 'admin' | 'team_lead' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  title: string;
  department: string;
  teamLeadId?: string; // Links member to their specific Team Lead
}

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'approved' | 'pending' | 'rejected';

export type PaymentMethod = 
  | 'UPI' 
  | 'Bank Transfer' 
  | 'Cash' 
  | 'Card' 
  | 'Net Banking' 
  | 'Cheque';

export interface FinanceEntry {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  submittedBy: {
    id: string;
    name: string;
    role: UserRole;
  };
  reviewedBy?: {
    id: string;
    name: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  channelId?: string;
  recipientId?: string;
  content: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate?: boolean;
  unreadCount?: number;
}

// CRM & Team Management Types
export type LeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Interested' | 'Converted' | 'Lost';

export interface LeadActivityLog {
  id: string;
  timestamp: string;
  date: string; // YYYY-MM-DD
  staffId: string;
  staffName: string;
  callNotes: string;
  workCompleted?: string;
  result?: string;
  statusAfter: LeadStatus;
  nextFollowUpDate?: string;
}

export interface CustomerLead {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city?: string;
  assignedToId: string;
  assignedToName: string;
  status: LeadStatus;
  followUpDate: string; // YYYY-MM-DD
  requirements?: string;
  estimatedValue?: number; // In ₹
  createdAt: string;
  lastUpdated: string;
  activityLogs: LeadActivityLog[];
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedToId: string;
  assignedToName: string;
  assignedById: string;
  assignedByName: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  priority: TaskPriority;
  completedAt?: string;
  createdAt: string;
}

export interface DailyWorkReport {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: UserRole;
  date: string; // YYYY-MM-DD
  summary: string;
  hoursWorked: number;
  leadsContactedCount: number;
  tasksCompletedCount: number;
  notes?: string;
  createdAt: string;
}

export interface GoogleSheetsConfig {
  sheetUrlOrId: string;
  webhookUrl?: string;
  autoSync: boolean;
  lastSyncedAt?: string;
  status: 'connected' | 'not_configured' | 'syncing';
}
