"use client";

import React, { useState } from "react";
import { 
  Database, 
  PlayCircle, 
  Settings2,
  CheckCircle2, 
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Activity,
  BarChart3,
  Filter,
  ShieldCheck,
  Circle,
  Table as TableIcon,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  ARCHIVAL_TASKS, 
  TASK_HISTORY, 
  LIFETIME_PERFORMANCE
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const ARCHIVE_STEPS = [
  { 
    name: "Pre-validation", 
    duration: "3s", 
    status: "Completed", 
    result: "No errors and warnings",
    color: "text-green-500",
    bgColor: "bg-green-500",
    badge: "bg-green-100 text-green-700"
  },
  { 
    name: "Archive Plan Construction", 
    duration: "9s", 
    status: "Completed", 
    result: "No errors and warnings",
    color: "text-green-500",
    bgColor: "bg-green-500",
    badge: "bg-green-100 text-green-700"
  },
  { 
    name: "Archive Plan Execution", 
    duration: "9m 10s", 
    status: "InProgress", 
    result: "Archiving in progress...",
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700"
  },
  { 
    name: "Database Space Reclamation", 
    duration: "0s", 
    status: "Pending", 
    result: "Pending database shrink",
    color: "text-slate-300",
    bgColor: "bg-slate-300",
    badge: "bg-slate-100 text-slate-500"
  },
];

export default function TaskDetailPage() {
  const { id } = useParams();
  const task = ARCHIVAL_TASKS.find(t => t.id === id) || ARCHIVAL_TASKS[0];
  const [expandedRun, setExpandedRun] = useState<string | null>("RUN-9821");

  const toggleRun = (runId: string) => {
    setExpandedRun(expandedRun === runId ? null : runId);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
        <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/tasks" className="hover:text-primary transition-colors">Archive Tasks</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{task.name}</span>
      </div>

      {/* Main Header Card */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 font-headline">{task.name}</h1>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold px-3">Active</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-slate-400" />
                  Source: <span className="font-mono text-slate-600">{task.dataSource.split('.')[0].replace('[', '').replace(']', '')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Frequency: <span className="text-slate-600">{task.frequency || 'Weekly (Sunday 02:00 AM)'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-primary hover:bg-primary/90 font-bold px-6 shadow-sm">
                <PlayCircle className="h-4 w-4 mr-2" /> Run Now
              </Button>
              <Button variant="outline" size="icon" className="text-slate-400">
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-100">
            <div className="p-5 border-r border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Successful Run</p>
              <p className="font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Oct 18, 2024 02:45 AM
              </p>
            </div>
            <div className="p-5 border-r border-slate-100 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Scheduled Run</p>
              <p className="font-bold text-slate-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Oct 25, 2024 02:00 AM
              </p>
            </div>
            <div className="p-5 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Duration</p>
              <p className="font-bold text-slate-700">42m 15s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Progress Section */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Current Progress: RUN-9821</CardTitle>
                  <p className="text-xs text-slate-400">Status: In Progress</p>
                </div>
                <div className="text-4xl font-black text-primary font-headline">72%</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={72} className="h-2.5 bg-slate-100 [&>div]:bg-primary" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                  <p className="text-lg font-bold text-slate-800">45m 12s</p>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Rows Archived</p>
                  <p className="text-lg font-bold text-slate-800">125,400</p>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Errors</p>
                  <p className="text-lg font-bold text-slate-800">0</p>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tables Archived</p>
                  <p className="text-lg font-bold text-slate-800">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Tabs Area */}
          <div className="space-y-4">
            <Tabs defaultValue="runs-history" className="w-full">
              <div className="flex items-center justify-between border-b border-slate-200 mb-4">
                <TabsList className="bg-transparent h-auto p-0 gap-8">
                  <TabsTrigger value="runs-history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-3 font-bold text-slate-400 data-[state=active]:text-primary text-sm">
                    Runs History
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm" className="text-slate-400 text-xs font-bold uppercase">
                  <Filter className="h-3 w-3 mr-1.5" /> Filter
                </Button>
              </div>

              <TabsContent value="runs-history" className="mt-0">
                <Card className="shadow-sm border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Run ID</TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Start Time</TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Duration</TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4">Status</TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4 text-right">Rows</TableHead>
                        <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest py-4 text-right pr-6">Errors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TASK_HISTORY.map((run) => (
                        <React.Fragment key={run.id}>
                          <TableRow className="group hover:bg-slate-50/30 border-slate-100 cursor-pointer" onClick={() => toggleRun(run.id)}>
                            <TableCell className="py-4">
                              {expandedRun === run.id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                            </TableCell>
                            <TableCell className="font-bold text-primary text-xs tracking-tight py-4">{run.id}</TableCell>
                            <TableCell className="text-slate-600 font-medium text-xs py-4">{run.date}</TableCell>
                            <TableCell className="text-slate-600 font-medium text-xs py-4">{run.duration}</TableCell>
                            <TableCell className="py-4">
                              <Badge variant="outline" className={cn(
                                "font-bold text-[10px] px-2 py-0.5 rounded-full border-0",
                                run.status === 'Success' ? "bg-green-50 text-green-600" : 
                                run.status === 'Failed' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                              )}>
                                {run.status === 'Success' ? <CheckCircle2 className="h-3 w-3 mr-1 inline" /> : run.status === 'Failed' ? <XCircle className="h-3 w-3 mr-1 inline" /> : <Clock className="h-3 w-3 mr-1 inline" />}
                                {run.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold text-slate-700 text-xs py-4">{run.records}</TableCell>
                            <TableCell className={cn("text-right font-bold text-xs py-4 pr-6", run.status === 'Failed' ? "text-red-500" : "text-slate-400")}>
                              {run.status === 'Failed' ? '1' : '0'}
                            </TableCell>
                          </TableRow>
                          
                          {expandedRun === run.id && (
                            <TableRow className="bg-white border-t border-slate-100">
                              <TableCell colSpan={7} className="p-0">
                                <div className="p-6 bg-slate-50/40">
                                  {/* Section Header with Title and Link at far ends */}
                                  <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-sm font-bold text-slate-800">
                                      Step Execution Timeline
                                    </h3>
                                    <Link 
                                      href={`/tasks/${task.id}/runs/${run.id}/tables`}
                                      className="text-primary hover:text-primary/80 flex items-center gap-2 group transition-all"
                                    >
                                      <TableIcon className="h-4 w-4" />
                                      <div className="flex flex-col text-[9px] font-black uppercase leading-[1.1] tracking-tighter">
                                        <span>View Archived</span>
                                        <span>Tables</span>
                                      </div>
                                    </Link>
                                  </div>

                                  <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Step Execution Timeline Visualization */}
                                    <div className="flex-1 max-w-md">
                                      <div className="relative space-y-6">
                                        {ARCHIVE_STEPS.map((step, idx) => (
                                          <div key={idx} className="flex gap-4 relative">
                                            {/* Connector line */}
                                            {idx < ARCHIVE_STEPS.length - 1 && (
                                              <div className={cn(
                                                "absolute left-3.5 top-8 w-0.5 h-10",
                                                step.status === 'Completed' ? "bg-green-400" : "bg-slate-200"
                                              )} />
                                            )}
                                            
                                            <div className="z-10 bg-white rounded-full p-0.5 mt-0.5">
                                              {step.status === 'Completed' ? (
                                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                              ) : step.status === 'InProgress' ? (
                                                <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                              ) : (
                                                <Circle className="h-6 w-6 text-slate-200" />
                                              )}
                                            </div>
                                            
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2">
                                                <span className={cn("text-sm font-bold", step.status === 'Pending' ? "text-slate-400" : "text-slate-800")}>
                                                  {step.name}
                                                </span>
                                                <Badge className={cn("text-[8px] px-1.5 h-4 font-bold border-0 uppercase tracking-tighter", step.badge)}>
                                                  {step.status}
                                                </Badge>
                                              </div>
                                              <p className="text-xs text-slate-500 mt-0.5">Duration: {step.duration}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Detailed Step Table */}
                                    <div className="flex-[2]">
                                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <Table>
                                          <TableHeader className="bg-slate-50">
                                            <TableRow className="hover:bg-transparent">
                                              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3">Step Name</TableHead>
                                              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3">Elapsed Time</TableHead>
                                              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3">Status</TableHead>
                                              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3">Results</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {ARCHIVE_STEPS.map((step, idx) => (
                                              <TableRow key={idx} className="hover:bg-transparent border-slate-100 last:border-0">
                                                <TableCell className="text-xs font-bold text-slate-700 py-4">{step.name}</TableCell>
                                                <TableCell className="text-xs font-medium text-slate-600 py-4">{step.duration}</TableCell>
                                                <TableCell className="text-xs font-medium text-slate-600 py-4">{step.status}</TableCell>
                                                <TableCell className="py-4">
                                                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                    {step.status === 'Completed' ? (
                                                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                                    ) : step.status === 'InProgress' ? (
                                                      <div className="h-3.5 w-3.5 rounded-full border border-blue-500 border-t-transparent animate-spin" />
                                                    ) : (
                                                      <Clock className="h-3.5 w-3.5 text-slate-300" />
                                                    )}
                                                    {step.result}
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar area */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5" /> Lifetime Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {LIFETIME_PERFORMANCE.map((metric, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors shadow-sm">
                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    {metric.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                    <span className="text-lg font-bold text-slate-800">{metric.value}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats Summary Card */}
          <Card className="bg-primary/5 border-primary/10 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-primary text-sm">Engine Status: Verified</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">This task is currently monitored by the compliance engine and maintains 100% data integrity score.</p>
          </Card>
        </div>
      </div>

      {/* Footer Branding Area */}
      <div className="pt-10 mt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span>© 2026 Archiv Data Systems</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> System Secure</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-primary">Documentation</Link>
          <Link href="#" className="hover:text-primary">Support</Link>
          <span className="text-slate-300">v2.4.0-stable</span>
        </div>
      </div>
    </div>
  );
}
