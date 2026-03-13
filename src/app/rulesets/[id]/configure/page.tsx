
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Code,
  Database
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RULESETS, TABLE_SCHEMA } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";

type Condition = {
  id: string;
  column: string;
  operator: string;
  value: string;
  join: "AND" | "OR";
};

export default function TableRuleBuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;
  const tableName = searchParams.get('table') || 'table_name';

  const policy = useMemo(() => {
    if (!id) return RULESETS[0];
    return RULESETS.find(r => r.id === id) || RULESETS[0];
  }, [id]);

  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", column: "created_at", operator: "<", value: "2023-01-01", join: "AND" }
  ]);
  const [generatedSql, setGeneratedSql] = useState("WHERE created_at < '2023-01-01'");

  // Effect to sync the SQL preview whenever conditions change
  useEffect(() => {
    if (conditions.length === 0) {
      setGeneratedSql("");
      return;
    }

    const sql = conditions.reduce((acc, cond, index) => {
      // Helper to determine if value needs quotes
      const needsQuotes = isNaN(Number(cond.value)) || cond.value.trim() === "";
      const formattedValue = needsQuotes ? `'${cond.value}'` : cond.value;
      
      const prefix = index === 0 ? "WHERE " : ` ${cond.join} `;
      return acc + prefix + `${cond.column} ${cond.operator} ${formattedValue}`;
    }, "");

    setGeneratedSql(sql);
  }, [conditions]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      { 
        id: Math.random().toString(36).substr(2, 9), 
        column: TABLE_SCHEMA[0].name, 
        operator: "=", 
        value: "", 
        join: "AND" 
      }
    ]);
  };

  const removeCondition = (condId: string) => {
    setConditions(conditions.filter(c => c.id !== condId));
  };

  const updateCondition = (condId: string, fields: Partial<Condition>) => {
    setConditions(conditions.map(c => c.id === condId ? { ...c, ...fields } : c));
  };

  const saveConfiguration = () => {
    toast({
      title: "Configuration Saved",
      description: `Rule for ${tableName} updated successfully.`,
    });
    router.push(`/rulesets/${id}`);
  };

  if (!policy) return <div className="p-8 text-center">Loading archive source...</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href={`/rulesets/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">Table Rule Configuration</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{tableName}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Define precise filter conditions for source data archival in source: {policy.name}.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Main Builder Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm border-border/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold font-headline">Visual Condition Builder</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal bg-white">PostgreSQL Dialect</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {conditions.map((cond, index) => (
                <div key={cond.id} className="flex flex-wrap items-center gap-3 p-4 bg-muted/20 rounded-xl border border-border/40 relative group">
                  {index > 0 && (
                    <div className="absolute -top-3 left-6 z-10">
                      <Select 
                        value={cond.join} 
                        onValueChange={(val: "AND" | "OR") => updateCondition(cond.id, { join: val })}
                      >
                        <SelectTrigger className="h-6 w-20 px-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded-full shadow-sm border-0 focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="w-full sm:w-auto flex-1 min-w-[140px]">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 ml-1">Column</p>
                    <Select value={cond.column} onValueChange={(val) => updateCondition(cond.id, { column: val })}>
                      <SelectTrigger className="bg-white border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TABLE_SCHEMA.map(col => (
                          <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-[80px]">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 ml-1">Op</p>
                    <Select value={cond.operator} onValueChange={(val) => updateCondition(cond.id, { operator: val })}>
                      <SelectTrigger className="bg-white border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="=">=</SelectItem>
                        <SelectItem value="!=">!=</SelectItem>
                        <SelectItem value=">">&gt;</SelectItem>
                        <SelectItem value="<">&lt;</SelectItem>
                        <SelectItem value="LIKE">LIKE</SelectItem>
                        <SelectItem value="IN">IN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto flex-1 min-w-[140px]">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 ml-1">Value</p>
                    <Input 
                      value={cond.value} 
                      onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                      placeholder="Enter value..."
                      className="bg-white border-border/60"
                    />
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 self-end mb-[2px]"
                    onClick={() => removeCondition(cond.id)}
                    disabled={conditions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full border-dashed py-6 text-primary hover:bg-primary/5 hover:border-primary" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-2" /> Add New Condition
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50 bg-secondary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                Query Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/90 text-green-400 p-4 rounded-lg font-mono text-sm border-l-4 border-primary">
                <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> {tableName}<br />
                <span className="whitespace-pre-wrap">{generatedSql}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold font-headline flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Available Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto px-6 py-2">
                {TABLE_SCHEMA.map(col => (
                  <div key={col.name} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0 group cursor-help">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary">{col.name}</span>
                      <span className="text-[10px] text-muted-foreground">{col.description}</span>
                    </div>
                    <Badge variant="secondary" className="text-[9px] px-1 h-4 bg-muted text-muted-foreground uppercase">{col.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all py-6 h-12" onClick={saveConfiguration}>
            <Save className="h-5 w-5 mr-2" /> Save Rule Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
