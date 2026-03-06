
"use client";

import React from "react";
import { 
  Activity, 
  Database, 
  Clock, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight, 
  Play, 
  Eye 
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
import { METADATA_SUMMARY, ARCHIVAL_TASKS } from "@/lib/mock-data";

export default function DashboardPage() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "activity": return <Activity className="h-5 w-5 text-primary" />;
      case "database": return <Database className="h-5 w-5 text-primary" />;
      case "clock": return <Clock className="h-5 w-5 text-primary" />;
      default: return null;
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
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Archival Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your enterprise data archival lifecycle.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">Export Data</Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/rulesets/new">
              New Rule Set
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {METADATA_SUMMARY.map((item) => (
          <Card key={item.id} className="shadow-sm border-border/50 overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                {getIcon(item.icon)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{item.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {item.subValue.includes('+') ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={item.subValue.includes('+') ? "text-green-500" : "text-red-500"}>
                  {item.subValue.split(' ')[0]}
                </span>
                <span className="ml-1">{item.subValue.split(' ').slice(1).join(' ')}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle className="text-xl font-bold font-headline">Archival Task Details</CardTitle>
            <CardDescription>Scheduled and ongoing archival operations across your platform.</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50 rounded-t-lg">
              <TableRow>
                <TableHead className="font-semibold">Task Name</TableHead>
                <TableHead className="font-semibold text-center">Frequency</TableHead>
                <TableHead className="font-semibold">Last Execution</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Current Progress</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ARCHIVAL_TASKS.map((task) => (
                <TableRow key={task.id} className="hover:bg-accent/5 transition-colors cursor-pointer group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{task.name}</span>
                      <span className="text-xs text-muted-foreground">{task.recordsCount} estimated records</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-normal">{task.frequency}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{task.lastRun}</span>
                      <span className="text-xs text-muted-foreground">Success Rate: {task.successRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className="min-w-[150px]">
                    <div className="flex flex-col gap-1">
                      <Progress value={task.progress} className="h-2" />
                      <span className="text-[10px] text-muted-foreground self-end font-medium">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={`/tasks/${task.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
