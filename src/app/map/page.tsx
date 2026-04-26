"use client";

import { useState, useMemo, useEffect } from 'react';
import { useStore, type Case } from '@/lib/store';
import { caseAPI } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Search, MapPin, Download, Plus, Minus, Target,
  RefreshCw, Activity, Shield, AlertTriangle, 
  CheckCircle2, ArrowRight
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateMapPDF } from '@/lib/pdf';

export default function MapOverviewPage() {
  const { cases, currentUser, saveCases, users, refreshCases } = useStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'Critical' | 'High' | 'Active' | 'Completed'>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    refreshCases().catch(() => {});
  }, [refreshCases]);

  const getCoordinates = (c: Case) => {
    if (c.coordinates) {
      // India roughly: Lat 8 to 36, Lng 68 to 97
      const x = ((c.coordinates.lng - 68) / 29) * 100;
      const y = (1 - (c.coordinates.lat - 8) / 28) * 100;
      return { x: `${x}%`, y: `${y}%` };
    }
    return { x: '50%', y: '50%' };
  };

  const filteredData = useMemo(() => {
    let base = cases;
    if (filter === 'Critical') base = cases.filter(c => c.urgency === 'Critical');
    else if (filter === 'High') base = cases.filter(c => c.urgency === 'High');
    else if (filter === 'Active') base = cases.filter(c => c.status === 'In Progress' || c.status === 'Active');
    else if (filter === 'Completed') base = cases.filter(c => c.status === 'Completed');

    if (searchTerm) {
      base = base.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return base;
  }, [cases, filter, searchTerm]);

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  const handleJoinMission = async (caseId: string) => {
    if (!currentUser) return;
    try {
      await caseAPI.assign(caseId, currentUser.id);
      await refreshCases();
      toast({ title: "Deployment Active", description: "You have joined this mission sector." });
    } catch {
      toast({ variant: "destructive", title: "Deployment Failed", description: "Could not sync with central command." });
    }
  };

  const handleExportData = () => {
    generateMapPDF(cases.map(c => ({
      id: c.id, title: c.title, category: c.category,
      urgency: c.urgency, status: c.status, location: c.location,
    })));
    toast({ title: "Intelligence Exported", description: "Tactical map report has been compiled and saved." });
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilter('all');
    setSelectedCaseId(null);
    setZoomLevel(1);
    toast({ title: "View Reset", description: "Map view and filters restored to default." });
  };

  const urgentCount = cases.filter(c => c.urgency === 'Critical' || c.urgency === 'High').length;
  const activeCount = cases.filter(c => c.status === 'In Progress' || c.status === 'Active').length;

  if (!mounted) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-body text-white">

      {/* Top bar - Professional Tactical Header */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4 z-40 h-[64px]">
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-1.5 bg-primary rounded-lg shadow-lg shadow-primary/20">
            <Target className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-tight">Tactical Map Overview</h1>
            <p className="text-[8px] text-primary font-black uppercase tracking-[0.2em]">National Mission Grid</p>
          </div>
        </div>

        {/* Live System Stats */}
        <div className="hidden md:flex items-center gap-6">
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Units</span>
              <span className="text-sm font-bold text-teal-500">{activeCount}</span>
           </div>
           <div className="h-6 w-px bg-white/10" />
           <div className="flex flex-col items-center">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Urgent Alerts</span>
              <span className="text-sm font-bold text-red-500">{urgentCount}</span>
           </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-lg h-9 px-3 text-[10px] font-black uppercase tracking-widest gap-2 text-white/70 hover:text-white hover:bg-white/5 btn-click"
            onClick={handleExportData}
          >
            <Download className="h-3.5 w-3.5" /> Export Intelligence
          </Button>
          <Button onClick={handleReset} variant="outline" className="rounded-lg h-9 border-white/10 text-white bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest px-4">
             <RefreshCw className="h-3.5 w-3.5 mr-2" /> Reset View
          </Button>
        </div>
      </div>

      <div className="flex flex-1 h-full pt-[64px] overflow-hidden">

        {/* Left Mission List - Refined Sidebar */}
        <div className="w-[300px] h-full shrink-0 bg-slate-900 border-r border-white/10 flex flex-col z-30 overflow-hidden">
          <div className="p-4 space-y-4 border-b border-white/5">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search sector IDs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-white/5 border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {(['all', 'Critical', 'High', 'Active', 'Completed'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cn("px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
                    filter === f ? "bg-primary text-white shadow-lg" : "bg-white/5 text-slate-500 hover:text-white hover:bg-white/10"
                  )}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 px-2 mb-2">
              {filteredData.length} Signal Contacts Detected
            </p>
            {filteredData.map(c => (
              <div key={c.id} onClick={() => setSelectedCaseId(c.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                  selectedCaseId === c.id
                    ? "bg-primary/20 border-primary/40 shadow-xl"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                )}>
                <div className={cn(
                  "absolute top-0 left-0 h-full w-1 transition-all",
                  c.urgency === 'Critical' ? "bg-red-500" :
                  c.urgency === 'High' ? "bg-orange-500" :
                  c.status === 'Completed' ? "bg-slate-500" : "bg-blue-500"
                )} />
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <p className="font-bold text-[12px] text-white leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {c.title}
                  </p>
                  <span className={cn("text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                    c.urgency === 'Critical' ? "bg-red-500/20 text-red-500" :
                    c.urgency === 'High' ? "bg-orange-500/20 text-orange-500" : "bg-blue-500/20 text-blue-500"
                  )}>{c.urgency}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-medium">
                  <MapPin className="h-3 w-3 text-primary" /> {c.location}
                </div>
              </div>
            ))}
            {filteredData.length === 0 && (
              <div className="py-20 text-center space-y-2 opacity-50">
                <Search className="h-8 w-8 mx-auto text-slate-700" />
                <p className="text-[10px] font-bold uppercase text-slate-600">No matching signals</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Canvas - Simulated Professional UI */}
        <div className="flex-1 h-full relative overflow-hidden bg-slate-950">
          
          {/* Tactical Background Layer */}
          <div className="absolute inset-0 rescue-grid opacity-30 pointer-events-none" />
          <div className="absolute inset-0 opacity-10 pointer-events-none animate-scan-line bg-gradient-to-b from-transparent via-primary/20 to-transparent h-40 w-full" />
          
          {/* Stylized India Tactical Outline */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none scale-125">
             <svg viewBox="0 0 100 100" className="w-[900px] h-[900px] stroke-primary fill-primary/5 stroke-[0.3]">
                <path d="M50,5 L55,8 L62,10 L65,15 L68,22 L75,28 L82,35 L85,45 L82,55 L78,62 L70,75 L62,85 L55,92 L50,95 L45,92 L38,85 L30,75 L22,62 L18,55 L15,45 L18,35 L25,28 L32,22 L35,15 L38,10 L45,8 Z" />
                <circle cx="50" cy="50" r="45" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="30" strokeDasharray="1 5" />
             </svg>
          </div>

          {/* Map Interaction Area */}
          <div className="absolute inset-0" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center', transition: 'transform 0.5s cubic-bezier(0.2, 0, 0, 1)' }}>
            {cases.map(c => {
              const pos = getCoordinates(c);
              const isSelected = selectedCaseId === c.id;
              
              // Colors based on requested mapping
              let markerColor = '#3b82f6'; // Blue = active
              if (c.urgency === 'Critical') markerColor = '#ef4444'; // Red
              if (c.urgency === 'High') markerColor = '#f97316'; // Orange
              if (c.type === 'relief camp') markerColor = '#10b981'; // Green
              if (c.status === 'Completed') markerColor = '#64748b'; // Gray

              return (
                <div key={c.id} className="absolute" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%,-50%)' }}>
                  <div className="relative cursor-pointer group" onClick={() => setSelectedCaseId(c.id)}>
                    
                    {/* Animated Pulse for Critical/High */}
                    {(c.urgency === 'Critical' || c.urgency === 'High' || c.status === 'In Progress') && (
                      <div className="absolute -inset-4 rounded-full border border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
                    )}
                    
                    {/* Tactical Marker */}
                    <div className={cn(
                      "h-4 w-4 rounded-full border-2 border-white shadow-2xl transition-all duration-300 z-10 flex items-center justify-center",
                      isSelected ? "scale-150 ring-4 ring-primary/20" : "group-hover:scale-125"
                    )} style={{ backgroundColor: markerColor }}>
                        <div className="h-1 w-1 rounded-full bg-white" />
                    </div>

                    {/* Quick Info Hover */}
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 rounded-lg px-2 py-1 shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                       <p className="text-[9px] font-bold text-white">{c.title}</p>
                       <p className="text-[7px] text-primary uppercase font-black tracking-widest">{c.location}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact Legend - Professional Positioning */}
          <div className="absolute bottom-6 left-6 z-20">
            <Card className="bg-slate-900/90 backdrop-blur-md border-white/10 rounded-2xl p-4 shadow-2xl space-y-3 w-44">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-1.5">Mission Grid Legend</p>
               <div className="space-y-2">
                  {[
                    { color: '#ef4444', label: 'Critical Alert' },
                    { color: '#f97316', label: 'High Urgency' },
                    { color: '#3b82f6', label: 'Active Mission' },
                    { color: '#10b981', label: 'Relief Camp' },
                    { color: '#64748b', label: 'Mission Closed' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                       <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-[9px] font-bold text-slate-400">{item.label}</span>
                    </div>
                  ))}
               </div>
            </Card>
          </div>

          {/* Mission Details Panel - Sleek Right Position */}
          {selectedCase && (
            <div className="absolute bottom-6 right-6 z-30 w-[320px] max-w-[calc(100vw-80px)] animate-fade-in-up">
              <Card className="bg-slate-900 border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
                <div className="relative z-10 space-y-4">
                   <div className="flex justify-between items-start">
                      <Badge className={cn(
                        "rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase border-none",
                        selectedCase.urgency === 'Critical' ? "bg-red-500 text-white" :
                        selectedCase.urgency === 'High' ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
                      )}>{selectedCase.urgency}</Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={() => setSelectedCaseId(null)}>
                         <RefreshCw className="h-4 w-4 rotate-45" />
                      </Button>
                   </div>

                   <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white leading-tight">{selectedCase.title}</h3>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" /> {selectedCase.location}
                      </p>
                   </div>

                   <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 space-y-1.5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tactical Description</p>
                      <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">{selectedCase.description}</p>
                   </div>

                   <div className="flex gap-2">
                      <Button onClick={() => handleJoinMission(selectedCase.id)} className="flex-1 rounded-xl h-10 teal-gradient text-white font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-transform text-[11px] uppercase tracking-widest">
                         Initiate Response
                      </Button>
                      <Link href={`/dashboard/cases/${selectedCase.id}`}>
                         <Button variant="outline" className="h-10 w-10 rounded-xl border-white/10 text-white hover:bg-white/5">
                            <ArrowRight className="h-3.5 w-3.5" />
                         </Button>
                      </Link>
                   </div>
                </div>
              </Card>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <button onClick={() => setZoomLevel(p => Math.min(p + 0.2, 3))}
                className="h-9 w-9 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all border-b border-white/10">
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setZoomLevel(p => Math.max(p - 0.2, 0.5))}
                className="h-9 w-9 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all">
                <Minus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
