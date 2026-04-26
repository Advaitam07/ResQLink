"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Activity, Waves, Radio, MapPin, Users, AlertTriangle } from "lucide-react";
import { cn } from '@/lib/utils';

export default function EntryScreen() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => router.push('/home'), 800);
  };

  if (!mounted) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out bg-white",
      isExiting ? "opacity-0 scale-105 blur-3xl" : "opacity-100 scale-100 blur-0"
    )}>
      {/* Background grid */}
      <div className="absolute inset-0 rescue-grid opacity-60 pointer-events-none" />

      {/* Radar rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
          <defs>
            <radialGradient id="rg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="35%" fill="url(#rg)" className="animate-pulse-soft" />
          <circle cx="50%" cy="50%" r="28%" fill="none" stroke="#3b82f6" strokeWidth="0.4" strokeDasharray="6,12" className="animate-spin-slow" />
          <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#3b82f6" strokeWidth="0.3" strokeDasharray="3,18" style={{ animation: 'spin-slow 60s linear infinite reverse' }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#3b82f6" strokeWidth="0.2" opacity="0.3" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#3b82f6" strokeWidth="0.2" opacity="0.3" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto gap-10 animate-fade-in-up">

        {/* Logo icon with rescue pulse */}
        <div className="relative">
          <div className="absolute -inset-6 bg-primary/8 rounded-full blur-2xl animate-pulse-soft" />
          <div className="relative p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl">
            {/* Rescue ring */}
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-primary/20 animate-rescue-pulse" />
            <ShieldCheck className="h-14 w-14 text-slate-900 mx-auto" />
            <div className="flex gap-3 justify-center mt-3 opacity-30">
              <Activity className="h-4 w-4 text-primary" />
              <Waves className="h-4 w-4 text-primary" />
              <Radio className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Title — fixed spacing, no overlap */}
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/50">
            Initialization Sequence Active
          </p>
          <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none font-headline">
            ResQLink
          </h1>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
            Neural Response Matrix · Strategic Mission Coordination
          </p>
          <p className="text-sm font-bold text-slate-700">
            Synchronizing Global Recovery Assets.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { icon: MapPin,        label: 'Field Mapping' },
            { icon: Users,         label: 'Volunteer Network' },
            { icon: AlertTriangle, label: 'Crisis Alerts' },
            { icon: Activity,      label: 'Live Sync' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
              <f.icon className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{f.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          onClick={handleEnter}
          className="group h-16 px-16 rounded-full bg-slate-900 text-white font-black text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl border border-slate-800 btn-click"
        >
          <span className="flex items-center gap-3">
            Initialize Deployment
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </span>
        </Button>

        {/* Coordinates */}
        <div className="flex gap-8 text-[9px] font-mono text-slate-300 uppercase tracking-[0.25em]">
          <span>Lat: 34.0522° N</span>
          <span>Lng: 118.2437° W</span>
          <span className="text-teal-400">Status: Optimal</span>
        </div>
      </div>
    </div>
  );
}
