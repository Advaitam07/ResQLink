
"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { caseAPI, userAPI, reportAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Activity, 
  Settings,
  MoreVertical,
  UserPlus,
  ArrowUpRight,
  Bell,
  Radio,
  Waves
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';

const chartConfig = {
  count: {
    label: "Throughput",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Simple Count-Up Hook for Stats
const useCountUp = (target: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

export default function AdminDashboard() {
  const { users, cases, currentUser, refreshCases, refreshUsers } = useStore();
  const [stats, setStats] = useState({ totalUsers: 0, totalCases: 0, activeCases: 0, completedCases: 0 });
  const userCount = useCountUp(stats.totalUsers || users.length);
  const caseCount = useCountUp(stats.totalCases || cases.length);

  useEffect(() => {
    // Fetch stats from API
    caseAPI.getStats()
      .then(res => {
        if (res.success && res.data) {
          setStats(res.data as any);
        }
      })
      .catch(() => {
        // Fallback to local data
        setStats({
          totalUsers: users.length,
          totalCases: cases.length,
          activeCases: cases.filter(c => c.status === 'In Progress').length,
          completedCases: cases.filter(c => c.status === 'Completed').length,
        });
      });
  }, [users.length, cases.length]);

  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 9 },
    { name: 'Sat', count: 6 },
    { name: 'Sun', count: 8 },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up relative">
      {/* Recovery Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <div className="absolute top-20 left-1/2 animate-tower-signal">
          <Radio size={250} />
        </div>
        <div className="absolute bottom-10 right-10 animate-wave">
          <Waves size={180} />
        </div>
      </div>

      {/* Admin Header with Shimmer Sweep */}
      <div className="flex items-center justify-between teal-gradient p-8 rounded-[2rem] text-white shadow-xl shadow-teal-900/10 relative overflow-hidden group z-10">
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl font-bold tracking-tight">System Governance</h1>
          <p className="text-xs text-white/80 font-medium tracking-wide">Identity: Admin Protocol {currentUser?.name || 'Alice'} // System Status: Optimal</p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-2.5 bg-white/20 rounded-full hover:bg-white/30 cursor-pointer transition-all backdrop-blur-md relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-orange-500 rounded-full border-2 border-teal-600 animate-pulse-soft" />
          </div>
          <Link href="/dashboard/profile">
            <Avatar className="h-11 w-11 border-2 border-white/50 shadow-sm transition-transform hover:scale-110 cursor-pointer">
              <AvatarImage src={`https://picsum.photos/seed/${currentUser?.id || 'admin'}/100/100`} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {[
          { label: 'Active Nodes', value: userCount, icon: Users, change: '+12%', color: 'text-primary' },
          { label: 'Live Operations', value: caseCount, icon: Activity, change: '+5.4%', color: 'text-primary' },
          { label: 'Integrity Rate', value: '98%', icon: ShieldCheck, change: '+0.1%', color: 'text-teal-600' },
          { label: 'Sync Status', value: 'Optimal', icon: BarChart3, change: 'Stable', color: 'text-primary' },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl group hover-lift overflow-hidden tactical-mesh">
            <CardContent className="pt-6 pb-6 px-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl bg-slate-50 transition-colors group-hover:bg-white", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                  <ArrowUpRight className="h-3 w-3" /> {stat.change}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight text-slate-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl p-6 hover-lift glass-card">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-bold">Network Throughput (7D)</CardTitle>
            <CardDescription className="text-xs font-medium">Operational data flow across active mission sectors.</CardDescription>
          </CardHeader>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
               <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
               </BarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl p-6 hover-lift glass-card">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-bold">Protocol Health</CardTitle>
            <CardDescription className="text-xs font-medium">Real-time system integrity metrics.</CardDescription>
          </CardHeader>
          <div className="space-y-4">
             {[
               { node: 'Central Archive', status: 'Active', color: 'text-teal-600', bg: 'bg-teal-50' },
               { node: 'AI Reasoning Engine', status: 'Optimal', color: 'text-primary', bg: 'bg-primary/5' },
               { node: 'Field Alert Mesh', status: 'Secure', color: 'text-teal-600', bg: 'bg-teal-50' },
               { node: 'Auth Protocol Hub', status: 'Optimal', color: 'text-primary', bg: 'bg-primary/5' },
             ].map((node) => (
               <div key={node.node} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0 group/node cursor-default">
                  <span className="text-sm font-bold text-slate-700 transition-colors group-hover/node:text-primary">{node.node}</span>
                  <Badge variant="outline" className={cn("rounded-full border-none px-3 py-0.5 font-bold text-[9px] uppercase tracking-tighter transition-all group-hover/node:scale-105", node.bg, node.color)}>{node.status}</Badge>
               </div>
             ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">User Identity Matrix</h2>
            <p className="text-xs text-slate-500 font-medium">Manage and authorize active assets within the system.</p>
          </div>
          <Button className="teal-gradient text-white rounded-xl h-10 px-5 font-bold shadow-lg shadow-teal-500/20 interactive-button">
            <UserPlus className="mr-2 h-4 w-4" /> Authorize Asset
          </Button>
        </div>
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden glass-card">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Identity</TableHead>
                <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Access Profile</TableHead>
                <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Designation</TableHead>
                <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Capabilities</TableHead>
                <TableHead className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="hover:bg-slate-50/50 transition-colors border-none h-14 group">
                  <TableCell className="px-6 font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">{u.name}</TableCell>
                  <TableCell className="text-slate-500 text-xs font-medium">{u.email}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg capitalize px-2.5 py-0.5 text-[9px] font-bold border-none transition-all group-hover:scale-105",
                      u.role === 'admin' ? "bg-primary/10 text-primary" :
                      u.role === 'coordinator' ? "bg-teal-100 text-teal-600" :
                      "bg-amber-100 text-amber-600"
                    )} variant="outline">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{u.skills?.join(', ') || 'System Override'}</TableCell>
                  <TableCell className="text-right px-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary shadow-sm interactive-button">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
