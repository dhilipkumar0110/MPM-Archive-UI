
"use client";

import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Settings2, 
  UploadCloud, 
  Check,
  AlertCircle
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
import { toast } from "@/hooks/use-toast";

export default function RulesetsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploaded(true);
      toast({
        title: "Excel Uploaded Successfully",
        description: "Found 3 table definitions in 'archive_v2.xlsx'",
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Archive Rulesets</h1>
          <p className="text-muted-foreground">Define and manage rule sets for automated data archival processes.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> New Ruleset
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="border-dashed border-2 bg-muted/20 border-primary/30 shadow-none hover:bg-primary/5 transition-colors cursor-pointer group">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
            {uploaded ? (
              <Check className="h-8 w-8 text-green-500" />
            ) : (
              <UploadCloud className="h-8 w-8 text-primary" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-headline">
              {uploaded ? "Excel Uploaded Successfully" : "Upload Archive Ruleset (Excel)"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {uploaded ? "archival_v2_export.xlsx (12.4 KB)" : "Drag and drop your Excel sheet here or click to browse files"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!uploaded && (
              <Button onClick={handleUpload} disabled={isUploading} className="bg-primary hover:bg-primary/90">
                {isUploading ? "Parsing File..." : "Select File"}
              </Button>
            )}
            {uploaded && (
              <Button variant="outline" onClick={() => setUploaded(false)}>
                Upload Different File
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Existing Rulesets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-headline">Active Rulesets</h2>
          <Badge variant="outline" className="font-normal">{RULESETS.length} Active</Badge>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RULESETS.map((rs) => (
            <Card key={rs.id} className="shadow-sm border-border/50 flex flex-col hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Badge className="bg-accent text-accent-foreground">{rs.tables.length} Tables</Badge>
                </div>
                <CardTitle className="text-lg font-bold mt-4 font-headline">{rs.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs h-8">
                  {rs.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Involved Tables</p>
                  <div className="flex flex-wrap gap-1">
                    {rs.tables.map(table => (
                      <Badge key={table} variant="secondary" className="text-[10px] py-0 font-medium">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/30 gap-2">
                <Button asChild className="flex-1 bg-primary text-xs h-8" size="sm">
                  <Link href={`/rulesets/${rs.id}/configure`}>
                    <Settings2 className="h-3 w-3 mr-1" /> Configure
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
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
