export const INVOICES = [
  { id: "INV-001", client: "Acme Corp",        email: "pay@acme.com",        issued: "10 Mar 2025", due: "25 Mar 2025", amount: 85000,  status: "paid" },
  { id: "INV-002", client: "Bright Solutions",  email: "ap@bright.io",        issued: "15 Mar 2025", due: "30 Mar 2025", amount: 42000,  status: "paid" },
  { id: "INV-003", client: "CloudBase Inc.",    email: "billing@cloudbase.io", issued: "20 Mar 2025", due: "04 Apr 2025", amount: 67500,  status: "pending" },
  { id: "INV-004", client: "DevStream Ltd",     email: "finance@devstream.io", issued: "22 Mar 2025", due: "05 Apr 2025", amount: 30000,  status: "overdue" },
  { id: "INV-005", client: "Acme Corp",         email: "pay@acme.com",        issued: "01 Apr 2025", due: "16 Apr 2025", amount: 95000,  status: "paid" },
  { id: "INV-006", client: "Nexus Digital",     email: "accounts@nexus.io",   issued: "05 Apr 2025", due: "20 Apr 2025", amount: 54000,  status: "pending" },
  { id: "INV-007", client: "Orion Analytics",   email: "pay@orion.ai",        issued: "10 Apr 2025", due: "25 Apr 2025", amount: 25000,  status: "overdue" },
  { id: "INV-008", client: "PeakFlow SaaS",     email: "billing@peak.co",     issued: "14 Apr 2025", due: "29 Apr 2025", amount: 112000, status: "draft" },
];

export const CLIENTS = [
  { id: 1, name: "Acme Corp",        email: "pay@acme.com",        phone: "+91 98201 10101", city: "Mumbai",    invoices: 3, total: 242000, initials: "AC", color: "brand" },
  { id: 2, name: "Bright Solutions", email: "ap@bright.io",        phone: "+91 88005 20202", city: "Pune",      invoices: 2, total: 86000,  initials: "BS", color: "emerald" },
  { id: 3, name: "CloudBase Inc.",   email: "billing@cloudbase.io",phone: "+91 77904 30303", city: "Bengaluru", invoices: 4, total: 175000, initials: "CB", color: "amber" },
  { id: 4, name: "DevStream Ltd",    email: "finance@devstream.io",phone: "+91 99103 40404", city: "Hyderabad", invoices: 2, total: 55000,  initials: "DS", color: "rose" },
  { id: 5, name: "Nexus Digital",    email: "accounts@nexus.io",   phone: "+91 70020 50505", city: "Chennai",   invoices: 3, total: 134000, initials: "ND", color: "brand" },
];

export const PAYMENTS = [
  { id: "PAY-001", invoice: "INV-001", client: "Acme Corp",       amount: 85000,  method: "Bank Transfer", date: "12 Mar 2025", status: "completed" },
  { id: "PAY-002", invoice: "INV-002", client: "Bright Solutions", amount: 42000,  method: "UPI",           date: "17 Mar 2025", status: "completed" },
  { id: "PAY-003", invoice: "INV-005", client: "Acme Corp",       amount: 95000,  method: "Bank Transfer", date: "03 Apr 2025", status: "completed" },
  { id: "PAY-004", invoice: "INV-003", client: "CloudBase Inc.",  amount: 67500,  method: "Credit Card",   date: "06 Apr 2025", status: "pending" },
  { id: "PAY-005", invoice: "INV-004", client: "DevStream Ltd",   amount: 30000,  method: "Cheque",        date: "07 Apr 2025", status: "failed" },
  { id: "PAY-006", invoice: "INV-006", client: "Nexus Digital",   amount: 54000,  method: "UPI",           date: "22 Apr 2025", status: "pending" },
];

export const REVENUE_TREND = [
  { month: "Nov", paid: 110000, pending: 32000 },
  { month: "Dec", paid: 148000, pending: 45000 },
  { month: "Jan", paid: 94000,  pending: 58000 },
  { month: "Feb", paid: 165000, pending: 38000 },
  { month: "Mar", paid: 142000, pending: 67500 },
  { month: "Apr", paid: 180000, pending: 84000 },
];