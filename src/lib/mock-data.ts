
import React from 'react';
import { Database, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

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
    name: "User Activity Archive (Production)",
    dataSource: "[Prod-DB].[Public].[User_Logs]",
    ruleSet: "User Log Retention Rules",
    sourceDb: "Xeon2",
    targetDb: "6X_CCI_Backup",
    schedule: "0 0 * * * (Daily)",
    frequency: "Weekly (Sunday 02:00 AM)",
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
    frequency: "Monthly",
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
    frequency: "Manual",
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
    frequency: "Daily",
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
    frequency: "Weekly",
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
  { id: "RUN-9821", date: "2024-10-18 02:00 AM", duration: "45m 12s", records: "125,400", status: "Success" },
  { id: "RUN-9755", date: "2024-10-11 02:00 AM", duration: "22m 05s", records: "12,000", status: "Failed" },
  { id: "RUN-9690", date: "2024-10-04 02:00 AM", duration: "55m 30s", records: "188,000", status: "Success" },
  { id: "RUN-9620", date: "2024-09-27 02:00 AM", duration: "40m 10s", records: "142,000", status: "Success" },
  { id: "RUN-9550", date: "2024-09-20 02:00 AM", duration: "50m 00s", records: "165,000", status: "Success" },
];

export const LIFETIME_PERFORMANCE = [
  { label: "Total Data Moved", value: "4.2 TB", icon: React.createElement(Database, { className: "h-5 w-5 text-blue-500" }) },
  { label: "Success Rate", value: "98.2%", icon: React.createElement(ShieldCheck, { className: "h-5 w-5 text-green-500" }) },
  { label: "Next Scheduled", value: "2d 12h", icon: React.createElement(Clock, { className: "h-5 w-5 text-slate-400" }) },
];

export const EXECUTION_LOGS = [
  "Connecting to source...",
  "Batch 1: 50,000 rows moved",
  "Batch 2: 75,400 rows moved",
  "Cleaning up temporary buffers...",
  "Success.",
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
