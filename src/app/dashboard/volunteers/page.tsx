
"use client";

import { useState } from 'react';
import { useStore, type User } from '@/lib/store';
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
  Plus, 
  UserPlus, 
  MoreVertical, 
  MapPin, 
  Mail,
  Trash2,
  Edit2,
  Power,
  ShieldCheck
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { volunteerAPI } from '@/lib/api';

export default function VolunteersPage() {
  const { users, saveUsers, cases } = useStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newVolunteer, setNewVolunteer] = useState({ name: '', email: '', skills: '', location: '' });

  const volunteers = users.filter(u => u.role === 'volunteer');
  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (id: string) => {
    try { await volunteerAPI.toggleAvailability(id); } catch { /* local fallback */ }
    const updated = users.map(u =>
      String(u.id) === String(id) ? { ...u, status: u.status === 'Available' ? 'Busy' : 'Available' } as User : u
    );
    saveUsers(updated);
    toast({ title: "Status Updated", description: "Volunteer availability has been toggled." });
  };

  const handleToggleAuthorization = (id: string) => {
    const updated = users.map(u =>
      String(u.id) === String(id) ? { ...u, isAuthorized: !u.isAuthorized } as User : u
    );
    saveUsers(updated);
    const user = updated.find(u => String(u.id) === String(id));
    toast({ 
      title: user?.isAuthorized ? "Asset Authorized" : "Authorization Revoked", 
      description: `${user?.name}'s field credentials have been updated.` 
    });
  };

  const handleDelete = async (id: string) => {
    try { await volunteerAPI.delete(id); } catch { /* local fallback */ }
    const updated = users.filter(u => u.id !== id);
    saveUsers(updated);
    toast({ variant: "destructive", title: "Volunteer Removed", description: "Identity profile purged from system." });
  };

  const handleAdd = async () => {
    if (!newVolunteer.name || !newVolunteer.email) return;
    try {
      const res = await volunteerAPI.add({
        name: newVolunteer.name, email: newVolunteer.email,
        skills: newVolunteer.skills.split(',').map(s => s.trim()),
        location: newVolunteer.location || 'Unknown',
        isAuthorized: true
      }) as any;
      const v = res.data;
      saveUsers([...users, { id: v._id || v.id, name: v.name, email: v.email,
        role: 'volunteer', skills: v.skills, location: v.location, status: v.status, isAuthorized: true }]);
    } catch {
      // local fallback
      const volunteer: User = { id: `v${Date.now()}`, name: newVolunteer.name,
        email: newVolunteer.email, role: 'volunteer',
        skills: newVolunteer.skills.split(',').map(s => s.trim()),
        location: newVolunteer.location || 'Unknown', status: 'Available', isAuthorized: true };
      saveUsers([...users, volunteer]);
    }
    setNewVolunteer({ name: '', email: '', skills: '', location: '' });
    setIsAddOpen(false);
    toast({ title: "Volunteer Added", description: "New operative successfully registered." });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Field Assets</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and authorize active volunteers within the network.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white rounded-xl h-10 px-5 font-bold shadow-sm">
              <UserPlus className="mr-2 h-4 w-4" /> Authorize Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">New Operative Registration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  placeholder="Identity Name" 
                  value={newVolunteer.name} 
                  onChange={e => setNewVolunteer({...newVolunteer, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Protocol</Label>
                <Input 
                  placeholder="email@ResQLink.com" 
                  value={newVolunteer.email} 
                  onChange={e => setNewVolunteer({...newVolunteer, email: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Capabilities (comma separated)</Label>
                <Input 
                  placeholder="Medical, Logistics, Rescue" 
                  value={newVolunteer.skills} 
                  onChange={e => setNewVolunteer({...newVolunteer, skills: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Sector Location</Label>
                <Input 
                  placeholder="Zone or District" 
                  value={newVolunteer.location} 
                  onChange={e => setNewVolunteer({...newVolunteer, location: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleAdd} className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl mt-4">
                Confirm Authorization
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search assets by identity, sector, or capability..." 
            className="pl-12 h-11 bg-white border-slate-200 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Operative</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Verification</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Capabilities</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Sector</TableHead>
              <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVolunteers.map((v) => {
              const activeCases = cases.filter(c => c.assignedTo === v.id && (c.status === 'In Progress' || c.status === 'Active')).length;
              return (
                <TableRow key={v.id} className="border-none hover:bg-slate-50 transition-colors group h-16">
                  <TableCell className="px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-white">
                        <AvatarImage src={`https://picsum.photos/seed/${v.id}/100/100`} />
                        <AvatarFallback>{v.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900">{v.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Mail className="h-2.5 w-2.5" /> {v.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase border-none",
                      v.isAuthorized ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {v.isAuthorized ? 'Verified' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {v.skills?.map(skill => (
                        <Badge key={skill} className="rounded-lg bg-slate-100 text-slate-500 text-[9px] font-bold border-none px-2 py-0.5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" /> {v.location || 'Unset'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase border-none",
                      v.status === 'Available' ? "bg-teal-100 text-teal-600" : "bg-orange-100 text-orange-600"
                    )}>
                      {v.status || 'Available'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleAuthorization(v.id)}
                        className={cn(
                          "h-8 w-8 rounded-lg hover:bg-white",
                          v.isAuthorized ? "text-blue-600" : "text-slate-400"
                        )}
                        title={v.isAuthorized ? "Revoke Authorization" : "Authorize Asset"}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleStatus(v.id)}
                        className="h-8 w-8 rounded-lg hover:bg-white text-slate-400 hover:text-slate-900"
                        title="Toggle Status"
                      >
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(v.id)}
                        className="h-8 w-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                        title="Remove Asset"
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
      </Card>
    </div>
  );
}
