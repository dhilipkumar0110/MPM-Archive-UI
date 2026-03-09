
"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  FileText,
  Database,
  Calendar,
  Clock,
  LayoutGrid,
  List,
  X,
  ChevronDown,
  Eye
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ARCHIVAL_TASKS, RULESETS } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const TABS = ["New", "Scheduled", "InProgress", "Completed", "Archived"];

export default function TasksPage() {
  const [tasks, setTasks] = useState(ARCHIVAL_TASKS);
  const [activeTab, setActiveTab] = useState("InProgress");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedRuleSet, setSelectedRuleSet] = useState("");
  const [sourceDb, setSourceDb] = useState("");
  const [targetDb, setTargetDb] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesTab = activeTab === "All" || task.status === activeTab;
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.ruleSet?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [tasks, activeTab, searchTerm]);

  const handleCreateTask = () => {
    if (!newTaskName || !selectedRuleSet || !sourceDb || !targetDb) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all fields to create a task.",
      });
      return;
    }

    const newTask = {
      id: `TSK-${Date.now()}`,
      name: newTaskName,
      ruleSet: selectedRuleSet,
      sourceDb: sourceDb,
      targetDb: targetDb,
      status: "New",
      modifiedOn: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      startedOn: "Pending...",
      progress: 0,
      issues: 0,
      dataSource: "Unknown",
      schedule: "Manual",
      lastRunStart: "N/A",
      lastRunEnd: "N/A",
      duration: "0m",
      progressLabel: "Pending"
    };

    setTasks([newTask as any, ...tasks]);
    setIsDialogOpen(false);
    setNewTaskName("");
    setSelectedRuleSet("");
    setSourceDb("");
    setTargetDb("");

    toast({
      title: "Task Created",
      description: `"${newTaskName}" has been successfully added.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (status) {
      case "InProgress":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-100 font-bold px-2 py-0.5 text-[10px] tracking-wider border-0">{statusUpper}</Badge>;
      case "Paused":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100 font-bold px-2 py-0.5 text-[10px] tracking-wider border-0">{statusUpper}</Badge>;
      case "Completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-600 hover:bg-green-100 font-bold px-2 py-0.5 text-[10px] tracking-wider border-0">{statusUpper}</Badge>;
      default:
        return <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100 font-bold px-2 py-0.5 text-[10px] tracking-wider border-0">{statusUpper}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#2672DB] font-headline">Scrub Tasks</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00D1FF] hover:bg-[#00B8E6] text-white font-bold px-6 shadow-sm border-0">
              <Plus className="h-4 w-4 mr-2" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-headline text-[#2672DB]">Create New Scrub Task</DialogTitle>
              <DialogDescription>
                Define the parameters for your data archival or scrub process.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700">Task Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Monthly Finance Scrub"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Rule Set</Label>
                <Select value={selectedRuleSet} onValueChange={setSelectedRuleSet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ruleset" />
                  </SelectTrigger>
                  <SelectContent>
                    {RULESETS.map(rs => (
                      <SelectItem key={rs.id} value={rs.name}>{rs.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Source Database</Label>
                  <Select value={sourceDb} onValueChange={setSourceDb}>
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Xeon2">Xeon2</SelectItem>
                      <SelectItem value="ECD Datasource">ECD Datasource</SelectItem>
                      <SelectItem value="Prod-DB">Prod-DB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-slate-700">Target Database</Label>
                  <Select value={targetDb} onValueChange={setTargetDb}>
                    <SelectTrigger>
                      <SelectValue placeholder="Target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6X_CCI_Backup">6X_CCI_Backup</SelectItem>
                      <SelectItem value="EPDB-6.9">EPDB-6.9</SelectItem>
                      <SelectItem value="Archive-Cold">Archive-Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTask} className="bg-[#2672DB] hover:bg-[#1E5FB3]">Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-100 pb-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 text-sm font-medium transition-all relative whitespace-nowrap",
              activeTab === tab 
                ? "text-[#2672DB] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2672DB]" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search scrub tasks..." 
            className="pl-10 border-slate-200 bg-slate-50/30 focus:bg-white transition-all h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center px-3 py-1.5 border rounded-md bg-white text-xs font-medium text-slate-600">
            All <X className="h-3 w-3 ml-2 text-slate-400 cursor-pointer" />
          </div>
          
          <Select defaultValue="created">
            <SelectTrigger className="w-[180px] h-10 border-slate-200">
              <span className="text-slate-400 mr-2">Sort by:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden h-10">
            <Button variant="ghost" size="icon" className="h-full rounded-none border-r bg-slate-50">
              <Filter className="h-4 w-4 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-full rounded-none border-r bg-[#2672DB] text-white">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-full rounded-none bg-white">
              <List className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="shadow-sm border-slate-100 flex flex-col hover:shadow-md transition-all group relative overflow-hidden">
              <CardHeader className="pb-4 space-y-0 relative">
                <div className="flex justify-between items-start pr-8">
                  <CardTitle className="text-[15px] font-bold text-[#2672DB] leading-tight group-hover:underline cursor-pointer">
                    {task.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 pb-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <FileText className="h-4 w-4 text-[#00D1FF]" />
                  <span className="text-xs font-medium">{task.ruleSet || "Data consistency rule set"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Database className="h-4 w-4 text-[#00D1FF]" />
                  <span className="text-xs font-medium">{task.sourceDb || "Xeon2"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Database className="h-4 w-4 text-[#00D1FF]" />
                  <span className="text-xs font-medium">{task.targetDb || "6X_CCI_Backup"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Calendar className="h-4 w-4 text-[#00D1FF]" />
                  <span className="text-xs font-medium">Modified On {task.modifiedOn || "02-24-2026"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Clock className="h-4 w-4 text-[#00D1FF]" />
                  <span className="text-xs font-medium">
                    {task.status === "Paused" ? "Paused On " : "Started On "} 
                    {task.startedOn || "02-24-2026 17:15:30"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex flex-col gap-2">
                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1 border-[#2672DB] text-[#2672DB] hover:bg-blue-50 font-medium h-9 text-xs">
                    {task.status === "Paused" ? "Resume" : "Pause"}
                  </Button>
                  <Button variant="outline" className="flex-1 border-[#2672DB] text-[#2672DB] hover:bg-blue-50 font-medium h-9 text-xs">
                    Cancel
                  </Button>
                </div>
                <Button variant="ghost" className="w-full text-[#2672DB] hover:text-[#1E5FB3] font-bold text-xs h-9" asChild>
                  <Link href={`/tasks/${task.id}`}>
                    <Eye className="h-3 w-3 mr-2" /> View Progress
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-3">
            <div className="flex justify-center">
              <Search className="h-10 w-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">No scrub tasks found matching your criteria.</p>
            <Button variant="link" onClick={() => {setActiveTab("All"); setSearchTerm("");}} className="text-[#2672DB]">Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
