'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  MapPin,
  Target,
  Activity,
  Globe,
  Zap,
  Clock,
  Radio,
  ArrowUpRight,
  Cpu,
} from "lucide-react";
import { cn } from '@/lib/utils';
import { Card } from "@/components/ui/card";
import { useStore } from '@/lib/store';

function TopAwarenessStrip() {
  const messages = [
    { icon: AlertTriangle, text: <>Global fatality index: <span className="text-accent font-bold">26,000+</span> annually due to climate volatility</> },
    { icon: Globe, text: <>Affected population: <span className="text-primary font-bold">100M+</span> requiring emergency synchronization</> },
    { icon: Zap, text: <>System latency reduction saves lives in critical sectors</> },
    { icon: Clock, text: <>Operational response velocity is the primary recovery metric</> },
  ];

  return (
    <div className="w-full bg-slate-950 text-white/60 h-10 flex items-center overflow-hidden border-b border-white/5 z-[110] relative">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {[...messages, ...messages].map((msg, i) => (
          <div key={i} className="flex items-center gap-2 px-12 text-[9px] font-bold tracking-[0.2em] uppercase">
            <msg.icon className="h-3 w-3 text-primary" />
            <span>{msg.text}</span>
            <div className="h-1 w-1 rounded-full bg-white/20 mx-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

const RealisticGlobe = () => (
  <div className="relative h-[300px] w-[300px] md:h-[450px] md:w-[450px] flex items-center justify-center group">
    {/* Atmosphere Glow */}
    <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] animate-pulse-soft opacity-40 group-hover:opacity-60 transition-opacity" />
    
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_80px_rgba(59,130,246,0.15)]">
      <defs>
        <radialGradient id="globeDeep" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="85%" stopColor="#d1d5db" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f3f4f6" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id="globeLight" cx="30%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <pattern id="continentPattern" x="0" y="0" width="200" height="100" patternUnits="userSpaceOnUse">
           <g fill="#3b82f6" fillOpacity="0.3" className="animate-marquee-slow">
              <path d="M10,20 Q20,10 35,25 T55,15 T75,30 T40,55 T10,20 Z" />
              <path d="M65,45 Q80,35 85,50 T70,70 T55,55 Z" />
              <path d="M110,20 Q120,10 135,25 T155,15 T175,30 T140,55 T110,20 Z" />
              <path d="M165,45 Q180,35 185,50 T170,70 T155,55 Z" />
           </g>
        </pattern>
        <clipPath id="globeClip">
          <circle cx="50%" cy="50%" r="48" />
        </clipPath>
      </defs>
      
      {/* Base Sphere */}
      <circle cx="50%" cy="50%" r="48" fill="url(#globeDeep)" stroke="rgba(0,0,0,0.05)" strokeWidth="0.2" />
      
      {/* Rotating Continents */}
      <circle cx="50%" cy="50%" r="48" fill="url(#continentPattern)" clipPath="url(#globeClip)" />
      
      {/* Tactical Grid Overlay */}
      <g clipPath="url(#globeClip)" className="opacity-[0.3]">
        {[...Array(9)].map((_, i) => (
          <ellipse key={`lat-${i}`} cx="50%" cy="50%" rx={i * 11} ry="48" fill="none" stroke="#3b82f6" strokeWidth="0.1" />
        ))}
        {[...Array(9)].map((_, i) => (
          <line key={`lon-${i}`} x1="0" y1={i * 11 + 5} x2="100" y2={i * 11 + 5} stroke="#3b82f6" strokeWidth="0.05" />
        ))}
      </g>

      {/* Atmospheric Highlight */}
      <circle cx="50%" cy="50%" r="48" fill="url(#globeLight)" pointerEvents="none" />
      
      {/* Orbit Rings */}
      <circle cx="50%" cy="50%" r="49.5" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="0.1" className="animate-spin-slow" />
    </svg>
    
    {/* Floating HUD Points — fixed z-index and positioning */}
    <div className="absolute top-1/4 left-2 bg-white border border-slate-200 p-3 rounded-2xl shadow-md animate-float-subtle z-20">
       <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-primary">Live Node #442</span>
       </div>
    </div>
    <div className="absolute bottom-1/4 right-2 bg-white border border-slate-200 p-3 rounded-2xl shadow-md animate-float-subtle z-20" style={{ animationDelay: '1s' }}>
       <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-accent">Active Sync</span>
       </div>
    </div>
  </div>
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const { currentUser } = useStore();

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimerValue(prev => (prev + 1) % 3600);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-40 pb-20 animate-fade-in-up bg-white">
      <section className="relative min-h-[100vh] flex flex-col pt-0 bg-white overflow-hidden">
        {/* Rescue grid background */}
        <div className="absolute inset-0 rescue-grid opacity-40 pointer-events-none" />
        <TopAwarenessStrip />

        {/* Hero Section */}
        <div className="flex-1 max-w-7xl mx-auto px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10 py-32">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-full border border-primary/10">
                 <Cpu className="h-4 w-4 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Intelligence Engine</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] font-headline text-slate-900">
                ResQLink <br />
                <span className="text-primary italic">Universal</span> <br />Sync.
              </h1>
              <p className="text-2xl font-bold text-slate-500 tracking-tight leading-snug max-w-xl">
                The strategic backbone for NGO coordination. Connecting community needs with zero-latency resource synchronization.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <Link href={currentUser ? `/dashboard/${currentUser.role}` : "/login"}>
                <Button className="bg-primary hover:bg-slate-900 text-white font-black h-16 px-14 rounded-full shadow-2xl shadow-primary/30 flex items-center gap-3 transition-transform hover:scale-105 text-[11px] uppercase tracking-[0.3em] btn-click">
                  Initialize Network <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="outline" className="border-slate-200 bg-white/60 text-slate-900 font-black h-16 px-14 rounded-full hover:bg-slate-50 transition-all backdrop-blur-md text-[11px] uppercase tracking-[0.3em] btn-click">
                  Field Map
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <RealisticGlobe />
          </div>
        </div>
      </section>

      {/* Feature Grid: Sector Analysis */}
      <section className="max-w-7xl mx-auto px-12 space-y-20 bg-white">
         <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Operational Ecosystem</p>
            <h2 className="text-5xl font-black tracking-tighter font-headline text-slate-900">Sector Intelligence Matrix</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: 'Medical Readiness', desc: 'Real-time synchronization of medical assets and emergency clinical needs.', color: 'text-teal-600', bg: 'bg-teal-50' },
              { icon: Zap, title: 'Logistics Velocity', desc: 'Predictive routing for supply chains ensuring zero-waste resource delivery.', color: 'text-primary', bg: 'bg-primary/5' },
              { icon: Users, title: 'Asset Matching', desc: 'AI-driven coordination between volunteer skills and specific community requirements.', color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map((feature, i) => (
              <Card key={i} className="rounded-[2.5rem] border border-slate-100 shadow-sm p-10 group hover-lift bg-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className={cn("p-5 rounded-3xl w-fit", feature.bg)}>
                       <feature.icon className={cn("h-8 w-8", feature.color)} />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">{feature.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                    <Link href="/dashboard/ai-insights" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-4 transition-all">
                       View Analysis <ArrowRight className="h-4 w-4" />
                    </Link>
                 </div>
                 <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                    <feature.icon size={200} />
                 </div>
              </Card>
            ))}
         </div>
      </section>

      {/* Strategic Intelligence Section - Restored to White/Light Theme */}
      <section className="max-w-7xl mx-auto px-12 pb-40">
        <div className="bg-slate-50 rounded-[4rem] border border-slate-100 p-20 relative overflow-hidden text-slate-900 shadow-xl">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 h-[1px] w-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full animate-pulse-radar" />
           </div>

           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-7 space-y-16">
                 <div className="space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
                       <Radio className="h-4 w-4 text-primary animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Response Protocol</span>
                    </div>
                    <h2 className="text-6xl md:text-7xl font-black tracking-tighter font-headline leading-[0.9] text-slate-900">Universal Mission <br /><span className="text-primary italic">Synchronization</span></h2>
                    <p className="text-slate-500 text-xl font-medium max-w-xl leading-relaxed">
                       Our intelligence matrix aggregates crisis signatures across active mission sectors, monitoring live field assets with zero-latency precision.
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-4">
                    <div className="space-y-4 group">
                       <div className="flex items-center gap-2">
                          <p className="text-7xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">14,820</p>
                          <ArrowUpRight className="h-10 w-10 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                         <Target className="h-4 w-4" /> Managed Mission Nodes
                       </p>
                    </div>
                    <div className="space-y-4 group">
                       <p className="text-7xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">1.2s</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                         <Zap className="h-4 w-4" /> Network Sync Latency
                       </p>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-5 flex justify-center relative">
                 <div className="w-[400px] h-[400px] rounded-full bg-white border border-slate-200 flex flex-col items-center justify-center relative shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-40" />
                    <div className="relative z-10 text-center space-y-4">
                       <div className="p-4 bg-primary/5 rounded-2xl w-fit mx-auto border border-primary/10">
                          <Clock className="h-8 w-8 text-primary animate-spin-slow" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Network Heartbeat</p>
                          <div className="text-8xl font-black tracking-tighter font-mono tabular-nums text-slate-900">
                             {formatTime(timerValue)}
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] pt-4">Since Last Tactical Sync</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Live Emergency Dashboard */}
      <section className="max-w-7xl mx-auto px-12 pb-40">
        <div className="relative rounded-[4rem] border border-white/10 overflow-hidden">
          {/* Background - subtle and smooth */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Soft ambient glow - no harsh pulsing */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[150px]" />
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="relative z-10 px-12 py-24 space-y-16">
            {/* Heading */}
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter font-headline text-white">
                Real-Time Crisis Intelligence
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Stay informed. Act faster. Save lives with live data and AI insights.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: MapPin, 
                  title: 'Live Incident Map', 
                  desc: 'Track real-time emergencies and affected zones with precision.',
                  button: 'Open Map',
                  href: '/map'
                },
                { 
                  icon: Cpu, 
                  title: 'AI Emergency Assistant', 
                  desc: 'Instant guidance, rescue protocols, and smart suggestions.',
                  button: 'Ask AI',
                  href: '/dashboard/ai-insights'
                },
                { 
                  icon: AlertTriangle, 
                  title: 'Alert Broadcast System', 
                  desc: 'Send and receive emergency alerts instantly across regions.',
                  button: 'View Alerts',
                  href: '/dashboard/reports'
                },
              ].map((card, i) => (
                <div 
                  key={i}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-orange-500/10 w-fit border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                      <card.icon className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{card.desc}</p>
                    <Link href={card.href}>
                      <button className="px-6 py-3 rounded-full border border-orange-500/50 text-orange-500 font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                        {card.button}
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center space-y-8 pt-8">
              <p className="text-2xl font-bold text-white tracking-tight">
                Be Prepared Before Disaster Strikes
              </p>
              <Link href={currentUser ? `/dashboard/${currentUser.role}` : "/login"}>
                <button className="px-12 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-[0.3em] rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-12 text-center space-y-12 pb-20 bg-white">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-slate-900 p-3 rounded-2xl">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <span className="font-black text-4xl tracking-tighter text-slate-900 font-headline uppercase">ResQLink</span>
        </div>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.5em]">Copyright © 2024 ResQLink Strategic Intelligence. All Rights Reserved.</p>
        <div className="flex justify-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
           <Link href="#" className="hover:text-primary transition-colors">Mission Roadmap</Link>
           <Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link>
           <Link href="#" className="hover:text-primary transition-colors">Network Terms</Link>
        </div>
      </footer>
    </div>
  );
}
