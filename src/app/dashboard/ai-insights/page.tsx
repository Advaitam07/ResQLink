"use client";

import { useStore } from '@/lib/store';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, TrendingUp, AlertTriangle, Users, Target,
  Zap, Activity, Cpu, RefreshCw, ArrowRight, MapPin, CheckCircle2,
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// AI Robot SVG component
function AIRobot() {
  return (
    <div className="animate-robot-float select-none" aria-hidden>
      <svg width="56" height="64" viewBox="0 0 56 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line x1="28" y1="0" x2="28" y2="8" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="28" cy="4" r="3" fill="#f97316" className="animate-robot-blink"/>
        {/* Head */}
        <rect x="10" y="8" width="36" height="26" rx="8" fill="#1e293b"/>
        <rect x="14" y="12" width="28" height="18" rx="5" fill="#0f172a"/>
        {/* Eyes */}
        <circle cx="21" cy="21" r="4" fill="#3b82f6" className="animate-robot-blink"/>
        <circle cx="35" cy="21" r="4" fill="#3b82f6" className="animate-robot-blink"/>
        <circle cx="21" cy="21" r="2" fill="white"/>
        <circle cx="35" cy="21" r="2" fill="white"/>
        {/* Mouth */}
        <rect x="19" y="27" width="18" height="3" rx="1.5" fill="#3b82f6" opacity="0.6"/>
        {/* Body */}
        <rect x="8" y="36" width="40" height="22" rx="8" fill="#1e293b"/>
        {/* Chest panel */}
        <rect x="14" y="40" width="28" height="14" rx="4" fill="#0f172a"/>
        <circle cx="22" cy="47" r="3" fill="#f97316" opacity="0.8"/>
        <circle cx="28" cy="47" r="3" fill="#3b82f6" opacity="0.8"/>
        <circle cx="34" cy="47" r="3" fill="#10b981" opacity="0.8"/>
        {/* Arms */}
        <rect x="0" y="38" width="8" height="16" rx="4" fill="#1e293b"/>
        <rect x="48" y="38" width="8" height="16" rx="4" fill="#1e293b"/>
        {/* Legs */}
        <rect x="14" y="58" width="10" height="6" rx="3" fill="#1e293b"/>
        <rect x="32" y="58" width="10" height="6" rx="3" fill="#1e293b"/>
      </svg>
    </div>
  );
}

export default function AIInsightsPage() {
  const { cases, users } = useStore();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const urgentCases = cases.filter(c => c.urgency === 'High').length;
  const completedCases = cases.filter(c => c.status === 'Completed').length;

  const handleRefreshInsights = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({ title: "Intelligence Synced", description: "AI matrix updated with latest mission data." });
    }, 2000);
  };

  const handleReviewSector = () => {
    toast({ title: "Sector B7 Analysis", description: "Opening detailed sector intelligence report." });
  };

  const handleOptimizeRoute = () => {
    toast({ title: "Route Optimization", description: "Calculating optimal logistics pathways." });
  };

  const handleArchiveAccess = () => {
    toast({ title: "Archive Access", description: "Loading full intelligence archive..." });
  };

  const intelCards = [
    { title: "High flood risk detected in Eastern District", urgency: "critical", desc: "Water levels at Sector 4 rising. Predicted breach within 6 hours." },
    { title: "Medical volunteer shortage near Community Center", urgency: "high", desc: "Current case density exceeds available medical assets by 40%." },
    { title: "Food distribution response is 72% complete", urgency: "medium", desc: "Nagpur hub reporting steady progress. 200 families remaining." },
    { title: "Shelter capacity may exceed limit in 4 hours", urgency: "high", desc: "Akola shelter reaching 90% occupancy. Alternative site needed." },
    { title: "Priority action: assign 3 volunteers to Clean Water Supply case", urgency: "critical", desc: "Bengaluru water crisis escalating. Immediate logistics support required." },
  ];

  const insights = [
    { label: 'Active Emergency Summary', value: `${urgentCases} High Priority Missions`, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'System Risk Level', value: 'Elevated (7.8/10)', icon: Activity, color: 'text-orange-600' },
    { label: 'Predicted Urgent Zones', value: 'Nagpur & Mumbai', icon: MapPin, color: 'text-primary' },
    { label: 'Volunteer Shortage', value: 'Medical & Rescue', icon: Users, color: 'text-teal-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <AIRobot />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tighter font-headline">Strategic Intelligence</h1>
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse mr-1.5" />
                Live AI Matrix
              </Badge>
            </div>
            <p className="text-sm text-slate-500 font-medium">Predictive analysis and mission synchronization protocols.</p>
          </div>
        </div>
        <Button
          onClick={handleRefreshInsights}
          disabled={isSyncing}
          className="rounded-xl teal-gradient text-white font-bold h-11 px-6 shadow-xl shadow-teal-500/20 btn-click"
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isSyncing && "animate-spin")} />
          Sync Intelligence
        </Button>
      </div>

      {/* Quick Insights Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl p-5 group transition-all hover:shadow-md cursor-default border-l-4 border-l-transparent hover:border-l-primary">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-slate-50">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="glass-card rounded-[3rem] border-none soft-shadow p-10 relative overflow-hidden bg-slate-900 text-white">
             <div className="absolute inset-0 rescue-grid opacity-10" />
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                  <Badge className="bg-primary/20 text-primary border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Global Status: Recovery Phase</Badge>
                  <h2 className="text-4xl font-black tracking-tighter font-headline leading-tight">Response Priority Suggestions</h2>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">AI engine has detected high correlation between volunteer skill gaps and urgent mission success rates. Recommended reallocation of Medical assets to the Western Sector.</p>
                  <div className="flex gap-4 pt-2">
                    <Button onClick={handleOptimizeRoute} className="bg-white text-slate-900 font-bold rounded-xl h-11 px-6 hover:bg-slate-100">Optimize Strategy</Button>
                    <Button variant="outline" className="border-white/20 text-white font-bold rounded-xl h-11 px-6 hover:bg-white/5">Download Full Protocol</Button>
                  </div>
                </div>
                <div className="w-full md:w-[240px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 space-y-4">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Next Action</p>
                      <p className="text-xs font-bold">Deploy 4 Medical Operatives to Nagpur Sector B7</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logistics Update</p>
                      <p className="text-xs font-bold">Clearance granted for heavy vehicle transit in Mumbai North.</p>
                   </div>
                </div>
             </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelCards.map((card, i) => (
              <Card key={i} className="border-none shadow-sm rounded-[2rem] p-6 group hover:scale-[1.02] transition-all cursor-default relative overflow-hidden">
                <div className={cn(
                  "absolute top-0 left-0 h-full w-1.5",
                  card.urgency === 'critical' ? "bg-red-500" :
                  card.urgency === 'high' ? "bg-orange-500" : "bg-blue-500"
                )} />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black uppercase tracking-[0.1em] border-none px-2",
                      card.urgency === 'critical' ? "bg-red-50 text-red-600" :
                      card.urgency === 'high' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {card.urgency} Intelligence
                    </Badge>
                    <Activity className="h-3.5 w-3.5 text-slate-300" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{card.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-4 glass-card rounded-[3rem] border-none soft-shadow p-8 flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-teal-600" />
            <h3 className="font-bold text-lg font-headline">Intelligence Feed</h3>
            <div className="ml-auto h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          </div>
          <div className="space-y-4 flex-1">
            {[
              { time: '1m ago',  msg: `7 high-urgency cases require immediate attention in Nagpur.`, type: 'alert' },
              { time: '5m ago',  msg: 'Mumbai Sector mission matched with operative Sanjay Patil.', type: 'match' },
              { time: '12m ago', msg: `3 missions completed in Pune this cycle.`, type: 'sync' },
              { time: '1h ago',  msg: 'Volunteer skill gap analysis ready for Chennai sector.', type: 'analysis' },
              { time: '2h ago',  msg: 'Heavy rainfall predicted for Nashik zone in next 4 hours.', type: 'alert' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 group cursor-default">
                <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <div className={cn("h-1.5 w-1.5 rounded-full",
                    log.type === 'alert' ? "bg-red-500 animate-pulse" :
                    log.type === 'match' ? "bg-primary animate-pulse" : "bg-slate-300"
                  )} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold leading-tight text-slate-900 group-hover:text-primary transition-colors">{log.msg}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <Button onClick={handleArchiveAccess}
              className="w-full rounded-2xl bg-slate-900 text-white font-bold h-12 gap-2 btn-click hover:bg-slate-800 transition-colors">
              <Zap className="h-4 w-4" /> Full Archive Access
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
