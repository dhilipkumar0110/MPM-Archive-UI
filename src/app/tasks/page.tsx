
"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  Play, 
  Eye, 
  MoreVertical,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ARCHIVAL_TASKS } from "@/lib/mock-data";

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredTasks = ARCHIVAL_TASKS.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Processing": return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "Paused": return <PauseCircle className="h-4 w-4 text-orange-500" />;
      case "Scheduled": return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "Processing": return <Badge variant="secondary" className="bg-blue-500 text-white animate-pulse">Processing</Badge>;
      case "Paused": return <Badge variant="outline" className="border-orange-500 text-orange-500">Paused</Badge>;
      case "Scheduled": return <Badge variant="outline" className="border-muted-foreground text-muted-foreground">Scheduled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Archive Tasks</h1>
          <p className="text-muted-foreground">Manage and monitor all automated data archival processes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            System Health
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Run All Tasks
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant={statusFilter === null ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "Processing" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setStatusFilter("Processing")}
            >
              Processing
            </Button>
            <Button 
              variant={statusFilter === "Active" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setStatusFilter("Active")}
            >
              Active
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" /> More Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("Paused")}>Paused</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Scheduled")}>Scheduled</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuItem>Last Run (Newest)</DropdownMenuItem>
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Progress (High-Low)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="shadow-sm border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                    Task Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Last Execution</TableHead>
                <TableHead className="min-w-[200px]">Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className="group hover:bg-accent/5 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{task.name}</span>
                        <span className="text-xs text-muted-foreground">{task.recordsCount} estimated records</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <span className="text-sm font-medium">{task.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal capitalize">{task.frequency}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{task.lastRun}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Success: {task.successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-medium">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link href={`/tasks/${task.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                          <Play className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                            <DropdownMenuItem>View Execution Logs</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate Task</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Archive Task</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No tasks found matching your filters.
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
