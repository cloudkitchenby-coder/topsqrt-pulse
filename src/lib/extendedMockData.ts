// Extended mock data for complete CRM system

export interface ExtendedClient {
  id: string;
  clientId: string;
  name: string;
  unit: string;
  phone: string;
  area: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
  email: string;
  address: string;
  totalAmount: number;
  paidAmount: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  clientName: string;
  unit: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  officer: string;
  receiptNo: string;
  paymentMethod: string;
}

export interface UnsubscriberRecord {
  id: string;
  clientName: string;
  unit: string;
  phone: string;
  unsubscribeDate: string;
  reason: string;
  area: string;
}

export interface ClosedUnit {
  id: string;
  unit: string;
  clientName: string;
  closureDate: string;
  reason: string;
  finalSettlement: 'completed' | 'pending' | 'disputed';
  area: string;
}

export interface StampRecord {
  id: string;
  date: string;
  clientName: string;
  unit: string;
  stampType: string;
  amount: number;
  officer: string;
}

export interface Officer {
  id: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  status: 'active' | 'break' | 'offline';
  currentLocation: string;
  lastUpdate: string;
  visitsCompleted: number;
}

// Generate random Indian names
const indianFirstNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikram', 'Neha', 'Suresh', 'Kavita', 'Manoj', 'Anita', 'Deepak', 'Rekha', 'Ashok', 'Pooja', 'Rahul', 'Shweta', 'Nitin', 'Meera', 'Sanjay', 'Geeta', 'Vivek', 'Ritu', 'Arun', 'Shalini', 'Prakash', 'Mohan', 'Lakshmi', 'Arjun', 'Divya', 'Karan'];
const indianLastNames = ['Kumar', 'Sharma', 'Verma', 'Devi', 'Singh', 'Gupta', 'Yadav', 'Jain', 'Tiwari', 'Saxena', 'Pandey', 'Mishra', 'Agarwal', 'Mehta', 'Kapoor', 'Reddy', 'Patel', 'Nair', 'Malhotra', 'Bansal', 'Dubey', 'Joshi', 'Sinha', 'Chauhan', 'Thakur'];

const areasList = ['Lawrence Road', 'Rohini', 'Dwarka', 'Saket', 'Janakpuri', 'Model Town', 'Civil Lines', 'Pitampura', 'Karol Bagh', 'Lajpat Nagar'];
const buildings = ['A', 'B', 'C', 'D', 'E', 'Tower 1', 'Tower 2', 'Block A', 'Block B', 'Wing A'];

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomTime(): string {
  const hours = Math.floor(Math.random() * 12) + 8;
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function generatePhone(): string {
  return `+91-98${Math.floor(10000000 + Math.random() * 90000000)}`;
}

function generateUnit(): string {
  const building = buildings[Math.floor(Math.random() * buildings.length)];
  const floor = Math.floor(Math.random() * 15) + 1;
  const unit = Math.floor(Math.random() * 10) + 1;
  return `${building}-${floor}${unit.toString().padStart(2, '0')}`;
}

// Generate 500 clients
export const extendedClients: ExtendedClient[] = Array.from({ length: 500 }, (_, i) => {
  const firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
  const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];
  const totalAmount = Math.floor(Math.random() * 45000) + 5000;
  const paidAmount = Math.floor(Math.random() * totalAmount);
  
  return {
    id: `client-${i + 1}`,
    clientId: `CL${(1000 + i + 1).toString()}`,
    name: `${firstName} ${lastName}`,
    unit: generateUnit(),
    phone: generatePhone(),
    area: areasList[Math.floor(Math.random() * areasList.length)],
    status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
    lastContact: randomDate(new Date('2024-10-01'), new Date()),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    address: `${Math.floor(Math.random() * 500) + 1}, ${areasList[Math.floor(Math.random() * areasList.length)]}`,
    totalAmount,
    paidAmount,
  };
});

// Generate payment records
export const paymentRecords: PaymentRecord[] = Array.from({ length: 200 }, (_, i) => {
  const client = extendedClients[Math.floor(Math.random() * extendedClients.length)];
  const officers = ['Sandeep Sachdeva', 'Rajesh Kumar', 'Priya Sharma', 'Amit Verma', 'Sunita Devi'];
  
  return {
    id: `pay-${i + 1}`,
    date: randomDate(new Date('2024-10-01'), new Date()),
    clientName: client.name,
    unit: client.unit,
    amount: Math.floor(Math.random() * 45000) + 5000,
    status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'failed',
    officer: officers[Math.floor(Math.random() * officers.length)],
    receiptNo: `RCP${(10000 + i + 1).toString()}`,
    paymentMethod: ['Cash', 'UPI', 'Card', 'Bank Transfer'][Math.floor(Math.random() * 4)],
  };
});

// Generate unsubscriber records
export const unsubscriberRecords: UnsubscriberRecord[] = Array.from({ length: 30 }, (_, i) => {
  const reasons = ['Service not satisfactory', 'Relocated', 'Financial constraints', 'Found alternative service', 'Personal reasons', 'Not using the service'];
  
  return {
    id: `unsub-${i + 1}`,
    clientName: `${indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)]} ${indianLastNames[Math.floor(Math.random() * indianLastNames.length)]}`,
    unit: generateUnit(),
    phone: generatePhone(),
    unsubscribeDate: randomDate(new Date('2024-10-01'), new Date()),
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    area: areasList[Math.floor(Math.random() * areasList.length)],
  };
});

// Generate closed units
export const closedUnits: ClosedUnit[] = Array.from({ length: 5 }, (_, i) => {
  const reasons = ['Non-payment', 'Contract expired', 'Unit sold', 'Legal dispute', 'Mutual agreement'];
  
  return {
    id: `closed-${i + 1}`,
    unit: generateUnit(),
    clientName: `${indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)]} ${indianLastNames[Math.floor(Math.random() * indianLastNames.length)]}`,
    closureDate: randomDate(new Date('2024-10-01'), new Date()),
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    finalSettlement: ['completed', 'pending', 'disputed'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'disputed',
    area: areasList[Math.floor(Math.random() * areasList.length)],
  };
});

// Generate stamp records
export const stampRecords: StampRecord[] = Array.from({ length: 300 }, (_, i) => {
  const stampTypes = ['Revenue Stamp', 'Notary Stamp', 'Agreement Stamp', 'Receipt Stamp', 'Bond Stamp'];
  const officers = ['Sandeep Sachdeva', 'Rajesh Kumar', 'Priya Sharma', 'Amit Verma', 'Sunita Devi'];
  
  return {
    id: `stamp-${i + 1}`,
    date: randomDate(new Date('2024-10-01'), new Date()),
    clientName: `${indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)]} ${indianLastNames[Math.floor(Math.random() * indianLastNames.length)]}`,
    unit: generateUnit(),
    stampType: stampTypes[Math.floor(Math.random() * stampTypes.length)],
    amount: Math.floor(Math.random() * 5000) + 100,
    officer: officers[Math.floor(Math.random() * officers.length)],
  };
});

// Generate officers for live monitoring
export const officers: Officer[] = [
  { id: 'off-1', name: 'Sandeep Sachdeva', phone: '+91-9876543210', email: 'sandeep.s@topsqrt.com', area: 'Lawrence Road', status: 'active', currentLocation: 'Lawrence Road, Block A', lastUpdate: '2 min ago', visitsCompleted: 8 },
  { id: 'off-2', name: 'Rajesh Kumar', phone: '+91-9876543211', email: 'rajesh.k@topsqrt.com', area: 'Rohini', status: 'active', currentLocation: 'Rohini Sector 7', lastUpdate: '5 min ago', visitsCompleted: 12 },
  { id: 'off-3', name: 'Priya Sharma', phone: '+91-9876543212', email: 'priya.s@topsqrt.com', area: 'Dwarka', status: 'break', currentLocation: 'Dwarka Sector 10', lastUpdate: '15 min ago', visitsCompleted: 6 },
  { id: 'off-4', name: 'Amit Verma', phone: '+91-9876543213', email: 'amit.v@topsqrt.com', area: 'Saket', status: 'active', currentLocation: 'Saket District Centre', lastUpdate: '1 min ago', visitsCompleted: 10 },
  { id: 'off-5', name: 'Sunita Devi', phone: '+91-9876543214', email: 'sunita.d@topsqrt.com', area: 'Janakpuri', status: 'offline', currentLocation: 'Janakpuri Block C', lastUpdate: '1 hr ago', visitsCompleted: 4 },
  { id: 'off-6', name: 'Vikram Singh', phone: '+91-9876543215', email: 'vikram.s@topsqrt.com', area: 'Model Town', status: 'active', currentLocation: 'Model Town Part 2', lastUpdate: '3 min ago', visitsCompleted: 9 },
  { id: 'off-7', name: 'Neha Gupta', phone: '+91-9876543216', email: 'neha.g@topsqrt.com', area: 'Civil Lines', status: 'active', currentLocation: 'Civil Lines Main Market', lastUpdate: '7 min ago', visitsCompleted: 7 },
  { id: 'off-8', name: 'Suresh Yadav', phone: '+91-9876543217', email: 'suresh.y@topsqrt.com', area: 'Pitampura', status: 'break', currentLocation: 'Pitampura TV Tower', lastUpdate: '20 min ago', visitsCompleted: 5 },
  { id: 'off-9', name: 'Kavita Jain', phone: '+91-9876543218', email: 'kavita.j@topsqrt.com', area: 'Karol Bagh', status: 'active', currentLocation: 'Karol Bagh Metro', lastUpdate: '4 min ago', visitsCompleted: 11 },
  { id: 'off-10', name: 'Manoj Tiwari', phone: '+91-9876543219', email: 'manoj.t@topsqrt.com', area: 'Lajpat Nagar', status: 'active', currentLocation: 'Lajpat Nagar Central Market', lastUpdate: '6 min ago', visitsCompleted: 8 },
];

export const reportTypes = [
  { id: 'daily-activity', name: 'Daily Activity Report', icon: 'FileText' },
  { id: 'monthly-performance', name: 'Monthly Performance Report', icon: 'TrendingUp' },
  { id: 'officer-wise', name: 'Officer Wise Report', icon: 'Users' },
  { id: 'area-wise', name: 'Area Wise Report', icon: 'MapPin' },
  { id: 'payment-collection', name: 'Payment Collection Report', icon: 'DollarSign' },
  { id: 'visit-completion', name: 'Visit Completion Report', icon: 'CheckCircle' },
  { id: 'followup-pending', name: 'Follow-up Pending Report', icon: 'Clock' },
];

export const configTabs = [
  { id: 'general', name: 'General Settings', icon: 'Settings' },
  { id: 'users', name: 'User Management', icon: 'Users' },
  { id: 'areas', name: 'Area Management', icon: 'MapPin' },
  { id: 'remarks', name: 'Quick Remark Config', icon: 'MessageSquare' },
  { id: 'dashboard', name: 'Dashboard Settings', icon: 'LayoutDashboard' },
  { id: 'notifications', name: 'Notification Settings', icon: 'Bell' },
  { id: 'backup', name: 'Backup & Export', icon: 'Download' },
];
