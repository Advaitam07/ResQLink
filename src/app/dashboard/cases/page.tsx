
"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { caseAPI } from '@/lib/api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Eye, 
  MapPin, 
  Edit2, 
  Trash2, 
  User, 
  ListFilter,
  Plus,
  Loader2
} from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function CasesPage() {
  const { cases, users, saveCases, refreshCases } = useStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'Critical' | 'High' | 'Medium' | 'Low'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to refresh from API on mount
    refreshCases().catch(() => {
      // Fallback to local data if API fails
    });
  }, [refreshCases]);

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUrgency = urgencyFilter === 'all' || c.urgency === urgencyFilter;
    
    return matchesSearch && matchesUrgency;
  });

  const handleDeleteCase = async (id: string) => {
    setLoading(true);
    try {
      await caseAPI.delete(id);
      await refreshCases();
      toast({
        variant: "destructive",
        title: "Case Deleted",
        description: "Mission protocol has been removed from the directory.",
      });
    } catch (error) {
      // Fallback to local delete if API fails
      const updatedCases = cases.filter(c => c.id !== id);
      saveCases(updatedCases);
      toast({
        variant: "destructive",
        title: "Case Deleted",
        description: "Mission protocol has been removed from the directory.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUrgencyFilter = () => {
    const order: Array<'all' | 'Critical' | 'High' | 'Medium' | 'Low'> = ['all', 'Critical', 'High', 'Medium', 'Low'];
    const next = order[(order.indexOf(urgencyFilter) + 1) % order.length];
    setUrgencyFilter(next);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Case Management</h1>
          <p className="text-sm text-slate-500 font-medium">Directory of all community service protocols.</p>
        </div>
        <Link href="/dashboard/coordinator/add-case">
          <Button className="bg-slate-900 text-white rounded-xl h-10 px-5 font-bold shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> New Case
          </Button>
        </Link>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by mission, sector or capability..." 
            className="pl-12 h-11 bg-white border-slate-200 rounded-xl focus-visible:ring-primary/10 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={toggleUrgencyFilter}
          className="h-11 px-5 border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 shadow-sm"
        >
          <ListFilter className="mr-2 h-4 w-4" /> 
          Urgency: <span className="ml-1 capitalize text-primary">{urgencyFilter}</span>
        </Button>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden glass-card">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Mission Details</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Urgency</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Operative</TableHead>
              <TableHead className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((c) => {
              const assignedUser = users.find(u => u.id === c.assignedTo);
              return (
                <TableRow key={c.id} className="border-none hover:bg-slate-50/50 transition-colors group h-16">
                  <TableCell className="px-6 font-semibold text-xs text-slate-400">
                    #{String(c.id).slice(-4)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-slate-900">{c.title}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <MapPin className="h-2.5 w-2.5" /> {c.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-slate-500">{c.category}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase border-none",
                      c.urgency === 'Critical' ? "bg-red-500 text-white" : 
                      c.urgency === 'High' ? "bg-orange-500 text-white" : 
                      c.urgency === 'Medium' ? "bg-blue-500 text-white" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {c.urgency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        c.status === 'Open' ? "bg-blue-600 animate-pulse" :
                        (c.status === 'In Progress' || c.status === 'Active') ? "bg-orange-500" :
                        "bg-green-600"
                      )} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{c.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {assignedUser ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-white">
                          <AvatarImage src={`https://picsum.photos/seed/${assignedUser.id}/100/100`} />
                          <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-slate-500">{assignedUser.name.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] italic text-slate-300">Standalone</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/cases/${c.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary shadow-sm"><Eye className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Link href={`/dashboard/cases/${c.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white hover:text-primary shadow-sm"><Edit2 className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteCase(c.id)}
                        className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredCases.length === 0 && (
          <div className="py-20 text-center space-y-2">
            <Search className="h-8 w-8 text-slate-200 mx-auto" />
            <p className="text-sm font-bold text-slate-400">No missions found matching criteria</p>
          </div>
        )}
      </Card>
    </div>
  );
}
