
export const METADATA_SUMMARY = [
  { id: 1, label: "Total Tasks", value: "142", subValue: "+12.5% vs last month", icon: "activity" },
  { id: 2, label: "Data Archived", value: "4.8 TB", subValue: "2.1M Records this week", icon: "database" },
  { id: 3, label: "Avg. Run Time", value: "18m 45s", subValue: "-2m 10s from baseline", icon: "clock" },
];

export const ARCHIVAL_TASKS = [
  {
    id: "task-1",
    name: "Customer Activity Log Purge",
    status: "Active",
    frequency: "Daily",
    lastRun: "2024-05-15 02:00 AM",
    progress: 100,
    recordsCount: "1.2M",
    successRate: 99.8,
  },
  {
    id: "task-2",
    name: "Legacy Invoice Archival",
    status: "Processing",
    frequency: "Daily",
    lastRun: "Running...",
    progress: 65,
    recordsCount: "450K",
    successRate: 100,
  },
  {
    id: "task-3",
    name: "Temporary Session Cleanup",
    status: "Paused",
    frequency: "Daily",
    lastRun: "2024-05-14 01:30 AM",
    progress: 0,
    recordsCount: "25k",
    successRate: 85.2,
  },
  {
    id: "task-4",
    name: "Global User Metadata Archive",
    status: "Scheduled",
    frequency: "Daily",
    lastRun: "Next: 2024-05-16 00:00 AM",
    progress: 0,
    recordsCount: "3.5M",
    successRate: 99.9,
  }
];

export const TASK_HISTORY = [
  { id: "run-101", date: "2024-05-15 02:00 AM", duration: "14m 2s", records: "1.21M", status: "Success" },
  { id: "run-100", date: "2024-05-14 02:00 AM", duration: "15m 10s", records: "1.19M", status: "Success" },
  { id: "run-099", date: "2024-05-13 02:05 AM", duration: "16m 45s", records: "1.25M", status: "Warning" },
  { id: "run-098", date: "2024-05-12 02:01 AM", duration: "13m 50s", records: "1.10M", status: "Success" },
];

export const RULESETS = [
  { id: "rs-1", name: "Financial Data 2023", tables: ["invoices", "payments", "ledgers"], description: "Archives all financial records older than 1 year." },
  { id: "rs-2", name: "User Logs Purge", tables: ["audit_logs", "session_history"], description: "Purge logs older than 90 days." },
  { id: "rs-3", name: "Marketing Campaigns", tables: ["leads", "email_events"], description: "Move inactive lead data to cold storage." },
];

export const TABLE_SCHEMA = [
  { name: "id", type: "INT", description: "Primary Key" },
  { name: "status", type: "VARCHAR", description: "Current state of the record" },
  { name: "created_at", type: "DATE", description: "Timestamp of record creation" },
  { name: "amount", type: "DECIMAL", description: "Financial value associated" },
  { name: "customer_id", type: "INT", description: "Foreign key to customers" },
  { name: "is_active", type: "BOOLEAN", description: "Flag for active status" },
];
