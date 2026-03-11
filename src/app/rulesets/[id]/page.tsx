
"use client";

import React, { useMemo } from "react";
import { 
  ArrowLeft, 
  Settings2, 
  Table as TableIcon,
  Search,
  Download,
  AlertTriangle,
  Activity,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { RULESETS } from "@/lib/mock-data";

export default function SourceTablesPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

  const policy = useMemo(() => {
    if (!id) return null;
    return RULESETS.find(r => r.id === id);
  }, [id]);

  if (!policy) return <div className="p-8 text-center text-slate-500">Archive Source not found.</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/rulesets">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">Source Tables: {policy.name}</h1>
            <p className="text-sm text-muted-foreground">Monitor table health and configure specific archival rules for this source.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="font-bold">
          <Download className="h-4 w-4 mr-2" /> Export Stats
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-headline">Tables in Source</CardTitle>
                <CardDescription>Review performance metrics and configure archival rules.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Filter tables..." className="pl-9 h-9 bg-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px] font-bold py-4 px-6 text-slate-600">Table Name</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600">Missing Indexes</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600">Deadlocks</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600">Slow Queries</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600">Table Size</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policy.tables.map((tableName, idx) => (
                  <TableRow key={tableName} className="hover:bg-slate-50/30 group">
                    <TableCell className="px-6 py-4">
                      <Link href={`/rulesets/${policy.id}/tables/${tableName}`} className="flex items-center gap-3 hover:opacity-80 transition-all">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <TableIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-primary group-hover:underline">{tableName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Click for analytics</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {idx % 2 === 0 ? (
                          <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 font-bold text-[10px] px-2">
                            <AlertTriangle className="h-3 w-3 mr-1" /> 2 Issues
                          </Badge>
                        ) : (
                          <span className="text-slate-300 font-medium text-xs">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs">
                        <Activity className="h-3.5 w-3.5 text-slate-400" />
                        {idx * 3 + 2}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs">
                        <Zap className="h-3.5 w-3.5 text-orange-400" />
                        {idx * 12 + 5}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-slate-600">{idx === 0 ? "245.8 GB" : idx === 1 ? "18.2 GB" : "112.5 GB"}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-bold h-9 shadow-sm">
                        <Link href={`/rulesets/${policy.id}/configure?table=${tableName}`}>
                          <Settings2 className="h-4 w-4 mr-2" /> Configure Query
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
