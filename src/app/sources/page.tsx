"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Globe, 
  User, 
  Clock, 
  Lock, 
  Database as DbIcon,
  LayoutGrid,
  List,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { DATA_SOURCES } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DataSource = {
  id: string;
  name: string;
  server: string;
  owner: string;
  createdAt: string;
  authType: string;
  group: string;
  status: string;
  username?: string;
};

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>(DATA_SOURCES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [server, setServer] = useState("");
  const [authType, setAuthType] = useState("");
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const filteredSources = useMemo(() => {
    return sources.filter(source => 
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.server.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sources, searchTerm]);

  const handleOpenDialog = (source?: DataSource) => {
    if (source) {
      setEditingSource(source);
      setName(source.name);
      setServer(source.server);
      setAuthType(source.authType);
      setDatabase("");
      setUsername(source.username || "");
      setPassword("");
    } else {
      setEditingSource(null);
      setName("");
      setServer("");
      setAuthType("Windows Authentication");
      setDatabase("");
      setUsername("");
      setPassword("");
    }
    setIsDialogOpen(true);
  };

  const handleSaveSource = () => {
    if (!name || !server || !authType) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all mandatory fields.",
      });
      return;
    }

    if (authType === "SQL Server Authentication" && (!username || !password)) {
      toast({
        variant: "destructive",
        title: "Credentials Required",
        description: "Please enter a username and password for SQL Server authentication.",
      });
      return;
    }

    if (editingSource) {
      setSources(prev => prev.map(s => s.id === editingSource.id ? {
        ...s,
        name,
        server,
        authType,
        username: authType === "SQL Server Authentication" ? username : undefined,
      } : s));
      toast({
        title: "Data Source Updated",
        description: `"${name}" has been successfully updated.`,
      });
    } else {
      const newSource: DataSource = {
        id: `DS-${Date.now()}`,
        name,
        server,
        owner: "Current User",
        createdAt: new Date().toLocaleDateString(),
        authType,
        group: "ECD",
        status: "Under Review",
        username: authType === "SQL Server Authentication" ? username : undefined,
      };
      setSources([newSource, ...sources]);
      toast({
        title: "Data Source Added",
        description: `"${name}" is now under review.`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleTestConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Attempting to reach the specified server...",
    });
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `Successfully reached server: ${server}`,
      });
    }, 1500);
  };

  const toggleStatus = (id: string) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === "Active" ? "Inactive" : "Active"
        };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#2672DB] font-headline">Data Source</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00D1FF] hover:bg-[#00B8E6] text-white font-bold px-6 shadow-sm border-0" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-headline text-[#2672DB]">
                {editingSource ? "Edit Data Source" : "New Data Source"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Data Source Name</Label>
                <Input
                  placeholder="Enter data source name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Server Name</Label>
                <Input
                  placeholder="Enter server name"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Authentication type</Label>
                <Select value={authType} onValueChange={setAuthType}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Select authentication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Windows Authentication">Windows Authentication</SelectItem>
                    <SelectItem value="SQL Server Authentication">SQL Server Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {authType === "SQL Server Authentication" && (
                <div className="grid gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Username</Label>
                    <Input
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label className="text-sm font-bold text-slate-700">Database (Optional)</Label>
                <Select value={database} onValueChange={setDatabase}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ECD">ECD</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button variant="outline" className="border-slate-200 text-slate-500 font-medium" onClick={handleTestConnection}>
                  Test Connection
                </Button>
              </div>
            </div>
            <DialogFooter className="flex sm:justify-between gap-2 mt-2">
              <Button variant="outline" className="flex-1 border-slate-300 font-bold" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSource} className="flex-1 bg-red-300 hover:bg-red-400 text-white font-bold border-0">
                {editingSource ? "Save Changes" : "Add Data Source"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search Data Sources..." 
            className="pl-10 border-slate-200 bg-slate-50/30 focus:bg-white transition-all h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px] h-10 border-slate-200">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="created">
            <SelectTrigger className="w-[180px] h-10 border-slate-200">
              <span className="text-slate-400 mr-2">Sort by:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden bg-white">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none bg-blue-50 text-blue-600">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-slate-400 border-l">
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 bg-white shadow-sm">
            <Filter className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredSources.map((source) => (
          <Card key={source.id} className="shadow-sm border-slate-100 flex flex-col hover:shadow-md transition-all group relative overflow-hidden bg-white">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-[17px] font-bold text-[#2672DB] leading-tight">
                  {source.name}
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "font-bold px-2 py-0.5 text-[10px] tracking-wider border-0",
                    source.status === "Active" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                  )}
                >
                  {source.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 pb-6">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Globe className="h-4 w-4 text-[#00D1FF]" />
                <span className="font-medium">{source.server}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <User className="h-4 w-4 text-[#00D1FF]" />
                <span className="font-medium">{source.owner}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Clock className="h-4 w-4 text-[#00D1FF]" />
                <span className="font-medium tracking-tight">Created on {source.createdAt}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Lock className="h-4 w-4 text-[#00D1FF]" />
                <span className="font-medium">{source.authType}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <DbIcon className="h-4 w-4 text-[#00D1FF]" />
                <span className="font-medium">{source.group}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t border-slate-50 gap-4 flex bg-slate-50/30 px-6 py-4">
              <Button 
                variant="outline" 
                className="flex-1 border-[#2672DB] text-[#2672DB] hover:bg-blue-50 font-bold h-10 shadow-sm"
                onClick={() => toggleStatus(source.id)}
              >
                {source.status === "Active" ? "Deactivate" : "Review"}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-[#2672DB] text-[#2672DB] hover:bg-blue-50 font-bold h-10 shadow-sm"
                onClick={() => handleOpenDialog(source)}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
