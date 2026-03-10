
"use client";

import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type ArchivedTableResult = {
  tableName: string;
  elapsedTime: string;
  status: string;
  result: string;
  affectedRows: number;
};

const MOCK_RESULTS: ArchivedTableResult[] = [
  {
    tableName: "AUTH_MASTERS",
    elapsedTime: "9m 10s",
    status: "Completed",
    result: "No errors and warnings",
    affectedRows: 140767
  },
  {
    tableName: "USER_SESSIONS",
    elapsedTime: "12m 45s",
    status: "Completed",
    result: "No errors and warnings",
    affectedRows: 852430
  },
  {
    tableName: "AUDIT_LOG_DETAILS",
    elapsedTime: "45m 22s",
    status: "Completed",
    result: "No errors and warnings",
    affectedRows: 12045500
  },
  {
    tableName: "TRANSACTION_HISTORY_2023",
    elapsedTime: "1h 05m",
    status: "Completed",
    result: "No errors and warnings",
    affectedRows: 4200150
  }
];

export default function ArchivedTablesPage() {
  const params = useParams();
  const id = params?.id;
  const runId = params?.runId;

  const [filters, setFilters] = useState({
    tableName: "",
    elapsedTime: "",
    status: "",
    result: "",
    affectedRows: ""
  });

  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResults = useMemo(() => {
    return MOCK_RESULTS.filter(item => {
      return (
        item.tableName.toLowerCase().includes(filters.tableName.toLowerCase()) &&
        item.status.toLowerCase().includes(filters.status.toLowerCase()) &&
        item.result.toLowerCase().includes(filters.result.toLowerCase())
      );
    });
  }, [filters]);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Preparing Excel file for download...",
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href={`/tasks/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-primary font-headline">Archived Tables</h1>
        </div>
        <Button onClick={handleExport} className="bg-primary hover:bg-primary/90 font-bold">
          <Download className="h-4 w-4 mr-2" /> Export to Excel
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-4 font-bold text-slate-700">Table Name</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Elapsed Time</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Status</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Result</TableHead>
              <TableHead className="py-4 font-bold text-slate-700">Affected Rows</TableHead>
            </TableRow>
            {/* Filter Row */}
            <TableRow className="hover:bg-transparent border-t-0">
              <TableCell className="py-2">
                <div className="relative group">
                  <Input 
                    placeholder="" 
                    className="h-8 pr-8"
                    value={filters.tableName}
                    onChange={(e) => setFilters({...filters, tableName: e.target.value})}
                  />
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 group-focus-within:text-primary" />
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="relative group">
                  <Input placeholder="" className="h-8 pr-8" disabled />
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="relative group">
                  <Input 
                    placeholder="" 
                    className="h-8 pr-8"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  />
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="relative group">
                  <Input 
                    placeholder="" 
                    className="h-8 pr-8"
                    value={filters.result}
                    onChange={(e) => setFilters({...filters, result: e.target.value})}
                  />
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                </div>
              </TableCell>
              <TableCell className="py-2">
                <div className="relative group">
                  <Input placeholder="" className="h-8 pr-8" disabled />
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                </div>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/30 group">
                  <TableCell className="font-bold text-blue-600 cursor-pointer hover:underline py-4">
                    {item.tableName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-medium px-2 py-0.5">
                      {item.elapsedTime}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {item.status}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {item.result}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {item.affectedRows.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-slate-400">
                  No records found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" disabled><ChevronsLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" disabled><ChevronLeft className="h-4 w-4" /></Button>
              <div className="bg-red-100 text-red-600 font-bold h-7 w-7 flex items-center justify-center rounded text-sm mx-1">1</div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" disabled><ChevronRight className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" disabled><ChevronsRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="h-8 w-[70px] bg-white text-xs border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-slate-500">items per page</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            1 - {filteredResults.length} of {filteredResults.length} items
          </div>
        </div>
      </div>
    </div>
  );
}
