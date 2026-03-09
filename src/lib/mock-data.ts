
export const METADATA_SUMMARY = [
  { 
    id: 1, 
    label: "Total Tasks Executed", 
    value: "1,482", 
    description: "Tasks processed in the selected period",
    footer: { success: 1464, failed: 18 },
    icon: "check-circle"
  },
  { 
    id: 2, 
    label: "Avg. Execution Time", 
    value: "7m 49s", 
    description: "Mean duration per archival task",
    icon: "clock"
  },
  { 
    id: 3, 
    label: "Active Errors & Warnings", 
    value: "62", 
    description: "Unresolved issues across schedules",
    footer: { success: 0, failed: 48 },
    icon: "alert-triangle"
  },
];

export const ARCHIVAL_TASKS = [
  {
    id: "TSK-001",
    name: "User Log Retention - APAC",
    dataSource: "[Prod-DB].[Public].[User_Logs]",
    ruleSet: "User Log Retention Rules",
    sourceDb: "Xeon2",
    targetDb: "6X_CCI_Backup",
    schedule: "0 0 * * * (Daily)",
    lastRunStart: "05/20 00:00",
    lastRunEnd: "05/20 02:45",
    modifiedOn: "02-24-2026",
    startedOn: "02-24-2026 17:15:30",
    duration: "2h 45m",
    status: "InProgress",
    issues: 2,
    progress: 100,
    progressLabel: "Verified"
  },
  {
    id: "TSK-002",
    name: "Transactional Purge 2023",
    dataSource: "[Azure-Blob].[Finance].[Tx_Recs]",
    ruleSet: "Financial Cleanup rules",
    sourceDb: "ECD Datasource",
    targetDb: "EPDB-6.9",
    schedule: "0 2 1 * * (Monthly)",
    lastRunStart: "05/01 02:00",
    lastRunEnd: "05/01 14:30",
    modifiedOn: "12-09-2025",
    startedOn: "12-09-2025 03:54:00",
    duration: "12h 30m",
    status: "Paused",
    issues: 0,
    progress: 45,
    progressLabel: "Moving..."
  },
  {
    id: "TSK-003",
    name: "GDPR Compliance Wipe",
    dataSource: "[Local-HDFS].[Legacy].[Customer]",
    ruleSet: "GDPR Wipe Ruleset",
    sourceDb: "Local-HDFS",
    targetDb: "Archive-Compliance",
    schedule: "Manual Run",
    lastRunStart: "05/21 10:15",
    lastRunEnd: "Running...",
    modifiedOn: "05-21-2026",
    startedOn: "05-21-2026 10:15:00",
    duration: "1h 12m",
    status: "InProgress",
    issues: 0,
    progress: 72,
    progressLabel: "Moving..."
  },
  {
    id: "TSK-004",
    name: "Email Archive v2",
    dataSource: "[Exchange-V3].[Inbox].[Archive_]",
    ruleSet: "Exchange Retention",
    sourceDb: "Exchange-V3",
    targetDb: "Cold-S3",
    schedule: "0 */6 * * * (6h)",
    lastRunStart: "05/20 18:00",
    lastRunEnd: "05/20 19:15",
    modifiedOn: "01-15-2026",
    startedOn: "01-15-2026 18:00:00",
    duration: "1h 15m",
    status: "Archived",
    issues: 48,
    warnings: 12,
    progress: 15,
    progressLabel: "Moving..."
  },
  {
    id: "TSK-005",
    name: "Media Assets Backup",
    dataSource: "[S3-Bucket].[Creative].[Assets_L]",
    ruleSet: "Media Archival Policy",
    sourceDb: "S3-Bucket",
    targetDb: "Glacier-Deep",
    schedule: "0 1 * * 0 (Weekly)",
    lastRunStart: "05/19 01:00",
    lastRunEnd: "05/19 08:45",
    modifiedOn: "03-10-2026",
    startedOn: "03-10-2026 01:00:00",
    duration: "7h 45m",
    status: "Completed",
    issues: 5,
    progress: 100,
    progressLabel: "Verified"
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
