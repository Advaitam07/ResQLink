"use client";

import { ShieldCheck, Zap, MapPin, Users, BarChart3, Bell, Heart, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  { icon: Zap,      label: "Faster emergency coordination",    color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Users,    label: "Better volunteer deployment",       color: "text-blue-500",   bg: "bg-blue-50" },
  { icon: MapPin,   label: "Map-based response tracking",       color: "text-teal-500",   bg: "bg-teal-50" },
  { icon: Bell,     label: "Real-time case visibility",         color: "text-red-500",    bg: "bg-red-50" },
  { icon: BarChart3,label: "Data-driven reporting",             color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Heart,    label: "Community-first disaster support",  color: "text-pink-500",   bg: "bg-pink-50" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fade-in-up pb-20">

      {/* Hero */}
      <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 p-14 text-white">
        {/* Background rescue grid */}
        <div className="absolute inset-0 rescue-grid opacity-20" />
        {/* Radar rings */}
        <div className="absolute top-1/2 right-16 -translate-y-1/2 pointer-events-none">
          {[80, 120, 160].map((s, i) => (
            <div key={i} className="absolute rounded-full border border-primary/20"
              style={{ width: s, height: s, top: -s/2, right: -s/2,
                animation: `emergency-ring ${2 + i * 0.8}s ease-out ${i * 0.4}s infinite` }} />
          ))}
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Disaster Response Platform</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter font-headline leading-tight">
            About ResQLink
          </h1>
          <p className="text-white/70 text-lg font-medium leading-relaxed">
            A disaster response and volunteer coordination platform built to connect urgent needs with fast action.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card rounded-[2.5rem] border-none soft-shadow p-10 space-y-4">
          <div className="p-3 bg-primary/10 rounded-2xl w-fit">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Our Mission</h2>
          <p className="text-slate-500 font-medium leading-relaxed text-sm">
            Our mission is to help communities, NGOs, volunteers, and response teams coordinate faster during emergencies.
            ResQLink turns scattered information into actionable response by connecting cases, volunteers, locations,
            reports, and alerts in one unified platform.
          </p>
        </Card>

        <Card className="glass-card rounded-[2.5rem] border-none soft-shadow p-10 space-y-4">
          <div className="p-3 bg-teal-50 rounded-2xl w-fit">
            <ShieldCheck className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold font-headline">What is ResQLink?</h2>
          <p className="text-slate-500 font-medium leading-relaxed text-sm">
            ResQLink is a disaster management and rescue coordination system that helps teams identify urgent cases,
            track locations, assign volunteers, monitor active missions, and generate response reports — all in real time.
          </p>
        </Card>
      </div>

      {/* Key Features */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Platform Capabilities</p>
          <h2 className="text-3xl font-black tracking-tighter font-headline text-slate-900">Why ResQLink?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Card key={i} className="border-none shadow-sm rounded-2xl p-6 hover-lift group">
              <div className={cn("p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform", f.bg)}>
                <f.icon className={cn("h-5 w-5", f.color)} />
              </div>
              <p className="font-bold text-sm text-slate-800">{f.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "14,820", label: "Mission Nodes" },
            { value: "1.2s",   label: "Sync Latency" },
            { value: "98%",    label: "Asset Match Rate" },
            { value: "100M+",  label: "People Supported" },
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl font-black tracking-tighter text-slate-900">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center space-y-2 pb-4">
        <div className="flex items-center justify-center gap-2">
          <div className="p-2 bg-slate-900 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 font-headline">ResQLink</span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Built for communities. Powered by coordination. Driven by purpose.
        </p>
      </div>
    </div>
  );
}
