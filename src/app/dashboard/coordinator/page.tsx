
"use client";

import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  FileText, 
  BellRing, 
  UserCheck, 
  CheckCircle,
  Edit2,
  Clock,
  User,
  ChevronRight,
  Plus,
  Waves,
  Zap,
  Activity,
  Radio
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function CoordinatorDashboard() {
  const { cases, currentUser, users, notifications, markNotificationRead } = useStore();
  const { toast } = useToast();

  const urgentCases = cases.filter(c => c.urgency === 'Critical' || c.urgency === 'High' || c.status === 'Open').slice(0, 6);
  const totalCases = cases.length;
  const assignedCount = cases.filter(c => c.assignedTo).length;
  const completedCount = cases.filter(c => c.status === 'Completed').length;
  const urgentCount = cases.filter(c => c.urgency === 'Critical' || c.urgency === 'High').length;

  const stats = [
    { label: 'Total Cases', value: totalCases, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', href: '/dashboard/cases' },
    { label: 'Urgent Cases', value: urgentCount, icon: BellRing, color: 'text-orange-600', bg: 'bg-orange-50', href: '/dashboard/cases' },
    { label: 'Assigned', value: assignedCount, icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-50', href: '/dashboard/cases' },
    { label: 'Completed', value: completedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', href: '/dashboard/cases' },
  ];

  const handleNotificationClick = () => {
    toast({ title: "Intelligence Sync", description: "All mission nodes are currently optimal." });
  };

  const communityImage = PlaceHolderImages.find(img => img.id === 'community-unity');

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up relative">
      {/* Recovery Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute top-20 right-10 animate-wave">
          <Waves size={200} />
        </div>
        <div className="absolute bottom-20 left-10 animate-pulse-soft">
          <Zap size={150} />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-tower-signal">
          <Radio size={120} />
        </div>
      </div>

      <div className="flex items-center justify-between teal-gradient p-6 rounded-2xl text-white shadow-sm relative z-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Coordinator Dashboard</h1>
          <p className="text-xs text-white/80 font-medium">Hello {currentUser?.name.split(' ')[0] || 'Priya'}, you have {urgentCount} urgent cases pending.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10 relative" onClick={handleNotificationClick}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-orange-500 rounded-full border-2 border-teal-600" />
          </Button>
          <Link href="/dashboard/profile">
            <Avatar className="h-10 w-10 border border-white/20 shadow-sm cursor-pointer hover:scale-105 transition-transform">
              <AvatarImage src={`https://picsum.photos/seed/${currentUser?.id || 'priya'}/100/100`} />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      <Card className="rounded-2xl border-none shadow-sm overflow-hidden group relative z-10">
        <div className="relative h-[240px] w-full">
          <Image src={communityImage?.imageUrl || "https://picsum.photos/seed/unity/1200/800"} alt="Community Unity" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-slate-900/40 flex items-center p-10">
            <div className="max-w-md space-y-3">
              <Badge className="bg-teal-500/90 text-white border-none px-3 py-0.5 rounded-full text-[10px] font-bold uppercase">Community Impact</Badge>
              <h2 className="text-2xl font-bold text-white font-headline">Unity in Action</h2>
              <p className="text-white/90 text-xs font-medium leading-relaxed line-clamp-2">Connecting community needs with skilled volunteers in real-time. Witness the power of coordinated efforts.</p>
              <Link href="/dashboard/ai-insights">
                <Button size="sm" className="bg-white text-slate-900 font-bold rounded-lg hover:bg-white/90 px-5">View Intelligence Story</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all cursor-pointer tactical-mesh">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl p-6 glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Urgent Missions</h2>
            <Link href="/dashboard/coordinator/add-case">
              <Button size="sm" className="rounded-xl font-bold h-9">
                <Plus className="h-4 w-4 mr-2" /> New Case
              </Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">ID</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">Protocol</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">Priority</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">Operative</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urgentCases.map((c) => {
                const volunteer = users.find(u => u.id === c.assignedTo);
                return (
                  <TableRow key={c.id} className="border-none hover:bg-slate-50 transition-colors group h-14">
                    <TableCell className="font-bold text-xs text-blue-600">#{String(c.id).slice(-4)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{c.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{c.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase border-none",
                        c.urgency === 'Critical' ? "bg-red-500 text-white" : 
                        c.urgency === 'High' ? "bg-orange-500 text-white" : 
                        "bg-blue-500 text-white"
                      )}>{c.urgency}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://picsum.photos/seed/${volunteer?.id || 'none'}/100/100`} />
                          <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-slate-500">{volunteer?.name.split(' ')[0] || 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/cases/${c.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white hover:text-blue-600 shadow-sm"><Edit2 className="h-3.5 w-3.5" /></Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-4 text-center">
             <Link href="/dashboard/cases">
                <Button variant="ghost" size="sm" className="text-xs text-slate-400 font-bold hover:text-blue-600">
                  View All Missions <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
             </Link>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl p-6 flex flex-col glass-card relative overflow-hidden">
          <Activity className="absolute -bottom-10 -right-10 h-32 w-32 text-primary opacity-5 animate-pulse-soft" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Intelligence Feed</h2>
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
            {notifications.slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group" onClick={() => markNotificationRead(item.id)}>
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", 
                  item.type === 'case' ? "bg-blue-50 text-blue-600" : 
                  item.type === 'volunteer' ? "bg-teal-50 text-teal-600" :
                  item.type === 'urgent' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                )}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex justify-between items-center">
                    <p className={cn("text-sm font-bold", item.isRead ? "text-slate-500" : "text-slate-900")}>{item.title}</p>
                    <span className="text-[10px] text-slate-400"><Clock className="h-2.5 w-2.5 inline mr-1" /> {item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/reports">
            <Button variant="outline" className="w-full mt-6 rounded-xl border-slate-100 text-slate-500 font-bold h-10 hover:bg-slate-50 hover:text-slate-900">Full Archive</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
