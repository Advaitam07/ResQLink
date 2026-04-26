
"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { userAPI, caseAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Briefcase, 
  Activity, 
  Calendar,
  Settings,
  Star,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { currentUser, cases, refreshCases } = useStore();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    // Fetch user stats from API
    const fetchStats = async () => {
      try {
        const res = await caseAPI.getStats();
        if (res.success && res.data) {
          setUserStats(res.data as any);
        }
      } catch {
        // Fallback to local calculation
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!currentUser) return null;

  const userMissions = cases.filter(c => c.assignedTo === currentUser.id);
  const completedMissions = userMissions.filter(c => c.status === 'Completed').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tighter font-headline">Operative Profile</h1>
          <p className="text-sm text-slate-500 font-medium">Digital identity and field service credentials.</p>
        </div>
        <Link href="/dashboard/settings">
          <Button variant="outline" className="rounded-xl font-bold gap-2">
            <Settings className="h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card rounded-[2.5rem] border-none soft-shadow overflow-hidden text-center p-8">
            <div className="relative mx-auto w-32 h-32 mb-6 group">
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
              <Avatar className="w-full h-full border-4 border-white shadow-xl relative z-10">
                <AvatarImage src={`https://picsum.photos/seed/${currentUser.id}/200/200`} />
                <AvatarFallback className="text-2xl font-bold">{currentUser.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{currentUser.name}</h2>
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                {currentUser.role} Operative
              </Badge>
            </div>
            <div className="mt-8 space-y-4 text-left border-t border-slate-100 pt-8">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <Mail className="h-4 w-4 text-primary" /> {currentUser.email}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <MapPin className="h-4 w-4 text-primary" /> {currentUser.location || 'Central Sector'}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <ShieldCheck className="h-4 w-4 text-primary" /> Clearance: Level 4
              </div>
            </div>
          </Card>

          <Card className="glass-card rounded-[2.5rem] border-none soft-shadow p-8 space-y-4">
             <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Capabilities</h3>
             <div className="flex flex-wrap gap-2">
                {currentUser.skills?.map(skill => (
                  <Badge key={skill} className="bg-slate-100 text-slate-600 border-none rounded-lg px-3 py-1 text-[10px] font-bold">
                    {skill}
                  </Badge>
                )) || <p className="text-xs italic text-slate-400">No skills registered</p>}
             </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Deployments', value: userMissions.length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Successful Missions', value: completedMissions, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
                { label: 'System Rating', value: '4.9/5', icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl p-6 flex flex-col items-center text-center space-y-2">
                   <div className={cn("p-3 rounded-xl mb-2", stat.bg)}>
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-2xl font-bold">{stat.value}</p>
                </Card>
              ))}
           </div>

           <Card className="glass-card rounded-[2.5rem] border-none soft-shadow p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-headline">Mission Timeline</h3>
                <Activity className="h-5 w-5 text-primary opacity-20" />
              </div>
              <div className="space-y-6">
                 {userMissions.length > 0 ? userMissions.map((task) => (
                   <div key={task.id} className="flex gap-4 p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all border border-transparent hover:border-slate-100">
                      <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                         <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-sm">{task.title}</p>
                          <Badge variant="outline" className="rounded-full text-[8px] font-bold uppercase">{task.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>
                 )) : (
                   <div className="py-12 text-center space-y-2">
                      <Clock className="h-8 w-8 text-slate-200 mx-auto" />
                      <p className="text-sm font-bold text-slate-400">No mission activity recorded</p>
                   </div>
                 )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
