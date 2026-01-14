// Auto-Update Engine - Core State Machine for TOPS QRT
// Handles client lifecycle, box-to-box movement, and real-time updates

export interface ClientRecord {
  id: string;
  name: string;
  unit: string;
  phone: string;
  area: string;
  status: 'new' | 'active' | 'inactive' | 'closed';
  currentBox: string;
  serviceType: string;
  startDate: Date;
  endDate?: Date;
  pendingAmount: number;
  lastActionDate: Date;
  nextActionDue?: Date;
  attemptCount: number;
  assignedOfficer?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  clientId: string;
  clientName: string;
  fromBox?: string;
  toBox?: string;
  remark: string;
  result: 'done' | 'follow-up' | 'pending';
  oldValue?: string;
  newValue?: string;
}

export interface FollowUpTask {
  id: string;
  clientId: string;
  clientName: string;
  taskType: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  assignedOfficer: string;
  status: 'pending' | 'completed' | 'overdue';
  createdAt: Date;
}

export interface PendingSummary {
  currentPending: number;
  previousPending: number;
  todayCollection: {
    count: number;
    amount: number;
  };
  followUpsCompleted: number;
  followUpsTotal: number;
}

export interface BoxState {
  id: string;
  count: number;
  clients: ClientRecord[];
}

export interface SystemState {
  boxes: Record<string, BoxState>;
  clients: Record<string, ClientRecord>;
  auditLog: AuditLogEntry[];
  followUpTasks: FollowUpTask[];
  pendingSummary: PendingSummary;
  systemHealth: 'healthy' | 'syncing' | 'attention-needed';
  demoMode: boolean;
  lastHealthCheck: Date;
}

// Movement rules based on result
export interface MovementRule {
  fromBox: string;
  result: 'done' | 'follow-up' | 'pending';
  toBox: string | null; // null means stay in current box
  statusChange?: 'active' | 'inactive' | 'closed';
  createFollowUp?: boolean;
  updateCollection?: boolean;
}

export const movementRules: MovementRule[] = [
  // Trial Visit rules
  { fromBox: 'trial-visit', result: 'done', toBox: 'payment-visit', statusChange: 'active', createFollowUp: true },
  { fromBox: 'trial-visit', result: 'follow-up', toBox: null, createFollowUp: true },
  { fromBox: 'trial-visit', result: 'pending', toBox: null },
  
  // Payment Visit rules
  { fromBox: 'payment-visit', result: 'done', toBox: 'user-bill-making', updateCollection: true },
  { fromBox: 'payment-visit', result: 'follow-up', toBox: 'user-payment-call', createFollowUp: true },
  { fromBox: 'payment-visit', result: 'pending', toBox: 'user-payment-call' },
  
  // GST Visit rules
  { fromBox: 'gst-visit-1', result: 'done', toBox: null },
  { fromBox: 'gst-visit-1', result: 'follow-up', toBox: 'user-gst-call', createFollowUp: true },
  { fromBox: 'gst-visit-2', result: 'done', toBox: null },
  { fromBox: 'gst-visit-2', result: 'follow-up', toBox: 'user-gst-call', createFollowUp: true },
  
  // Complaint Visit rules
  { fromBox: 'complaint-visit', result: 'done', toBox: null },
  { fromBox: 'complaint-visit', result: 'follow-up', toBox: 'user-complaint-call', createFollowUp: true },
  { fromBox: 'complaint-visit', result: 'pending', toBox: 'user-complaint-call' },
  
  // Unsubscriber Visit rules
  { fromBox: 'unsubscriber-visit', result: 'done', toBox: null, statusChange: 'closed' },
  { fromBox: 'unsubscriber-visit', result: 'follow-up', toBox: 'user-unsubscriber-call', createFollowUp: true },
  
  // User Payment Call rules
  { fromBox: 'user-payment-call', result: 'done', toBox: 'payment-visit' },
  { fromBox: 'user-payment-call', result: 'follow-up', toBox: null, createFollowUp: true },
  
  // User Trial Call rules
  { fromBox: 'user-trial-call', result: 'done', toBox: 'trial-visit' },
  { fromBox: 'user-trial-call', result: 'follow-up', toBox: null, createFollowUp: true },
  
  // User GST Call rules
  { fromBox: 'user-gst-call', result: 'done', toBox: 'gst-visit-1' },
  { fromBox: 'user-gst-call', result: 'follow-up', toBox: null, createFollowUp: true },
  
  // User Complaint Call rules
  { fromBox: 'user-complaint-call', result: 'done', toBox: null },
  { fromBox: 'user-complaint-call', result: 'follow-up', toBox: 'complaint-visit', createFollowUp: true },
  
  // User Unsubscriber Call rules
  { fromBox: 'user-unsubscriber-call', result: 'done', toBox: null, statusChange: 'closed' },
  { fromBox: 'user-unsubscriber-call', result: 'follow-up', toBox: 'unsubscriber-visit', createFollowUp: true },
  
  // Bill flow rules
  { fromBox: 'user-bill-making', result: 'done', toBox: 'user-bill-distributing' },
  { fromBox: 'user-bill-distributing', result: 'done', toBox: 'user-bill-whatsapp' },
  { fromBox: 'user-bill-whatsapp', result: 'done', toBox: null },
];

// Get result options based on box type
export const getResultOptionsForBox = (boxId: string): { value: string; label: string; description: string }[] => {
  const baseOptions = [
    { value: 'done', label: 'Done', description: 'Task completed successfully' },
    { value: 'follow-up', label: 'Follow-Up', description: 'Needs another attempt' },
    { value: 'pending', label: 'Pending', description: 'Client not available' },
  ];

  // Customize based on box category
  if (boxId.includes('trial')) {
    return [
      { value: 'done', label: 'Done - Client Agreed', description: 'Move to Payment Visit' },
      { value: 'follow-up', label: 'Follow-Up - Second Visit', description: 'Schedule another visit' },
      { value: 'pending', label: 'Pending - Not Available', description: 'Reschedule' },
    ];
  }

  if (boxId.includes('payment')) {
    return [
      { value: 'done', label: 'Done - Payment Collected', description: 'Move to Bill Making' },
      { value: 'follow-up', label: 'Follow-Up - Promised', description: 'Schedule reminder' },
      { value: 'pending', label: 'Pending - Unavailable', description: 'Move to Payment Call' },
    ];
  }

  if (boxId.includes('unsubscriber')) {
    return [
      { value: 'done', label: 'Done - Settlement Complete', description: 'Close unit' },
      { value: 'follow-up', label: 'Follow-Up - Retention', description: 'Attempt retention' },
    ];
  }

  if (boxId.includes('bill')) {
    return [
      { value: 'done', label: 'Done', description: 'Move to next step' },
    ];
  }

  return baseOptions;
};

// Find movement rule for a given action
export const findMovementRule = (fromBox: string, result: 'done' | 'follow-up' | 'pending'): MovementRule | undefined => {
  return movementRules.find(rule => rule.fromBox === fromBox && rule.result === result);
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get box display name
export const getBoxDisplayName = (boxId: string): string => {
  const names: Record<string, string> = {
    'payment-visit': 'Payment Visit',
    'trial-visit': 'Trial Visit',
    'gst-visit-1': 'GST Visit',
    'gst-visit-2': 'GST Visit',
    'complaint-visit': 'Complaint Visit',
    'unsubscriber-visit': 'Unsubscriber Visit',
    'payment-call': 'Payment Call',
    'trial-call': 'Trial Call',
    'user-payment-call': 'Payment Call',
    'user-trial-call': 'Trial Call',
    'user-gst-call': 'GST Call',
    'user-complaint-call': 'Complaint Call',
    'user-unsubscriber-call': 'Unsubscriber Call',
    'user-bill-making': 'Bill Making',
    'user-bill-distributing': 'Bill Distributing',
    'user-bill-whatsapp': 'Bill WhatsApp',
  };
  return names[boxId] || boxId;
};

// Calculate priority based on attempt count
export const calculatePriority = (attemptCount: number): 'low' | 'medium' | 'high' => {
  if (attemptCount >= 3) return 'high';
  if (attemptCount >= 2) return 'medium';
  return 'low';
};

// Get random client for simulation
export const getRandomClient = (clients: ClientRecord[]): ClientRecord | undefined => {
  if (clients.length === 0) return undefined;
  return clients[Math.floor(Math.random() * clients.length)];
};

// Get random result for simulation
export const getRandomResult = (): 'done' | 'follow-up' | 'pending' => {
  const results: ('done' | 'follow-up' | 'pending')[] = ['done', 'follow-up', 'pending'];
  const weights = [0.4, 0.4, 0.2]; // 40% done, 40% follow-up, 20% pending
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < results.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) return results[i];
  }
  return 'done';
};
