
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, type Case } from '@/lib/store';
import { caseAPI } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Upload, 
  Plus, 
  FileText, 
  Users, 
  Clock,
  BookOpen,
  TreePine,
  Sparkles,
  Loader2
} from "lucide-react";
import { suggestCaseActions } from '@/ai/flows/suggest-case-actions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AddCasePage() {
  const router = useRouter();
  const { cases, saveCases, currentUser, refreshCases } = useStore();
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 'Medium' as Case['urgency'] | 'Critical',
    location: '',
    skillRequired: [] as string[]
  });

  const handleAiSuggest = async () => {
    if (!formData.description) return;
    setIsSuggesting(true);
    try {
      const result = await suggestCaseActions({
        description: formData.description,
        category: formData.category || 'General',
        urgency: formData.urgency === 'Critical' ? 'High' : formData.urgency as any
      });
      
      setFormData(prev => ({
        ...prev,
        skillRequired: Array.from(new Set([...prev.skillRequired, ...result.requiredSkills])),
        urgency: result.priorityLevel === 'High' ? 'High' : result.priorityLevel as any
      }));
    } catch (error) {
      console.error("AI Suggestion failed", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const caseData = {
      title: formData.title,
      description: formData.description,
      category: formData.category || 'General',
      urgency: formData.urgency,
      location: formData.location,
      skillRequired: formData.skillRequired.join(', '),
    };

    try {
      // Try API first
      const res = await caseAPI.create(caseData);
      if (res.success) {
        await refreshCases();
        toast({ title: "Case Created", description: "New service case has been registered." });
        router.push('/dashboard/coordinator');
        return;
      }
    } catch {
      // Fallback to local storage
    }

    // Local fallback
    const newCase: Case = {
      id: `c${Date.now()}`,
      ...caseData,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updates: [{
        timestamp: new Date().toISOString(),
        note: 'Case manually created.',
        user: currentUser?.name || 'Unknown'
      }]
    };

    saveCases([...cases, newCase]);
    toast({ title: "Case Created", description: "New service case has been registered locally." });
    router.push('/dashboard/coordinator');
  };

  const activityFeed = [
    { id: 1, title: 'Case #145 updated', desc: 'Pending case matches...', type: 'case' },
    { id: 2, title: 'Volunteer Ravi matched', desc: 'Personal coordinator set', type: 'volunteer' },
    { id: 3, title: 'System sync active', desc: 'Optimal performance', type: 'case' },
  ];

  return (
    <div className="space-y-6">
      <div className="teal-gradient inline-flex items-center px-8 py-3 rounded-full text-white glass-card border-none shadow-xl">
        <h1 className="text-xl font-bold">Welcome back, Coordinator {currentUser?.name.split(' ')[0] || 'Priya'}!</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="glass-card rounded-[2.5rem] border-none soft-shadow p-8 relative overflow-hidden">
            <div className="absolute top-10 right-10 opacity-20 rotate-12">
               <BookOpen className="h-12 w-12 text-primary" />
            </div>

            <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-foreground font-headline">Create New Service Case</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-white/40 border-primary/20 hover:bg-primary/10 text-primary font-bold transition-all"
                onClick={handleAiSuggest}
                disabled={isSuggesting || !formData.description}
              >
                {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                AI Suggestions
              </Button>
            </CardHeader>
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Case Title</Label>
                      <Input 
                        placeholder="Success briefing summary..." 
                        className="bg-white/40 border-none rounded-2xl h-12 glass-card focus-visible:ring-primary/20"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Service Category</Label>
                      <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                        <SelectTrigger className="bg-white/40 border-none rounded-2xl h-12 glass-card">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-none rounded-2xl shadow-2xl">
                          <SelectItem value="Food Security">Food Security</SelectItem>
                          <SelectItem value="Healthcare Access">Healthcare Access</SelectItem>
                          <SelectItem value="Education Support">Education Support</SelectItem>
                          <SelectItem value="Disaster Relief">Disaster Relief</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="City, Sector, or Landmark" 
                          className="pl-12 bg-white/40 border-none rounded-2xl h-12 glass-card focus-visible:ring-primary/20"
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Mission Context</Label>
                      <Textarea 
                        placeholder="Describe the situation and community impact..." 
                        className="bg-white/40 border-none rounded-3xl min-h-[120px] glass-card focus-visible:ring-primary/20"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-bold block">Urgency Level</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Critical', 'High', 'Medium', 'Low'].map((level) => (
                          <Badge 
                            key={level}
                            variant="outline"
                            onClick={() => setFormData({...formData, urgency: level as any})}
                            className={cn(
                              "cursor-pointer rounded-full px-4 py-1.5 text-[10px] font-bold border-none transition-all uppercase tracking-widest",
                              formData.urgency === level 
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white/40 text-muted-foreground hover:bg-white/60"
                            )}
                          >
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Required Capabilities</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.skillRequired.map((skill) => (
                          <Badge 
                            key={skill}
                            className="bg-primary/10 text-primary border-primary/20 rounded-full px-4 py-1 text-[10px] font-bold"
                            onClick={() => setFormData(prev => ({ ...prev, skillRequired: prev.skillRequired.filter(s => s !== skill) }))}
                          >
                            {skill}
                          </Badge>
                        ))}
                        <Badge 
                          className="bg-white/40 text-muted-foreground hover:bg-white/60 rounded-full h-8 w-8 p-0 flex items-center justify-center border-none cursor-pointer"
                          onClick={() => {
                            const s = window.prompt("Enter required capability:");
                            if (s) setFormData(prev => ({ ...prev, skillRequired: [...prev.skillRequired, s] }));
                          }}
                        >
                           <Plus className="h-4 w-4" />
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/30 border-none rounded-[2rem] p-6 glass-card mt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Documentation & Assets</p>
                      <Button variant="ghost" size="sm" className="text-[10px] h-9 bg-white/40 hover:bg-white/60 rounded-full px-4 border border-white/40">
                        <Upload className="h-4 w-4 mr-2" /> Attach Field Evidence
                      </Button>
                    </div>
                    <Button 
                      type="submit"
                      className="teal-gradient text-white font-bold h-14 px-12 rounded-2xl shadow-xl shadow-teal-500/20 hover:scale-105 transition-all"
                    >
                      Initialize Deployment Sequence
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card rounded-[2.5rem] border-none soft-shadow">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-xl font-bold font-headline">Recent Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8 space-y-4">
              {activityFeed.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 hover:bg-white/40 rounded-[1.5rem] transition-all cursor-pointer border-none group">
                  <div className={cn(
                    "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    item.type === 'case' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  )}>
                    {item.type === 'case' ? <FileText className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="bg-primary/5 rounded-[2.5rem] p-10 text-center space-y-4 relative overflow-hidden group">
             <TreePine className="h-16 w-16 text-primary mx-auto opacity-40 group-hover:scale-110 transition-transform" />
             <div className="space-y-1">
                <h3 className="font-bold text-lg font-headline">Network Protocols</h3>
                <p className="text-xs text-muted-foreground px-4">Ensure all field operations align with community safety standards.</p>
             </div>
             <Button variant="outline" className="rounded-2xl bg-white border-primary/20 text-primary font-bold w-full h-11">Review Standards</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
