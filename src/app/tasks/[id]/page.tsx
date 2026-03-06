
"use client";

import React from "react";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  Download,
  Settings,
  History
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ARCHIVAL_TASKS, TASK_HISTORY } from "@/lib/mock-data";

export default function TaskDetailPage() {
  const { id } = useParams();
  const task = ARCHIVAL_TASKS.find(t => t.id === id) || ARCHIVAL_TASKS[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{task.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{task.frequency}</Badge>
            <span className="text-sm text-muted-foreground">ID: {task.id}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Edit Rule
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <PlayCircle className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Status Card */}
        <Card className="md:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold font-headline">Live Progress Monitor</CardTitle>
              <Badge className="bg-blue-500">{task.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Archiving Batch #4 of 12</span>
                <span className="font-semibold text-primary">{task.progress}% Complete</span>
              </div>
              <Progress value={task.progress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Scanned</span>
                <p className="font-bold">2.4M</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Processed</span>
                <p className="font-bold text-primary">1.5M</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Failed</span>
                <p className="font-bold text-destructive">12</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Time Elapsed</span>
                <p className="font-bold">12m 4s</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Latest Logs
              </h4>
              <div className="bg-background border border-border/50 rounded-lg p-3 text-xs font-mono space-y-1 overflow-auto max-h-[150px]">
                <p className="text-muted-foreground text-[10px]">[02:00:01] Initialization started...</p>
                <p className="text-green-500 text-[10px]">[02:00:05] Connection established with ArchiveDB-Main.</p>
                <p className="text-muted-foreground text-[10px]">[02:01:12] Processing Batch #1 (100k rows)...</p>
                <p className="text-muted-foreground text-[10px]">[02:02:45] Batch #1 successfully archived.</p>
                <p className="text-muted-foreground text-[10px]">[02:03:00] Processing Batch #2 (100k rows)...</p>
                <p className="text-orange-400 text-[10px]">[02:04:10] Warning: Network latency spike detected (400ms).</p>
                <p className="text-muted-foreground text-[10px]">[02:05:22] Batch #2 successfully archived.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Column */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Metadata Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Next Scheduled Run</span>
                  <span className="text-sm font-medium">Tomorrow, 02:00 AM</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Average Duration</span>
                  <span className="text-sm font-medium">14 mins 30 secs</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Target Storage</span>
                  <span className="text-sm font-medium">S3 Cold-Storage-Tier1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50 bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wider">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start text-xs font-medium h-8">
                <Download className="h-3 w-3 mr-2" /> Download Latest Report
              </Button>
              <Button variant="ghost" className="justify-start text-xs font-medium h-8 text-destructive hover:text-destructive">
                <PlayCircle className="h-3 w-3 mr-2" /> Force Stop Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Grid */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold font-headline">Execution History</CardTitle>
          <CardDescription>Comprehensive log of all past executions for this task.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Logs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TASK_HISTORY.map((run) => (
                <TableRow key={run.id} className="hover:bg-accent/5">
                  <TableCell className="font-medium text-xs text-muted-foreground">#{run.id}</TableCell>
                  <TableCell className="font-semibold">{run.date}</TableCell>
                  <TableCell>{run.duration}</TableCell>
                  <TableCell>{run.records}</TableCell>
                  <TableCell>
                    {run.status === "Success" ? (
                      <div className="flex items-center gap-1 text-green-500 text-xs font-semibold">
                        <CheckCircle2 className="h-3 w-3" /> {run.status}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-500 text-xs font-semibold">
                        <AlertCircle className="h-3 w-3" /> {run.status}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-xs underline decoration-primary">
                      View details
                    </Button>
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
