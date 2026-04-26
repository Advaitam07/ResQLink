
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, type Case, type User } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User as UserIcon, 
  Activity,
  Send,
  Sparkles,
  Bell,
  ShieldAlert,
  Loader2
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { suggestCaseActions } from '@/ai/flows/suggest-case-actions';

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const { cases, saveCases, users, currentUser } = useStore();
  const [updateNote, setUpdateNote] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ actions: string[], skills: string[] } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentCase = cases.find(c => String(c.id) === String(id));
  
  if (!currentCase) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Activity className="h-12 w-12 text-muted-foreground/20" />
        <h2 className="text-xl font-bold font-headline">Mission profile not found.</h2>
        <Link href="/dashboard/cases">
          <Button variant="outline" className="rounded-2xl">Return to Directory</Button>
        </Link>
      </div>
    );
  }

  const volunteers = users.filter(u => u.role === 'volunteer');
  const assignedVolunteer = users.find(u => String(u.id) === String(currentCase.assignedTo));

  const handleAiDeepDive = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestCaseActions({
        description: currentCase.description,
        category: currentCase.category,
        urgency: currentCase.urgency
      });
      setAiSuggestions({
        actions: result.suggestedActions,
        skills: result.requiredSkills
      });
    } catch (error) {
      console.error("AI Suggestions failed", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAssign = (volunteerId: string) => {
    const volunteer = users.find(u => u.id === volunteerId);
    const updatedCases = cases.map(c => 
      String(c.id) === String(id) ? { 
        ...c, 
        assignedTo: volunteerId, 
        status: 'In Progress' as const,
        updates: [
          ...c.updates, 
          { 
            timestamp: new Date().toISOString(), 
            note: `Field operative ${volunteer?.name || 'Unknown'} deployed to mission.`, 
            user: currentUser?.name || 'System' 
          }
        ]
      } : c
    );
    saveCases(updatedCases);
  };

  const handleAddUpdate = () => {
    if (!updateNote.trim()) return;
    const updatedCases = cases.map(c => 
      String(c.id) === String(id) ? { 
        ...c, 
        updates: [
          ...c.updates, 
          { 
            timestamp: new Date().toISOString(), 
            note: updateNote, 
            user: currentUser?.name || 'System' 
          }
        ]
      } : c
    );
    saveCases(updatedCases);
    setUpdateNote('');
  };

  return (
    <div className="space-y-6">
      <div className="teal-gradient p-8 rounded-[2.5rem] text-white shadow-2xl shadow-teal-900/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/cases">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-12 w-12">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-headline tracking-tight">{currentCase.title}</h1>
              <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full backdrop-blur-md font-bold uppercase text-[10px] tracking-widest">
                {currentCase.status}
              </Badge>
            </div>
            <p className="text-sm text-white/70 font-medium">Protocol ID: <span className="font-mono">#{String(currentCase.id).slice(-6)}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-white/20 hover:bg-white/30 text-white border-none rounded-2xl h-12 font-bold px-6 backdrop-blur-md"
            onClick={handleAiDeepDive}
            disabled={isSuggesting}
          >
            {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            AI Intel
          </Button>
          <div className="p-3 bg-white/20 rounded-full hover:bg-white/30 cursor-pointer transition-all backdrop-blur-md">
            <Bell className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <Card className="glass-card rounded-[3rem] border-none soft-shadow p-10">
            <div className="flex justify-between items-start mb-8">
               <h2 className="text-2xl font-bold font-headline">Operational Briefing</h2>
               <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary text-xs font-bold">
                  <MapPin className="h-3.5 w-3.5" /> {currentCase.location}
               </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base mb-10 font-medium">
              {currentCase.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white/40 p-6 rounded-[2rem] space-y-2 border border-white/40 glass-card">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Service Protocol</p>
                  <p className="text-base font-bold text-primary">{currentCase.category}</p>
               </div>
               <div className="bg-white/40 p-6 rounded-[2rem] space-y-2 border border-white/40 glass-card">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Required Capability</p>
                  <p className="text-base font-bold text-accent">{currentCase.skillRequired}</p>
               </div>
            </div>

            {aiSuggestions && (
              <div className="mt-8 pt-8 border-t border-white/40 space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-bold text-lg font-headline">AI Strategic Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action Matrix</p>
                    <ul className="space-y-2">
                      {aiSuggestions.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Skill Gap Analysis</p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.skills.map((skill, i) => (
                        <Badge key={i} className="bg-primary/10 text-primary border-primary/20 rounded-full px-4 py-1.5 text-[10px] font-bold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="glass-card rounded-[3rem] border-none soft-shadow p-10">
            <h2 className="text-2xl font-bold font-headline mb-10">Intelligence & Sync Timeline</h2>
            <div className="space-y-8 relative before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-0.5 before:bg-primary/10">
              {currentCase.updates.map((update, i) => (
                <div key={i} className="relative pl-14 group">
                  <div className="absolute left-0 top-1 h-11 w-11 rounded-2xl bg-white border border-primary/20 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                  <div className="bg-white/40 p-6 rounded-[2rem] border border-white/50 hover:bg-white/60 transition-colors glass-card">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-sm font-bold text-primary">{update.user}</span>
                       <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <Clock className="h-3 w-3" /> {mounted && !isNaN(new Date(update.timestamp).getTime()) ? new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                       </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">{update.note}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-10 border-t border-white/60">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Enter intel report or field notes..." 
                    value={updateNote}
                    onChange={e => setUpdateNote(e.target.value)}
                    className="bg-white/40 border-none rounded-2xl h-14 pl-6 text-sm focus-visible:ring-primary/20 glass-card"
                  />
                </div>
                <Button className="teal-gradient text-white h-14 w-14 rounded-2xl shadow-lg shadow-teal-500/20" onClick={handleAddUpdate}>
                  <Send className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-card rounded-[3rem] border-none soft-shadow p-8">
            <h3 className="text-lg font-bold font-headline mb-8">Mission Control</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                 <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Priority Matrix</Label>
                 <div className="flex items-center gap-3 bg-white/40 p-4 rounded-2xl border border-white/50 glass-card">
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      currentCase.urgency === 'High' ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" : "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.6)]"
                    )} />
                    <span className="font-bold text-sm tracking-tight">{currentCase.urgency} Urgency</span>
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/40">
                 <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Deployed Asset</Label>
                 {assignedVolunteer ? (
                   <div className="flex items-center gap-4 bg-white/40 p-5 rounded-[2rem] border border-white/50 glass-card shadow-sm">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={`https://picsum.photos/seed/${assignedVolunteer.id}/100/100`} />
                        <AvatarFallback><UserIcon className="h-6 w-6" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold tracking-tight">{assignedVolunteer.name}</p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{assignedVolunteer.role}</p>
                      </div>
                   </div>
                 ) : (
                   <div className="p-8 rounded-[2rem] border-2 border-dashed border-primary/20 text-center bg-primary/5">
                     <p className="text-xs text-muted-foreground/60 italic font-medium">Unassigned Sector</p>
                   </div>
                 )}
              </div>

              {(currentUser?.role === 'coordinator' || currentUser?.role === 'admin') && (
                <div className="space-y-4 pt-6 border-t border-white/40">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Modify Assignment</Label>
                  <Select onValueChange={handleAssign}>
                    <SelectTrigger className="bg-white/40 border-none rounded-2xl h-12 text-sm font-semibold glass-card">
                      <SelectValue placeholder="Select Operative" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-none rounded-2xl shadow-2xl">
                      {volunteers.map(v => (
                        <SelectItem key={v.id} value={v.id} className="text-sm font-medium focus:bg-primary/10">
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-primary/5 border-none rounded-[3rem] p-10 overflow-hidden relative group">
             <div className="relative z-10">
                <ShieldAlert className="h-10 w-10 text-primary mb-6" />
                <h3 className="font-bold text-xl font-headline mb-3">Protocol Escalation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8 font-medium">If mission parameters require administrative override or logistics sync.</p>
                <Button className="w-full rounded-2xl teal-gradient text-white h-12 font-bold transition-all shadow-xl shadow-teal-500/10">
                  Initialize Escalation
                </Button>
             </div>
             <Activity className="absolute -bottom-10 -right-10 h-48 w-48 text-primary/5 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
          </Card>
        </div>
      </div>
    </div>
  );
}
