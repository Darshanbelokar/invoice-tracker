export const invoices = [
  { id: 'INV-001', client: 'Acme Corp', email: 'billing@acme.com', amount: 4200, due: '2025-05-15', status: 'paid', issued: '2025-04-15', items: 3 },
  { id: 'INV-002', client: 'Globex Inc', email: 'finance@globex.com', amount: 8750, due: '2025-05-20', status: 'pending', issued: '2025-04-20', items: 5 },
  { id: 'INV-003', client: 'Initech LLC', email: 'accounts@initech.com', amount: 1340, due: '2025-04-30', status: 'overdue', issued: '2025-03-30', items: 2 },
  { id: 'INV-004', client: 'Umbrella Co', email: 'billing@umbrella.com', amount: 15600, due: '2025-05-25', status: 'paid', issued: '2025-04-25', items: 8 },
  { id: 'INV-005', client: 'Stark Industries', email: 'finance@stark.com', amount: 32400, due: '2025-06-01', status: 'pending', issued: '2025-05-01', items: 12 },
  { id: 'INV-006', client: 'Wayne Enterprises', email: 'accounts@wayne.com', amount: 9800, due: '2025-04-28', status: 'overdue', issued: '2025-03-28', items: 4 },
  { id: 'INV-007', client: 'Oscorp Tech', email: 'billing@oscorp.com', amount: 5500, due: '2025-06-10', status: 'draft', issued: '2025-05-05', items: 3 },
  { id: 'INV-008', client: 'Cyberdyne Systems', email: 'finance@cyberdyne.com', amount: 22000, due: '2025-06-15', status: 'paid', issued: '2025-05-10', items: 6 },
];

export const clients = [
  { id: 'C001', name: 'Acme Corp', contact: 'John Smith', email: 'billing@acme.com', phone: '+1 555-0101', country: 'USA', totalInvoices: 12, totalPaid: 48200, status: 'active', avatar: 'AC' },
  { id: 'C002', name: 'Globex Inc', contact: 'Jane Doe', email: 'finance@globex.com', phone: '+1 555-0102', country: 'USA', totalInvoices: 8, totalPaid: 32100, status: 'active', avatar: 'GI' },
  { id: 'C003', name: 'Initech LLC', contact: 'Bill Lumbergh', email: 'accounts@initech.com', phone: '+1 555-0103', country: 'USA', totalInvoices: 5, totalPaid: 9800, status: 'inactive', avatar: 'IL' },
  { id: 'C004', name: 'Umbrella Co', contact: 'Alice Wesker', email: 'billing@umbrella.com', phone: '+44 555-0104', country: 'UK', totalInvoices: 15, totalPaid: 89500, status: 'active', avatar: 'UC' },
  { id: 'C005', name: 'Stark Industries', contact: 'Pepper Potts', email: 'finance@stark.com', phone: '+1 555-0105', country: 'USA', totalInvoices: 20, totalPaid: 241000, status: 'active', avatar: 'SI' },
  { id: 'C006', name: 'Wayne Enterprises', contact: 'Alfred Pennyworth', email: 'accounts@wayne.com', phone: '+1 555-0106', country: 'USA', totalInvoices: 9, totalPaid: 65000, status: 'active', avatar: 'WE' },
];

export const payments = [
  { id: 'PAY-001', invoice: 'INV-001', client: 'Acme Corp', amount: 4200, date: '2025-05-14', method: 'Bank Transfer', status: 'completed' },
  { id: 'PAY-002', invoice: 'INV-004', client: 'Umbrella Co', amount: 15600, date: '2025-05-13', method: 'Credit Card', status: 'completed' },
  { id: 'PAY-003', invoice: 'INV-008', client: 'Cyberdyne Systems', amount: 22000, date: '2025-05-12', method: 'Wire Transfer', status: 'completed' },
  { id: 'PAY-004', invoice: 'INV-002', client: 'Globex Inc', amount: 8750, date: '2025-05-10', method: 'PayPal', status: 'pending' },
  { id: 'PAY-005', invoice: 'INV-005', client: 'Stark Industries', amount: 32400, date: '2025-05-08', method: 'Bank Transfer', status: 'pending' },
];

export const revenueData = [
  { month: 'Jan', revenue: 12400, target: 15000 },
  { month: 'Feb', revenue: 18200, target: 15000 },
  { month: 'Mar', revenue: 14800, target: 18000 },
  { month: 'Apr', revenue: 22600, target: 18000 },
  { month: 'May', revenue: 31800, target: 25000 },
  { month: 'Jun', revenue: 28400, target: 25000 },
  { month: 'Jul', revenue: 35200, target: 30000 },
  { month: 'Aug', revenue: 29800, target: 30000 },
  { month: 'Sep', revenue: 38600, target: 35000 },
  { month: 'Oct', revenue: 42100, target: 35000 },
  { month: 'Nov', revenue: 45800, target: 40000 },
  { month: 'Dec', revenue: 52400, target: 40000 },
];

export const activities = [
  { id: 1, type: 'invoice_sent', message: 'Invoice INV-005 sent to Stark Industries', time: '2 hours ago', icon: 'send' },
  { id: 2, type: 'payment', message: 'Payment of ₹22,000 received from Cyberdyne Systems', time: '5 hours ago', icon: 'payment' },
  { id: 3, type: 'overdue', message: 'Invoice INV-006 is now overdue', time: '1 day ago', icon: 'alert' },
  { id: 4, type: 'client', message: 'New client Oscorp Tech added', time: '2 days ago', icon: 'user' },
  { id: 5, type: 'invoice_sent', message: 'Invoice INV-004 sent to Umbrella Co', time: '3 days ago', icon: 'send' },
];

export const stats = {
  totalRevenue: 385200,
  paidInvoices: 24,
  pendingInvoices: 8,
  overdueInvoices: 3,
  totalClients: 6,
  totalInvoices: 35,
  pendingAmount: 46690,
  revenueGrowth: 18.4,
};
