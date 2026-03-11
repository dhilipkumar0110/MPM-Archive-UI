
"use client";

import React, { useMemo, useState } from "react";
import { 
  ArrowLeft, 
  Settings2, 
  Table as TableIcon,
  Search,
  Download,
  AlertTriangle,
  Activity,
  Zap,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
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
import { cn } from "@/lib/utils";

type SortConfig = {
  key: 'name' | 'missingIndexes' | 'deadlocks' | 'slowQueries' | 'sizeBytes';
  direction: 'asc' | 'desc' | null;
};

interface TableMetric {
  name: string;
  missingIndexes: number;
  deadlocks: number;
  slowQueries: number;
  sizeLabel: string;
  sizeBytes: number;
}

export default function SourceTablesPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  const policy = useMemo(() => {
    if (!id) return null;
    return RULESETS.find(r => r.id === id);
  }, [id]);

  // Generate stable mock data for the tables in this policy
  const tableData = useMemo(() => {
    if (!policy) return [];
    return policy.tables.map((tableName, idx) => {
      // Create reproducible mock metrics based on table name hash/index
      const hash = tableName.length + idx;
      const missingIndexes = hash % 2 === 0 ? (hash % 5) + 1 : 0;
      const deadlocks = (hash * 3 + 2) % 20;
      const slowQueries = (hash * 12 + 5) % 100;
      
      const sizes = ["245.8 GB", "18.2 GB", "112.5 GB", "45.0 GB", "8.1 GB"];
      const sizeLabel = sizes[hash % sizes.length];
      const sizeBytes = parseFloat(sizeLabel.split(' ')[0]) * (sizeLabel.includes('GB') ? 1024 * 1024 * 1024 : 1024 * 1024);

      return {
        name: tableName,
        missingIndexes,
        deadlocks,
        slowQueries,
        sizeLabel,
        sizeBytes
      } as TableMetric;
    });
  }, [policy]);

  const filteredAndSortedTables = useMemo(() => {
    let result = [...tableData];

    // Filtering
    if (searchTerm) {
      result = result.filter(table => 
        table.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortConfig.direction && sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tableData, searchTerm, sortConfig]);

  const requestSort = (key: SortConfig['key']) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortConfig['key']) => {
    if (sortConfig.key !== key || !sortConfig.direction) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4 text-primary" /> : <ChevronDown className="ml-2 h-4 w-4 text-primary" />;
  };

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
                <Input 
                  placeholder="Filter tables..." 
                  className="pl-9 h-9 bg-white" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[300px] font-bold py-4 px-6 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Table Name {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold py-4 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => requestSort('missingIndexes')}
                  >
                    <div className="flex items-center">
                      Missing Indexes {getSortIcon('missingIndexes')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold py-4 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => requestSort('deadlocks')}
                  >
                    <div className="flex items-center">
                      Deadlocks {getSortIcon('deadlocks')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold py-4 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => requestSort('slowQueries')}
                  >
                    <div className="flex items-center">
                      Slow Queries {getSortIcon('slowQueries')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="font-bold py-4 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => requestSort('sizeBytes')}
                  >
                    <div className="flex items-center">
                      Table Size {getSortIcon('sizeBytes')}
                    </div>
                  </TableHead>
                  <TableHead className="font-bold py-4 text-slate-600 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTables.length > 0 ? (
                  filteredAndSortedTables.map((table) => (
                    <TableRow key={table.name} className="hover:bg-slate-50/30 group">
                      <TableCell className="px-6 py-4">
                        <Link href={`/rulesets/${policy.id}/tables/${table.name}`} className="flex items-center gap-3 hover:opacity-80 transition-all">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <TableIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-primary group-hover:underline">{table.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Click for analytics</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {table.missingIndexes > 0 ? (
                            <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 font-bold text-[10px] px-2">
                              <AlertTriangle className="h-3 w-3 mr-1" /> {table.missingIndexes} Issues
                            </Badge>
                          ) : (
                            <span className="text-slate-300 font-medium text-xs">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs">
                          <Activity className="h-3.5 w-3.5 text-slate-400" />
                          {table.deadlocks}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-orange-600 font-bold text-xs">
                          <Zap className="h-3.5 w-3.5 text-orange-400" />
                          {table.slowQueries}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-slate-600">{table.sizeLabel}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-bold h-9 shadow-sm">
                          <Link href={`/rulesets/${policy.id}/configure?table=${table.name}`}>
                            <Settings2 className="h-4 w-4 mr-2" /> Configure Query
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center text-slate-400 font-medium">
                      {searchTerm ? `No tables found matching "${searchTerm}"` : "No tables found in this source."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
