
"use client";

import React, { useMemo } from "react";
import { 
  ArrowLeft, 
  Settings2, 
  Table as TableIcon,
  Search,
  Database
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

export default function RulesetTablesPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

  const ruleset = useMemo(() => {
    if (!id) return null;
    return RULESETS.find(r => r.id === id);
  }, [id]);

  if (!ruleset) return <div className="p-8 text-center">Ruleset not found.</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/rulesets">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">Ruleset Tables: {ruleset.name}</h1>
          <p className="text-sm text-muted-foreground">Select a table to configure its specific archival queries and rules.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-headline">Involved Tables</CardTitle>
                <CardDescription>Manage individual table configurations for this ruleset.</CardDescription>
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
                  <TableHead className="w-[400px] font-bold py-4 px-6 text-slate-600">Table Name</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600">Schema</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600">Last Modified</TableHead>
                  <TableHead className="font-bold py-4 text-slate-600 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ruleset.tables.map((tableName) => (
                  <TableRow key={tableName} className="hover:bg-slate-50/30 group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <TableIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-bold text-slate-800">{tableName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold text-[10px] bg-white">dbo</Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs font-medium">
                      Oct 24, 2024
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 font-bold h-9">
                        <Link href={`/rulesets/${ruleset.id}/configure?table=${tableName}`}>
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
        
        {/* Ruleset Info Sidebar/Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50/50 border-blue-100 shadow-none">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Ruleset Context</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ruleset.description} All queries defined here will be executed under this ruleset's operational window.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-slate-100 shadow-none">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Settings2 className="h-5 w-5 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Global Policies</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Individual table queries override global rules. Use the configuration button to define unique logic per table.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
