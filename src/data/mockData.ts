import { 
  User, 
  FinanceEntry, 
  ChatMessage, 
  Channel, 
  CustomerLead, 
  TaskItem, 
  DailyWorkReport,
  GoogleSheetsConfig 
} from '../types';
import { getTodayString } from '../utils/formatters';

const today = getTodayString();

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Aman Chaudhary',
    email: 'aman@chathub.internal',
    phone: '+91 98100 12345',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    title: 'Managing Admin / Operations',
    department: 'Management',
  },
  {
    id: 'user_2',
    name: 'Priya Sharma',
    email: 'priya@chathub.internal',
    phone: '+91 98200 23456',
    role: 'team_lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    title: 'Team Lead - Client Solutions',
    department: 'Client Solutions',
  },
  {
    id: 'user_3',
    name: 'Rahul Verma',
    email: 'rahul@chathub.internal',
    phone: '+91 98300 34567',
    role: 'team_lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    title: 'Team Lead - Tech & Operations',
    department: 'Tech & Operations',
  },
  {
    id: 'user_4',
    name: 'Sneha Patel',
    email: 'sneha@chathub.internal',
    phone: '+91 98400 45678',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    title: 'Client Relationship Executive',
    department: 'Client Solutions',
    teamLeadId: 'user_2', // Reports to Priya Sharma
  },
  {
    id: 'user_5',
    name: 'Vikram Rao',
    email: 'vikram@chathub.internal',
    phone: '+91 98500 56789',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    title: 'Customer Onboarding Specialist',
    department: 'Tech & Operations',
    teamLeadId: 'user_3', // Reports to Rahul Verma
  },
];

export const INCOME_CATEGORIES = [
  'Client Payment',
  'Consulting & Services',
  'Project Milestone',
  'Product Retainer',
  'Software Development',
  'Miscellaneous Income',
];

export const EXPENSE_CATEGORIES = [
  'Software Subscriptions',
  'Hardware & Equipment',
  'Travel & Fuel',
  'Office Supplies & Rent',
  'Team Meals & Snacks',
  'Client Meetings',
  'Internet & Utilities',
  'Professional Services',
  'Miscellaneous Expense',
];

export const PAYMENT_METHODS = [
  'UPI',
  'Bank Transfer',
  'Cash',
  'Card',
  'Net Banking',
  'Cheque',
] as const;

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'general',
    name: 'general',
    description: 'Company-wide announcements and team discussions',
  },
  {
    id: 'crm-leads',
    name: 'crm-leads',
    description: 'Lead assignments, conversions, and customer updates',
  },
  {
    id: 'finance-work',
    name: 'finance-work',
    description: 'Finance records, expense approvals, and invoices',
  },
  {
    id: 'operations',
    name: 'operations',
    description: 'Daily operational tasks, handovers, and work logs',
  },
];

export const INITIAL_FINANCE_ENTRIES: FinanceEntry[] = [
  {
    id: 'fin_001',
    type: 'income',
    amount: 175000,
    date: today,
    category: 'Client Payment',
    description: 'Acme Corp Milestone 2 Payment received for Cloud Hub setup',
    paymentMethod: 'Bank Transfer',
    status: 'approved',
    submittedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
      role: 'admin',
    },
    reviewedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
    },
    reviewedAt: today,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fin_002',
    type: 'expense',
    amount: 14999,
    date: today,
    category: 'Software Subscriptions',
    description: 'Monthly AWS Cloud servers & database hosting',
    paymentMethod: 'Card',
    status: 'approved',
    submittedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
      role: 'admin',
    },
    reviewedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
    },
    reviewedAt: today,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fin_003',
    type: 'expense',
    amount: 4200,
    date: today,
    category: 'Team Meals & Snacks',
    description: 'Quarterly team sprint retrospective dinner & refreshments',
    paymentMethod: 'UPI',
    status: 'pending',
    submittedBy: {
      id: 'user_2',
      name: 'Priya Sharma',
      role: 'team_lead',
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'fin_004',
    type: 'expense',
    amount: 1250,
    date: today,
    category: 'Travel & Fuel',
    description: 'Client on-site visit cab fare (Andheri to BKC)',
    paymentMethod: 'UPI',
    status: 'pending',
    submittedBy: {
      id: 'user_4',
      name: 'Sneha Patel',
      role: 'member',
    },
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'fin_005',
    type: 'income',
    amount: 85000,
    date: '2026-10-18',
    category: 'Project Milestone',
    description: 'Fintech mobile app prototype design delivery fee',
    paymentMethod: 'Bank Transfer',
    status: 'approved',
    submittedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
      role: 'admin',
    },
    reviewedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
    },
    reviewedAt: '2026-10-18',
    createdAt: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'fin_006',
    type: 'expense',
    amount: 3200,
    date: '2026-10-18',
    category: 'Internet & Utilities',
    description: 'Office high-speed fiber broadband monthly bill',
    paymentMethod: 'Net Banking',
    status: 'approved',
    submittedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
      role: 'admin',
    },
    reviewedBy: {
      id: 'user_1',
      name: 'Aman Chaudhary',
    },
    reviewedAt: '2026-10-18',
    createdAt: '2026-10-18T12:00:00.000Z',
  },
];

export const INITIAL_LEADS: CustomerLead[] = [
  {
    id: 'lead_101',
    customerName: 'Rajesh Malhotra',
    phone: '+91 98210 11223',
    email: 'rajesh@malhotratech.com',
    city: 'Mumbai',
    assignedToId: 'user_4', // Sneha Patel
    assignedToName: 'Sneha Patel',
    status: 'Follow-up',
    followUpDate: today, // Due today!
    requirements: 'Interested in team collaboration hub and customer CRM for 25 sales agents.',
    estimatedValue: 48000,
    createdAt: '2026-10-15T09:30:00.000Z',
    lastUpdated: '2026-10-18T14:20:00.000Z',
    activityLogs: [
      {
        id: 'act_1',
        date: '2026-10-16',
        timestamp: '11:30 AM',
        staffId: 'user_4',
        staffName: 'Sneha Patel',
        callNotes: 'Discussed requirements. Client wants mobile app access and WhatsApp integration.',
        workCompleted: 'Shared product deck and pricing matrix via email.',
        result: 'Positive response; scheduled review call.',
        statusAfter: 'Follow-up',
        nextFollowUpDate: today,
      },
    ],
  },
  {
    id: 'lead_102',
    customerName: 'Ananya Deshmukh',
    phone: '+91 99340 55667',
    email: 'ananya@punesolutions.in',
    city: 'Pune',
    assignedToId: 'user_4', // Sneha Patel
    assignedToName: 'Sneha Patel',
    status: 'Interested',
    followUpDate: '2026-10-21',
    requirements: 'Requires invoicing & expense tracking with multi-user approval levels.',
    estimatedValue: 75000,
    createdAt: '2026-10-17T11:00:00.000Z',
    lastUpdated: '2026-10-18T16:00:00.000Z',
    activityLogs: [
      {
        id: 'act_2',
        date: '2026-10-18',
        timestamp: '04:00 PM',
        staffId: 'user_4',
        staffName: 'Sneha Patel',
        callNotes: 'Demonstrated finance workflow and admin approval panel. Client was satisfied.',
        workCompleted: 'Prepared customized quote with 3-tier team license.',
        result: 'Client requested commercial quotation for internal signoff.',
        statusAfter: 'Interested',
        nextFollowUpDate: '2026-10-21',
      },
    ],
  },
  {
    id: 'lead_103',
    customerName: 'Deepak Singhania',
    phone: '+91 97110 99887',
    email: 'deepak@singhaniatrading.co',
    city: 'Delhi NCR',
    assignedToId: 'user_4', // Sneha Patel
    assignedToName: 'Sneha Patel',
    status: 'New',
    followUpDate: today,
    requirements: 'Inquired through web contact form regarding quick deployment for retail stores.',
    estimatedValue: 35000,
    createdAt: '2026-10-19T08:00:00.000Z',
    lastUpdated: '2026-10-19T08:00:00.000Z',
    activityLogs: [],
  },
  {
    id: 'lead_104',
    customerName: 'Karthik Raman',
    phone: '+91 94440 22334',
    email: 'karthik@chennaifin.org',
    city: 'Chennai',
    assignedToId: 'user_5', // Vikram Rao
    assignedToName: 'Vikram Rao',
    status: 'Converted',
    followUpDate: '2026-10-18',
    requirements: 'Custom cloud onboarding and security audit for financial consultancy.',
    estimatedValue: 120000,
    createdAt: '2026-10-10T10:00:00.000Z',
    lastUpdated: '2026-10-18T17:30:00.000Z',
    activityLogs: [
      {
        id: 'act_3',
        date: '2026-10-18',
        timestamp: '05:30 PM',
        staffId: 'user_5',
        staffName: 'Vikram Rao',
        callNotes: 'Final agreement signed and onboarding kick-off session completed.',
        workCompleted: 'Created workspace tenant and provisioned team credentials.',
        result: 'Advance payment of ₹1,20,000 confirmed.',
        statusAfter: 'Converted',
      },
    ],
  },
  {
    id: 'lead_105',
    customerName: 'Meera Iyer',
    phone: '+91 98450 66778',
    email: 'meera@bangalorelogistics.in',
    city: 'Bengaluru',
    assignedToId: 'user_5', // Vikram Rao
    assignedToName: 'Vikram Rao',
    status: 'Contacted',
    followUpDate: '2026-10-22',
    requirements: 'Fleet operations dispatch management tool.',
    estimatedValue: 50000,
    createdAt: '2026-10-17T14:00:00.000Z',
    lastUpdated: '2026-10-18T11:00:00.000Z',
    activityLogs: [
      {
        id: 'act_4',
        date: '2026-10-18',
        timestamp: '11:00 AM',
        staffId: 'user_5',
        staffName: 'Vikram Rao',
        callNotes: 'Connected with manager. They are reviewing current software vendor contract.',
        workCompleted: 'Sent comparative feature matrix.',
        result: 'Awaiting decision after upcoming monthly review.',
        statusAfter: 'Contacted',
        nextFollowUpDate: '2026-10-22',
      },
    ],
  },
  {
    id: 'lead_106',
    customerName: 'Suresh Bhatia',
    phone: '+91 98990 33445',
    email: 'suresh@bhatiagroup.com',
    city: 'Jaipur',
    assignedToId: 'user_5', // Vikram Rao
    assignedToName: 'Vikram Rao',
    status: 'Lost',
    followUpDate: '2026-10-14',
    requirements: 'Requested on-premise legacy Windows XP installation which is unsupported.',
    estimatedValue: 20000,
    createdAt: '2026-10-12T09:00:00.000Z',
    lastUpdated: '2026-10-15T15:00:00.000Z',
    activityLogs: [
      {
        id: 'act_5',
        date: '2026-10-15',
        timestamp: '03:00 PM',
        staffId: 'user_5',
        staffName: 'Vikram Rao',
        callNotes: 'Client unable to move to modern cloud browser or Android apps.',
        workCompleted: 'Explained technical architecture constraints.',
        result: 'Closed lead as legacy requirements incompatible.',
        statusAfter: 'Lost',
      },
    ],
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task_001',
    title: 'Follow up with Rajesh Malhotra (Malhotra Tech)',
    description: 'Call client to review quotation and answer questions on team license.',
    assignedToId: 'user_4', // Sneha Patel
    assignedToName: 'Sneha Patel',
    assignedById: 'user_2', // Priya Sharma (Team Lead)
    assignedByName: 'Priya Sharma',
    dueDate: today,
    status: 'In Progress',
    priority: 'High',
    createdAt: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'task_002',
    title: 'Send onboarding welcome pack to Chennai Fin',
    description: 'Dispatch getting started checklist and schedule admin walkthrough.',
    assignedToId: 'user_4', // Sneha Patel
    assignedToName: 'Sneha Patel',
    assignedById: 'user_2', // Priya Sharma (Team Lead)
    assignedByName: 'Priya Sharma',
    dueDate: today,
    status: 'Todo',
    priority: 'Medium',
    createdAt: '2026-10-19T08:30:00.000Z',
  },
  {
    id: 'task_003',
    title: 'Verify server logs & database backup retention',
    description: 'Perform routine quarterly check of cloud backups and uptime status.',
    assignedToId: 'user_5', // Vikram Rao
    assignedToName: 'Vikram Rao',
    assignedById: 'user_3', // Rahul Verma (Team Lead)
    assignedByName: 'Rahul Verma',
    dueDate: today,
    status: 'Done',
    priority: 'High',
    completedAt: '2026-10-19T11:00:00.000Z',
    createdAt: '2026-10-18T14:00:00.000Z',
  },
  {
    id: 'task_004',
    title: 'Assist Meera Iyer with test credentials',
    description: 'Create sandbox environment with 3 sample user accounts for testing.',
    assignedToId: 'user_5', // Vikram Rao
    assignedToName: 'Vikram Rao',
    assignedById: 'user_3', // Rahul Verma (Team Lead)
    assignedByName: 'Rahul Verma',
    dueDate: '2026-10-21',
    status: 'Todo',
    priority: 'Medium',
    createdAt: '2026-10-19T09:00:00.000Z',
  },
];

export const INITIAL_WORK_REPORTS: DailyWorkReport[] = [
  {
    id: 'rep_001',
    staffId: 'user_4',
    staffName: 'Sneha Patel',
    staffRole: 'member',
    date: '2026-10-18',
    summary: 'Conducted 4 client calls, sent 2 customized quotations, and followed up on Acme Corp feedback.',
    hoursWorked: 8.5,
    leadsContactedCount: 4,
    tasksCompletedCount: 3,
    notes: 'Good pipeline response from Mumbai region. Expecting conversion from Ananya Deshmukh this week.',
    createdAt: '2026-10-18T18:15:00.000Z',
  },
  {
    id: 'rep_002',
    staffId: 'user_5',
    staffName: 'Vikram Rao',
    staffRole: 'member',
    date: '2026-10-18',
    summary: 'Successfully converted Karthik Raman (Chennai Fin), completed onboarding setup, and ran security checks.',
    hoursWorked: 8.0,
    leadsContactedCount: 3,
    tasksCompletedCount: 2,
    notes: 'Deployment went smoothly. Client is excited to start using the Chat Hub system.',
    createdAt: '2026-10-18T18:00:00.000Z',
  },
];

export const INITIAL_SHEETS_CONFIG: GoogleSheetsConfig = {
  sheetUrlOrId: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  webhookUrl: '',
  autoSync: true,
  lastSyncedAt: 'Today at 07:45 PM',
  status: 'connected',
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_001',
    channelId: 'general',
    senderId: 'user_1',
    senderName: 'Aman Chaudhary',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    senderRole: 'admin',
    content: 'Welcome team! Our Chat Hub system now includes integrated CRM, Team Work Reports, and Finance approvals in Indian Rupees.',
    timestamp: '10:00 AM',
  },
  {
    id: 'msg_002',
    channelId: 'crm-leads',
    senderId: 'user_1',
    senderName: 'Aman Chaudhary',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    senderRole: 'admin',
    content: 'New leads have been assigned to Sneha and Vikram. Please check your "My Leads" section and schedule follow-ups.',
    timestamp: '10:15 AM',
  },
  {
    id: 'msg_003',
    channelId: 'crm-leads',
    senderId: 'user_4',
    senderName: 'Sneha Patel',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    senderRole: 'member',
    content: 'Received! Following up with Rajesh Malhotra today and updating the call log with notes.',
    timestamp: '10:20 AM',
  },
];
