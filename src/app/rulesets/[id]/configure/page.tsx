
"use client";

import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Code,
  Database,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
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
import { generateWhereClause } from "@/ai/flows/ai-where-clause-generation";
import { toast } from "@/hooks/use-toast";

type Condition = {
  id: string;
  column: string;
  operator: string;
  value: string;
  join: "AND" | "OR";
};

export default function WhereClauseBuilderPage() {
  const params = useParams();
  const router = useRouter();
  
  // Robustly extract ID
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

  const ruleset = useMemo(() => {
    if (!id) return RULESETS[0];
    return RULESETS.find(r => r.id === id) || RULESETS[0];
  }, [id]);

  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", column: "created_at", operator: "<", value: "2023-01-01", join: "AND" }
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSql, setGeneratedSql] = useState("WHERE created_at < '2023-01-01'");

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

  const handleAiGeneration = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const result = await generateWhereClause({
        naturalLanguageDescription: aiPrompt,
        tableSchema: TABLE_SCHEMA,
        databaseType: "PostgreSQL"
      });
      if (result?.whereClause) {
        setGeneratedSql(`WHERE ${result.whereClause}`);
        toast({
          title: "AI Suggestion Ready",
          description: result.explanation,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate clause from the prompt.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveConfiguration = () => {
    toast({
      title: "Configuration Saved",
      description: `Rule for ${ruleset.name} updated successfully.`,
    });
    router.push("/rulesets");
  };

  if (!ruleset) return <div className="p-8 text-center">Loading ruleset...</div>;

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
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">Query Builder: {ruleset.name}</h1>
          <p className="text-sm text-muted-foreground">Define precise filter conditions for source data archival.</p>
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
                        onValueChange={(val: "AND"|"OR") => updateCondition(cond.id, { join: val })}
                      >
                        <SelectTrigger className="h-6 text-[10px] w-16 bg-primary text-primary-foreground font-bold uppercase rounded-full">
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
                <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> {ruleset.tables?.[0] || 'table_name'}<br />
                {generatedSql}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI & Sidebar Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-white to-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold font-headline">AI Assistant</CardTitle>
              </div>
              <CardDescription>
                Describe your requirements in plain English and let AI build the clause.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea 
                  className="w-full min-h-[120px] bg-white border border-border/60 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  placeholder="e.g. Find all records where status is inactive and were created before last summer..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-sm font-semibold"
                onClick={handleAiGeneration}
                disabled={isGenerating || !aiPrompt}
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" /> Analyzing Schema...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" /> Generate Condition
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold font-headline flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                Available Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-auto px-6 py-2">
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
