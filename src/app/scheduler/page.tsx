
"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Search, 
  Trash2, 
  Edit2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ARCHIVAL_TASKS } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

type Schedule = {
  id: string;
  taskId: string;
  taskName: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  startDate: string;
  endDate: string;
  status: "Active" | "Paused" | "Expired";
  nextRun: string;
  weeklyDay?: string;
  monthlyDay?: string;
};

const INITIAL_SCHEDULES: Schedule[] = [
  { 
    id: "SCH-001", 
    taskId: "TSK-001", 
    taskName: "User Activity Archive (Production)", 
    frequency: "Daily", 
    startDate: "2024-05-01", 
    endDate: "2025-05-01", 
    status: "Active", 
    nextRun: "Tomorrow, 02:00 AM" 
  },
  { 
    id: "SCH-002", 
    taskId: "TSK-002", 
    taskName: "Transactional Purge 2023", 
    frequency: "Monthly", 
    startDate: "2024-01-01", 
    endDate: "2024-12-31", 
    status: "Active", 
    nextRun: "June 1st, 2024",
    monthlyDay: "1"
  },
];

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SchedulerPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  
  // Form State
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyDay, setMonthlyDay] = useState("1");
  const [weeklyDay, setWeeklyDay] = useState("Monday");

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingScheduleId(null);
      setSelectedTaskId("");
      setFrequency("Daily");
      setStartDate("");
      setEndDate("");
      setMonthlyDay("1");
      setWeeklyDay("Monday");
    }
  }, [isDialogOpen]);

  const handleOpenEdit = (schedule: Schedule) => {
    setEditingScheduleId(schedule.id);
    setSelectedTaskId(schedule.taskId);
    setFrequency(schedule.frequency);
    setStartDate(schedule.startDate);
    setEndDate(schedule.endDate);
    if (schedule.weeklyDay) setWeeklyDay(schedule.weeklyDay);
    if (schedule.monthlyDay) setMonthlyDay(schedule.monthlyDay);
    setIsDialogOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!selectedTaskId || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please complete the schedule configuration.",
      });
      return;
    }

    const task = ARCHIVAL_TASKS.find(t => t.id === selectedTaskId);
    const nextRunText = frequency === "Daily" 
      ? "Tomorrow, 02:00 AM" 
      : frequency === "Weekly" 
        ? `Next ${weeklyDay}, 02:00 AM` 
        : `Day ${monthlyDay} of next month`;

    if (editingScheduleId) {
      // Update existing
      setSchedules(prev => prev.map(s => s.id === editingScheduleId ? {
        ...s,
        taskId: selectedTaskId,
        taskName: task?.name || s.taskName,
        frequency,
        startDate,
        endDate,
        nextRun: nextRunText,
        weeklyDay: frequency === "Weekly" ? weeklyDay : undefined,
        monthlyDay: frequency === "Monthly" ? monthlyDay : undefined,
      } : s));
      
      toast({
        title: "Schedule Updated",
        description: `Changes saved for ${task?.name || "the archive task"}.`,
      });
    } else {
      // Create new
      const newSchedule: Schedule = {
        id: `SCH-${Date.now()}`,
        taskId: selectedTaskId,
        taskName: task?.name || "Unknown Task",
        frequency,
        startDate,
        endDate,
        status: "Active",
        nextRun: nextRunText,
        weeklyDay: frequency === "Weekly" ? weeklyDay : undefined,
        monthlyDay: frequency === "Monthly" ? monthlyDay : undefined,
      };

      setSchedules([newSchedule, ...schedules]);
      toast({
        title: "Schedule Created",
        description: `New ${frequency} schedule added for ${newSchedule.taskName}.`,
      });
    }

    setIsDialogOpen(false);
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Schedule Removed",
      description: "The schedule has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2672DB] font-headline">Task Scheduler</h1>
          <p className="text-slate-500">Automate your archival tasks with flexible execution windows.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00D1FF] hover:bg-[#00B8E6] text-white font-bold px-6 shadow-sm border-0">
              <Plus className="h-4 w-4 mr-2" /> Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-headline text-[#2672DB]">
                {editingScheduleId ? "Edit Schedule" : "Configure Schedule"}
              </DialogTitle>
              <DialogDescription>
                Set the frequency and timeline for automated task execution.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Select Task</Label>
                <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an archive task" />
                  </SelectTrigger>
                  <SelectContent>
                    {ARCHIVAL_TASKS.map(task => (
                      <SelectItem key={task.id} value={task.id}>{task.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Frequency</Label>
                <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {frequency === "Weekly" && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                  <Label className="text-sm font-bold text-slate-700">Day of Week</Label>
                  <Select value={weeklyDay} onValueChange={setWeeklyDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {frequency === "Monthly" && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                  <Label className="text-sm font-bold text-slate-700">Day of Month</Label>
                  <Select value={monthlyDay} onValueChange={setMonthlyDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>Day {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSchedule} className="bg-[#2672DB] hover:bg-[#1E5FB3]">
                {editingScheduleId ? "Save Changes" : "Create Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold font-headline">Active Schedules</CardTitle>
          <CardDescription>All currently configured automation policies.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold py-4 px-6">Task Name</TableHead>
                <TableHead className="font-bold py-4">Frequency</TableHead>
                <TableHead className="font-bold py-4">Duration</TableHead>
                <TableHead className="font-bold py-4">Next Scheduled Run</TableHead>
                <TableHead className="font-bold py-4">Status</TableHead>
                <TableHead className="font-bold py-4 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((sch) => (
                <TableRow key={sch.id} className="hover:bg-slate-50/30">
                  <TableCell className="px-6 font-bold text-slate-800">{sch.taskName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-white border-slate-200">
                      {sch.frequency} {sch.weeklyDay && `(${sch.weeklyDay})`} {sch.monthlyDay && `(Day ${sch.monthlyDay})`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {sch.startDate} to {sch.endDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs font-medium text-slate-600">
                      <Clock className="h-3 w-3 mr-1.5 text-blue-500" />
                      {sch.nextRun}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-bold text-slate-700">{sch.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-500"
                        onClick={() => handleOpenEdit(sch)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                        onClick={() => deleteSchedule(sch.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                    No schedules found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
