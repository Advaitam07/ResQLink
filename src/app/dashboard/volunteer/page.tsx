
"use client";

import { useStore, type Case } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle2, 
  Play, 
  MapPin, 
  Tag, 
  Calendar,
  AlertCircle,
  Bell,
  Clock,
  Briefcase,
  Star,
  Activity,
  Waves,
  Zap,
  Radio
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export default function VolunteerDashboard() {
  const { cases, saveCases, currentUser } = useStore();

  const myTasks = cases.filter(c => c.assignedTo === currentUser?.id);
  const activeTasks = myTasks.filter(c => c.status === 'In Progress');
  const pendingTasks = myTasks.filter(c => c.status === 'Open');
  const completedTasks = myTasks.filter(c => c.status === 'Completed');

  const updateStatus = (caseId: string, newStatus: Case['status']) => {
    const updatedCases = cases.map(c => 
      c.id === caseId ? { 
        ...c, 
        status: newStatus,
        updates: [
          ...c.updates, 
          { 
            timestamp: new Date().toISOString(), 
            note: `Field operative reported status change to: ${newStatus}`, 
            user: currentUser?.name || 'Volunteer' 
          }
        ]
      } : c
    );
    saveCases(updatedCases);
  };

  return (
    <div className="space-y-8 relative">
      {/* Recovery Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0">
        <div className="absolute top-40 left-10 animate-wave">
          <Waves size={180} />
        </div>
        <div className="absolute bottom-40 right-10 animate-tower-signal">
          <Radio size={140} />
        </div>
      </div>

      {/* Volunteer Welcome Header */}
      <div className="flex items-center justify-between teal-gradient p-8 rounded-[2.5rem] text-white shadow-2xl shadow-teal-900/10 relative z-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Field Deployment Hub</h1>
          <p className="text-sm text-white/80 font-medium tracking-wide">Operative: {currentUser?.name || 'Val'} // Profile: {currentUser?.skills?.join(', ') || 'Generalist'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full hover:bg-white/30 cursor-pointer transition-all backdrop-blur-md">
            <Bell className="h-6 w-6" />
          </div>
          <Link href="/dashboard/profile">
            <Avatar className="h-14 w-14 border-2 border-white/50 shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <AvatarImage src={`https://picsum.photos/seed/${currentUser?.id || 'volunteer'}/100/100`} />
              <AvatarFallback>V</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
          { label: 'Active Missions', value: activeTasks.length, icon: Activity, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Pending Deployment', value: pendingTasks.length, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Missions Completed', value: completedTasks.length, icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card rounded-[2.5rem] border-none soft-shadow group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="pt-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-4xl font-bold tracking-tighter text-slate-900">{stat.value}</h3>
                </div>
                <div className={cn("p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-sm", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline">Assigned Operations</h2>
            <div className="flex gap-2 bg-white/40 p-1 rounded-xl glass-card">
              <Button size="sm" variant="ghost" className="rounded-lg h-8 text-[10px] font-bold uppercase tracking-widest bg-white shadow-sm">Current</Button>
              <Button size="sm" variant="ghost" className="rounded-lg h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Archive</Button>
            </div>
          </div>

          {myTasks.length === 0 ? (
            <div className="py-24 text-center space-y-4 glass-card rounded-[3rem] border-none soft-shadow">
              <div className="bg-slate-50 p-6 rounded-full w-fit mx-auto">
                <Calendar className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-headline">No Active Deployments</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">Your sector is currently clear. Await mission briefing from your coordinator.</p>
              </div>
              <Button variant="outline" className="rounded-2xl border-primary/20 text-primary font-bold">Contact Mission Control</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTasks.map((task) => (
                <Card key={task.id} className="glass-card rounded-[2.5rem] border-none soft-shadow flex flex-col h-full overflow-hidden hover:scale-[1.01] transition-transform">
                  <CardHeader className="pb-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-bold uppercase border-none",
                        task.urgency === 'High' ? "bg-red-500 text-white" : "bg-amber-100 text-amber-600"
                      )}>{task.urgency} Priority</Badge>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                         <div className={cn(
                           "h-1.5 w-1.5 rounded-full",
                           task.status === 'In Progress' ? "bg-primary animate-pulse" : "bg-teal-500"
                         )} />
                         <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-tighter">{task.status}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold font-headline">{task.title}</CardTitle>
                      <CardDescription className="line-clamp-2 font-medium">{task.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4 pt-4 border-t border-slate-100/50">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-primary" /> {task.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Tag className="h-3.5 w-3.5 text-primary" /> {task.category}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/50 p-6 gap-3">
                    {task.status !== 'Completed' ? (
                      <>
                        {task.status === 'Open' ? (
                          <Button 
                            className="flex-1 teal-gradient text-white font-bold h-12 rounded-2xl shadow-xl shadow-teal-500/10"
                            onClick={() => updateStatus(task.id, 'In Progress')}
                          >
                            <Play className="mr-2 h-4 w-4" /> Start Mission
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold h-12 rounded-2xl shadow-xl shadow-teal-500/10"
                            onClick={() => updateStatus(task.id, 'Completed')}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Finalize Operation
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 text-teal-600 font-bold py-3 bg-teal-50 rounded-2xl text-xs uppercase tracking-widest">
                         <CheckCircle2 className="h-5 w-5" /> Operation Success
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <Card className="glass-card rounded-[3rem] border-none soft-shadow p-8">
              <CardHeader className="p-0 mb-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold font-headline">Intelligence Sync</CardTitle>
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {[
                  { title: 'New Sector Order', desc: 'Medical supply run added.', time: '5m ago' },
                  { title: 'Protocol Sync', desc: 'New safety standards updated.', time: '1h ago' },
                  { title: 'Team Comm', desc: 'Coordinator Priya sent a memo.', time: '3h ago' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary/5 transition-colors">
                      <Clock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-[11px] font-medium text-muted-foreground">{item.desc}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase pt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <Button variant="ghost" className="w-full mt-8 rounded-2xl h-12 text-primary font-bold hover:bg-primary/5">View Communication Logs</Button>
           </Card>

           <div className="bg-primary/5 rounded-[3rem] p-10 text-center space-y-4 relative overflow-hidden group">
              <Activity className="h-16 w-16 text-primary mx-auto opacity-40 group-hover:scale-110 transition-transform" />
              <div className="space-y-1">
                <h3 className="font-bold text-lg font-headline">Safety Protocol</h3>
                <p className="text-xs text-muted-foreground px-4 font-medium">Always sync your field location with mission control every 2 hours.</p>
              </div>
              <Button className="w-full rounded-2xl teal-gradient text-white h-11 font-bold">Acknowledge</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
