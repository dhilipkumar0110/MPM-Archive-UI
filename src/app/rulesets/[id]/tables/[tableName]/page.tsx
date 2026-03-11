
"use client";

import React, { useMemo } from "react";
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Zap, 
  Database,
  Search,
  Settings2,
  Info,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis
} from "recharts";
import { RULESETS } from "@/lib/mock-data";

const GROWTH_DATA = [
  { month: "Jan", size: 180 },
  { month: "Feb", size: 195 },
  { month: "Mar", size: 210 },
  { month: "Apr", size: 215 },
  { month: "May", size: 230 },
  { month: "Jun", size: 245 },
];

export default function TableAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;
  const tableName = typeof params?.tableName === 'string' ? params.tableName : Array.isArray(params?.tableName) ? params.tableName[0] : 'table_name';

  const policy = useMemo(() => {
    if (!id) return RULESETS[0];
    return RULESETS.find(r => r.id === id) || RULESETS[0];
  }, [id]);

  const handleExport = () => {
    // Simulated export
    alert("Stats exported to Excel successfully.");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
          <Link href="/rulesets" className="hover:text-primary">Archive Sources</Link>
          <span>/</span>
          <Link href={`/rulesets/${id}`} className="hover:text-primary">{policy.name}</Link>
          <span>/</span>
          <span className="text-slate-600">{tableName}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link href={`/rulesets/${id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline uppercase">{tableName}</h1>
              <p className="text-sm text-slate-500 font-medium">Detailed performance metrics and schema analytics.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="font-bold border-slate-200" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export Table Stats
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 font-bold">
              <Link href={`/rulesets/${id}/configure?table=${tableName}`}>
                <Settings2 className="h-4 w-4 mr-2" /> Configure Archival
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Database className="h-3.5 w-3.5" /> Table Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 font-headline">245.8 GB</div>
            <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +15.2% vs Last Month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="h-3.5 w-3.5" /> Deadlocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 font-headline">12</div>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">
              Last 30 Days execution window
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-3.5 w-3.5" /> Slow Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-orange-600 font-headline">58</div>
            <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase tracking-tighter">
              Averaging 2.4s execution time
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info className="h-3.5 w-3.5" /> Usage Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white font-headline">Low</div>
            <Badge className="bg-primary/20 text-primary border-primary/20 text-[9px] mt-1 h-5 font-bold px-2">High Archival Priority</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Table Growth Chart */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Table Storage Growth (GB)
            </CardTitle>
            <CardDescription className="text-xs">Historical data size progression over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ChartContainer config={{ size: { label: "Size (GB)", color: "hsl(var(--primary))" } }}>
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="size" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSize)" 
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Missing Indexes & Issues */}
        <div className="space-y-6">
          <Card className="shadow-sm border-red-100 bg-red-50/20">
            <CardHeader className="pb-2 border-b border-red-100/50">
              <CardTitle className="text-sm font-bold text-red-700 flex items-center gap-2 uppercase tracking-tight">
                <AlertTriangle className="h-4 w-4" /> Missing Indexes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="p-3 bg-white border border-red-100 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-slate-800 uppercase">[transaction_id]</span>
                  <Badge className="bg-red-100 text-red-700 text-[8px] h-4 border-0">CRITICAL</Badge>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Missing non-clustered index detected on primary lookup field.</p>
              </div>
              <div className="p-3 bg-white border border-red-100 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-slate-800 uppercase">[created_at, status]</span>
                  <Badge className="bg-orange-100 text-orange-700 text-[8px] h-4 border-0">WARNING</Badge>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Composite index recommended to improve archival query scans.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                Slow Query Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { q: "SELECT TOP 100 * FROM...", t: "4.8s", d: "10 min ago" },
                  { q: "UPDATE transactions SET...", t: "3.2s", d: "45 min ago" },
                  { q: "DELETE FROM transactions WHERE...", t: "12.5s", d: "2 hours ago" },
                ].map((item, idx) => (
                  <div key={idx} className="px-4 py-3 hover:bg-slate-50 transition-colors flex justify-between items-center group cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700 group-hover:text-primary transition-colors">{item.q}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{item.d}</span>
                    </div>
                    <span className="text-[10px] font-black text-red-500">{item.t}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full h-10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary">
                View Full SQL Audit Log
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
