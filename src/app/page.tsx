"use client";

import React from "react";
import { 
  Database, 
  ShieldCheck, 
  TrendingDown, 
  AlertTriangle,
  ArrowUpRight,
  Archive,
  Zap,
  Activity,
  Calendar
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  PieChart,
  Pie,
  Cell,
  Label as RechartsLabel
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ARCHIVE_TREND_DATA = [
  { month: "Jan", volume: 450 },
  { month: "Feb", volume: 520 },
  { month: "Mar", volume: 480 },
  { month: "Apr", volume: 610 },
  { month: "May", volume: 750 },
  { month: "Jun", volume: 820 },
];

const HEALTH_DISTRIBUTION = [
  { name: "Healthy", value: 82, color: "hsl(var(--primary))" },
  { name: "Warning", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Critical", value: 6, color: "hsl(var(--destructive))" },
];

const healthChartConfig = {
  Healthy: {
    label: "Healthy",
    color: "hsl(var(--primary))",
  },
  Warning: {
    label: "Warning",
    color: "hsl(var(--chart-4))",
  },
  Critical: {
    label: "Critical",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

const trendChartConfig = {
  volume: {
    label: "Volume (GB)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const healthScore = 88;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline uppercase italic">Project Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Enterprise Data Archival & Database Lifecycle Management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-bold border-slate-200">
            <Calendar className="h-4 w-4 mr-2" /> Last 30 Days
          </Button>
          <Button className="bg-primary font-bold shadow-lg shadow-primary/20">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Database className="h-3.5 w-3.5" /> Storage Reclaimed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 font-headline">4.2 TB</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
              <TrendingDown className="h-3 w-3" /> 12% Reduction this month
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Archival Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 font-headline">99.2%</div>
            <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
              Across 1,482 total executions
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-400" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Archive className="h-3.5 w-3.5" /> Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 font-headline">12</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
              3 Completing this week
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 overflow-hidden relative group bg-slate-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-3.5 w-3.5" /> System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white font-headline">Optimal</div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase">
              No critical infrastructure alerts
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Database Health Score - Advanced Visual */}
        <Card className="shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Database Health Score
            </CardTitle>
            <CardDescription className="text-xs">Aggregate index, query, and deadlock analysis.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center py-6">
            <ChartContainer config={healthChartConfig} className="h-[240px] w-full">
              <PieChart>
                <Pie
                  data={HEALTH_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {HEALTH_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                  <RechartsLabel
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-slate-900 text-4xl font-black font-headline"
                            >
                              {healthScore}%
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-3 gap-4 w-full mt-2">
              {HEALTH_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</span>
                  <Badge variant="secondary" className="font-bold text-[10px] bg-slate-100">{item.value}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Archival Volume Trend */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-primary" /> Archival Volume (GB)
              </CardTitle>
              <CardDescription className="text-xs">Historical trend of data transitioned to secondary storage.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-primary">
              View Details <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={trendChartConfig}>
              <AreaChart 
                data={ARCHIVE_TREND_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Insights Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-widest">Efficiency Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-red-900 leading-tight">High Index Fragmentation</p>
                <p className="text-[10px] text-red-700/80">Source [XEON2] reports &gt; 30% fragmentation in payment tables.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Archive className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-blue-900 leading-tight">Project Milestone Reached</p>
                <p className="text-[10px] text-blue-700/80">Financial 2023 Archive is 100% complete and verified.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 md:col-span-2">
          <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-widest">Archival Strategy Summary</CardTitle>
            <Badge className="bg-slate-100 text-slate-500 border-0 font-bold text-[9px] uppercase">FY24-Q3 Focus</Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Target ROI</p>
                <p className="text-2xl font-black text-slate-900 font-headline">$14.2k</p>
                <p className="text-[9px] text-slate-500 font-medium">Projected storage savings</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Compliance Coverage</p>
                <p className="text-2xl font-black text-slate-900 font-headline">100%</p>
                <p className="text-[9px] text-slate-500 font-medium">Audit logs retained</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Avg Latency Reduction</p>
                <p className="text-2xl font-black text-green-600 font-headline">18%</p>
                <p className="text-[9px] text-slate-500 font-medium">Improved query speed</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Secondary Growth</p>
                <p className="text-2xl font-black text-slate-900 font-headline">Low</p>
                <p className="text-[9px] text-slate-500 font-medium">Optimized cold storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
