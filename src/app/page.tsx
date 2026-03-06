
"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  RotateCw, 
  Calendar,
  AlertCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { METADATA_SUMMARY, ARCHIVAL_TASKS } from "@/lib/mock-data";

export default function DashboardPage() {
  const getSummaryIcon = (iconName: string) => {
    switch (iconName) {
      case "check-circle": return <CheckCircle2 className="h-5 w-5 text-muted-foreground" />;
      case "clock": return <Clock className="h-5 w-5 text-muted-foreground" />;
      case "alert-triangle": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Healthy": return <Badge variant="secondary" className="bg-slate-100 text-slate-800 font-bold px-3 py-1">Healthy</Badge>;
      case "Processing": return <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-bold px-3 py-1">Processing</Badge>;
      case "Paused": return <Badge variant="secondary" className="bg-slate-200 text-slate-600 font-bold px-3 py-1">Paused</Badge>;
      case "Critical": return <Badge variant="destructive" className="bg-red-600 text-white font-bold px-3 py-1">Critical</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-headline">Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitor and manage your data archival orchestration and rulesets.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md bg-white px-3 py-2 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400 mr-2" />
            <Select defaultValue="7days">
              <SelectTrigger className="border-0 p-0 h-auto focus:ring-0 w-[120px] shadow-none font-medium">
                <SelectValue placeholder="Last 7 Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="shadow-sm font-medium">
            <RotateCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {METADATA_SUMMARY.map((item) => (
          <Card key={item.id} className="shadow-sm border-slate-200 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">{item.label}</CardTitle>
                <div className="text-3xl font-bold font-headline text-slate-900">{item.value}</div>
              </div>
              <div className={`p-2 rounded-md ${item.icon === 'alert-triangle' ? 'bg-red-50' : 'bg-slate-50'}`}>
                {getSummaryIcon(item.icon)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">{item.description}</p>
              {item.footer && (
                <div className="flex items-center gap-4 border-t pt-4">
                  <div className="flex items-center text-sm font-medium text-slate-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                    {item.footer.success} successful
                  </div>
                  <div className="flex items-center text-sm font-medium text-red-500">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                    {item.footer.failed} failed
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Tasks Section Header */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900 font-headline">Active Tasks</h2>
          <div className="flex gap-2">
            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 font-bold px-3">14 Running Now</Badge>
            <Badge className="bg-red-50 text-red-500 hover:bg-red-100 border-0 font-bold px-3">2 Failed</Badge>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Filter by task name or data source..." 
            className="pl-10 border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] border-slate-200 bg-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" className="border-slate-200 bg-white">
          <Filter className="h-4 w-4 text-slate-600" />
        </Button>
      </div>

      {/* Main Task Table */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-600 py-4 px-6">Task Name</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Data Source</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Schedule</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Last Run Period</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Duration</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4">Issues</TableHead>
                <TableHead className="font-semibold text-slate-600 py-4 pr-6">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ARCHIVAL_TASKS.map((task) => (
                <TableRow key={task.id} className="hover:bg-slate-50/30 group">
                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{task.name}</span>
                      <span className="text-xs text-slate-400 font-medium uppercase mt-1">{task.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 font-mono text-xs">{task.dataSource}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-slate-600 text-xs">
                      <Zap className="h-3 w-3 mr-1.5 text-slate-400" />
                      {task.schedule}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-slate-600">
                      <span>{task.lastRunStart}</span>
                      <span className={`italic ${task.lastRunEnd === 'Running...' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {task.lastRunEnd}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-600 font-medium text-sm">{task.duration}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {task.issues > 0 ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-xs font-bold text-slate-700">{task.issues}</span>
                        </div>
                      ) : task.status === 'Critical' ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-slate-300" />
                          <span className="text-xs font-bold text-slate-700">{task.issues || 2}</span>
                        </div>
                      )}
                      {(task as any).warnings > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-bold text-slate-700">{(task as any).warnings}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 min-w-[160px]">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-800">{task.progress}%</span>
                        <span className="text-slate-400 flex items-center">
                          {task.progress === 100 && <ShieldCheck className="h-3 w-3 mr-1 text-blue-500" />}
                          {task.progressLabel}
                        </span>
                      </div>
                      <Progress 
                        value={task.progress} 
                        className={`h-2 ${task.progress === 100 ? 'bg-slate-100 [&>div]:bg-blue-600' : 'bg-slate-100 [&>div]:bg-blue-400'}`} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-slate-500 italic">Showing 5 of 24 active archival schedules</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white border-slate-200 font-medium text-slate-600">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-white border-slate-200 font-medium text-slate-600">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
