export interface Client {
  id: string;
  name: string;
  unit: string;
  phone: string;
  amount: number;
  area: string;
}

export interface DashboardBoxData {
  id: string;
  label: string;
  category: 'payment' | 'trial' | 'gst' | 'complaint' | 'unsubscriber' | 'bill';
  type: 'visit' | 'call' | 'bill';
  count: number | null;
  showTotal?: boolean;
  showView?: boolean;
}

export const locations = [
  "Lawrence Road",
  "Model Town",
  "Civil Lines",
  "Sadar Bazar",
  "Subhash Nagar",
];

export const areas = [
  "Zone A",
  "Zone B",
  "Zone C",
  "Zone D",
];

export const users = [
  { name: "Sandeep Sachdeva", email: "sandeep.s@topsqrt.com", role: "Field Officer" },
  { name: "Rajesh Kumar", email: "rajesh.k@topsqrt.com", role: "Field Officer" },
  { name: "Priya Sharma", email: "priya.s@topsqrt.com", role: "Admin" },
];

export const mockClients: Client[] = [
  { id: "1", name: "Rajesh Kumar", unit: "A-101", phone: "9876543210", amount: 15000, area: "Zone A" },
  { id: "2", name: "Priya Sharma", unit: "B-205", phone: "9876543211", amount: 8500, area: "Zone A" },
  { id: "3", name: "Amit Verma", unit: "C-302", phone: "9876543212", amount: 12000, area: "Zone B" },
  { id: "4", name: "Sunita Devi", unit: "A-405", phone: "9876543213", amount: 5500, area: "Zone B" },
  { id: "5", name: "Vikram Singh", unit: "D-102", phone: "9876543214", amount: 22000, area: "Zone C" },
  { id: "6", name: "Neha Gupta", unit: "B-301", phone: "9876543215", amount: 9800, area: "Zone C" },
  { id: "7", name: "Suresh Yadav", unit: "A-204", phone: "9876543216", amount: 18500, area: "Zone D" },
  { id: "8", name: "Kavita Jain", unit: "C-105", phone: "9876543217", amount: 7200, area: "Zone D" },
  { id: "9", name: "Manoj Tiwari", unit: "D-403", phone: "9876543218", amount: 14000, area: "Zone A" },
  { id: "10", name: "Anita Saxena", unit: "B-102", phone: "9876543219", amount: 11500, area: "Zone B" },
  { id: "11", name: "Deepak Pandey", unit: "A-305", phone: "9876543220", amount: 16500, area: "Zone C" },
  { id: "12", name: "Rekha Mishra", unit: "C-201", phone: "9876543221", amount: 9000, area: "Zone D" },
  { id: "13", name: "Ashok Sharma", unit: "D-304", phone: "9876543222", amount: 20000, area: "Zone A" },
  { id: "14", name: "Pooja Agarwal", unit: "B-404", phone: "9876543223", amount: 6800, area: "Zone B" },
  { id: "15", name: "Rahul Mehta", unit: "A-103", phone: "9876543224", amount: 13500, area: "Zone C" },
  { id: "16", name: "Shweta Singh", unit: "C-402", phone: "9876543225", amount: 8000, area: "Zone D" },
  { id: "17", name: "Nitin Kapoor", unit: "D-201", phone: "9876543226", amount: 25000, area: "Zone A" },
  { id: "18", name: "Meera Reddy", unit: "B-103", phone: "9876543227", amount: 10500, area: "Zone B" },
  { id: "19", name: "Sanjay Patel", unit: "A-402", phone: "9876543228", amount: 17500, area: "Zone C" },
  { id: "20", name: "Geeta Nair", unit: "C-304", phone: "9876543229", amount: 7500, area: "Zone D" },
  { id: "21", name: "Vivek Malhotra", unit: "D-105", phone: "9876543230", amount: 19000, area: "Zone A" },
  { id: "22", name: "Ritu Bansal", unit: "B-202", phone: "9876543231", amount: 12500, area: "Zone B" },
  { id: "23", name: "Arun Dubey", unit: "A-301", phone: "9876543232", amount: 21000, area: "Zone C" },
  { id: "24", name: "Shalini Joshi", unit: "C-103", phone: "9876543233", amount: 6500, area: "Zone D" },
  { id: "25", name: "Prakash Sinha", unit: "D-402", phone: "9876543234", amount: 14500, area: "Zone A" },
];

export const remarkTags = [
  "Call Busy",
  "Not Reachable",
  "Payment Promised",
  "Rescheduled",
  "Completed",
  "Wrong Number",
  "Will Call Back",
];

export const resultOptions = [
  { value: "done", label: "Done" },
  { value: "follow-up", label: "Follow-Up" },
  { value: "pending", label: "Pending" },
];

export const initialOfficerBoxes: DashboardBoxData[] = [
  { id: "payment-visit", label: "Payment Visit", category: "payment", type: "visit", count: 6 },
  { id: "trial-visit", label: "Trial Visit", category: "trial", type: "visit", count: 4 },
  { id: "gst-visit-1", label: "GST Visit", category: "gst", type: "visit", count: 3 },
  { id: "gst-visit-2", label: "GST Visit", category: "gst", type: "visit", count: 3 },
  { id: "complaint-visit", label: "Complaint Visit", category: "complaint", type: "visit", count: 5 },
  { id: "unsubscriber-visit", label: "Unsubscriber Visit", category: "unsubscriber", type: "visit", count: null },
  { id: "payment-call", label: "Payment Call", category: "payment", type: "call", count: null, showTotal: true },
  { id: "trial-call", label: "Trial Call", category: "trial", type: "call", count: null, showView: true },
];

export const initialUserBoxes: DashboardBoxData[] = [
  { id: "user-payment-call", label: "Payment Call", category: "payment", type: "call", count: 3 },
  { id: "user-trial-call", label: "Trial Call", category: "trial", type: "call", count: 2 },
  { id: "user-gst-call", label: "GST Call", category: "gst", type: "call", count: null },
  { id: "user-complaint-call", label: "Complaint Call", category: "complaint", type: "call", count: 4 },
  { id: "user-unsubscriber-call", label: "Unsubscriber Call", category: "unsubscriber", type: "call", count: null },
  { id: "user-bill-making", label: "Bill Making", category: "bill", type: "bill", count: null },
  { id: "user-bill-distributing", label: "Bill Distributing", category: "bill", type: "bill", count: null, showView: true },
  { id: "user-bill-whatsapp", label: "Bill WhatsApp", category: "bill", type: "bill", count: 5 },
];

export const auditLogData = [
  { id: 1, user: "Sandeep Sachdeva", action: "Payment Visit", client: "A-101", remark: "Payment Promised", result: "Follow-Up", time: "10:30 AM" },
  { id: 2, user: "Rajesh Kumar", action: "Trial Call", client: "B-205", remark: "Completed", result: "Done", time: "11:15 AM" },
  { id: 3, user: "Sandeep Sachdeva", action: "GST Visit", client: "C-302", remark: "Rescheduled", result: "Pending", time: "12:00 PM" },
  { id: 4, user: "Priya Sharma", action: "Complaint Call", client: "D-102", remark: "Call Busy", result: "Follow-Up", time: "02:30 PM" },
  { id: 5, user: "Rajesh Kumar", action: "Bill WhatsApp", client: "A-405", remark: "Completed", result: "Done", time: "03:45 PM" },
];
