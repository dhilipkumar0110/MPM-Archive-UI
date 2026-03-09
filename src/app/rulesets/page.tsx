
"use client";

import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Settings2, 
  UploadCloud, 
  Check,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RULESETS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function RulesetsPage() {
  const [localRulesets, setLocalRulesets] = useState(RULESETS);
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [newRulesetName, setNewRulesetName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate parsing delay
    setTimeout(() => {
      setIsUploading(false);
      setUploaded(true);
      toast({
        title: "Excel Uploaded Successfully",
        description: "Found table definitions in the uploaded file",
      });
    }, 1500);
  };

  const handleSaveRuleset = () => {
    if (!newRulesetName.trim()) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please enter a name for the archive ruleset.",
      });
      return;
    }

    if (!uploaded) {
      toast({
        variant: "destructive",
        title: "Excel File Required",
        description: "Please upload an archive ruleset definition file.",
      });
      return;
    }

    const newRuleset = {
      id: `rs-${Date.now()}`,
      name: newRulesetName,
      tables: ["imported_table_1", "imported_table_2"],
      description: `New ruleset imported from Excel for ${newRulesetName}.`
    };

    setLocalRulesets([newRuleset, ...localRulesets]);
    setNewRulesetName("");
    setUploaded(false);
    setIsDialogOpen(false);
    
    toast({
      title: "Ruleset Added",
      description: `"${newRulesetName}" has been successfully added to your active rulesets.`,
    });
  };

  const deleteRuleset = (id: string) => {
    setLocalRulesets(localRulesets.filter(r => r.id !== id));
    toast({
      title: "Ruleset Removed",
      description: "The ruleset has been deleted from the active list.",
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Archive Rulesets</h1>
          <p className="text-muted-foreground">Define and manage rule sets for automated data archival processes.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-md">
              <Plus className="h-4 w-4 mr-2" /> New Ruleset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] border-slate-200">
            <DialogHeader>
              <DialogTitle className="font-headline text-xl text-slate-900">Create New Ruleset</DialogTitle>
              <DialogDescription>
                Provide a name and upload your Excel definition file to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700">Archive Ruleset Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Q4 Financial Cleanup"
                  value={newRulesetName}
                  onChange={(e) => setNewRulesetName(e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
              
              <div 
                className={`border-dashed border-2 rounded-xl transition-all ${
                  uploaded ? 'bg-green-50/50 border-green-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/50'
                }`}
              >
                <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${uploaded ? 'bg-green-100 shadow-sm' : 'bg-blue-100 shadow-sm'}`}>
                    {uploaded ? (
                      <Check className="h-8 w-8 text-green-600" />
                    ) : (
                      <UploadCloud className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold font-headline text-slate-900">
                      {uploaded ? "Excel Uploaded Successfully" : "Upload Archive Ruleset (Excel)"}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-[300px] mx-auto leading-relaxed">
                      {uploaded ? "archival_v2_export.xlsx (12.4 KB)" : "Drag and drop your Excel sheet here or click to browse files"}
                    </p>
                  </div>
                  {!uploaded ? (
                    <Button 
                      variant="outline" 
                      onClick={handleUpload} 
                      disabled={isUploading}
                      className="bg-primary text-white hover:bg-primary/90 border-0 h-10 px-8 font-bold shadow-sm"
                    >
                      {isUploading ? "Parsing File..." : "Select File"}
                    </Button>
                  ) : (
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => setUploaded(false)} 
                      className="text-slate-400 hover:text-slate-600 font-medium"
                    >
                      Upload different file
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 mt-2">
              <Button 
                variant="ghost" 
                onClick={() => setIsDialogOpen(false)} 
                className="font-medium text-slate-500"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveRuleset} 
                className="bg-primary hover:bg-primary/90 font-bold px-10 shadow-lg shadow-primary/20"
              >
                Save Ruleset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Rulesets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-headline text-slate-900">Active Rulesets</h2>
          <Badge variant="outline" className="font-bold bg-white text-slate-600 border-slate-200">
            {localRulesets.length} Active
          </Badge>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {localRulesets.map((rs) => (
            <Card key={rs.id} className="shadow-sm border-slate-200 flex flex-col hover:border-primary/40 transition-all bg-white group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    <FileSpreadsheet className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 font-bold px-3 py-0.5">
                    {rs.tables.length} Tables
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold mt-5 font-headline text-slate-900 leading-tight">{rs.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs h-8 text-slate-500 mt-1 leading-relaxed">
                  {rs.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 mt-4">
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Involved Tables</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rs.tables.map(table => (
                      <Badge key={table} variant="secondary" className="text-[10px] py-0.5 px-2.5 font-bold bg-slate-100 text-slate-600 border-0">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 mt-2 border-t border-slate-50 gap-2">
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-xs h-10 font-bold shadow-sm" size="sm">
                  <Link href={`/rulesets/${rs.id}`}>
                    <Settings2 className="h-4 w-4 mr-2" /> Configure
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 border-slate-200 hover:border-red-200 transition-colors"
                  onClick={() => deleteRuleset(rs.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
