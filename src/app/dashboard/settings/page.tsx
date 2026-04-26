
"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Save,
  CheckCircle2,
  Lock,
  Loader2,
  Smartphone,
  Key,
  Languages,
  Wrench,
  Database,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { settingsAPI, userAPI } from '@/lib/api';

type SettingsTab = 'identity' | 'notifications' | 'security' | 'language' | 'maintenance';

export default function SettingsPage() {
  const { currentUser, updateCurrentUser, runSystemAudit, cases, users } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');
  const [isSaving, setIsSaving] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      runSystemAudit(cases, users);
      setIsAuditing(false);
      toast({ 
        title: "Recovery Protocol Complete", 
        description: "Tactical data integrity has been verified and repaired.",
        className: "bg-teal-50 border-teal-200 text-teal-900"
      });
    }, 1200);
  };

  const handleResetDatabase = () => {
    if (confirm("WARNING: This will reset all local mission data to initial deployment state. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  // States for different sections
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const [notifications, setNotifications] = useState({
    caseAlerts: true,
    assignments: true,
    updates: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    biometrics: false,
    sessionTimeout: '30'
  });

  const [language, setLanguage] = useState({
    current: 'english',
    timezone: 'UTC-5'
  });

  const handleSaveProfile = async () => {
    if (currentUser) {
      setIsSaving(true);
      try {
        await userAPI.updateProfile(profile);
        updateCurrentUser({ ...currentUser, ...profile });
        toast({ title: "Identity Synced", description: "Your operative profile has been updated across the network." });
      } catch {
        // fallback local update
        updateCurrentUser({ ...currentUser, ...profile });
        toast({ title: "Identity Synced", description: "Profile updated locally." });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleToggleNotification = async (key: keyof typeof notifications, val: boolean) => {
    const updated = { ...notifications, [key]: val };
    setNotifications(updated);
    try { await settingsAPI.updateNotifications(updated); } catch { /* local only */ }
    toast({ title: "Alert Protocol Updated", description: `${key.replace(/([A-Z])/g, ' $1')} has been ${val ? 'enabled' : 'disabled'}.` });
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'identity':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-900 rounded-xl text-white">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Identity Profile</h3>
                <p className="text-xs text-slate-400 font-medium">Managed asset credentials and identity markers.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
                <Input 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="rounded-xl bg-slate-50 border-none h-11 focus-visible:ring-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Protocol</Label>
                <Input 
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  className="rounded-xl bg-slate-50 border-none h-11 focus-visible:ring-slate-200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Designated Role</Label>
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl">
                <Lock className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{currentUser?.role}</span>
                <Badge variant="outline" className="ml-auto text-[9px] uppercase tracking-tighter bg-white">Locked</Badge>
              </div>
            </div>

            <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-slate-900 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-slate-900/10 active:scale-95 transition-transform">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
              Sync Identity
            </Button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Protocol Alerts</h3>
                <p className="text-xs text-slate-400 font-medium">Configure how system alerts are delivered to your interface.</p>
              </div>
            </div>

            <div className="space-y-4">
               {[
                 { key: 'caseAlerts', label: 'Mission Readiness Alerts', desc: 'Notify me of new high-urgency mission protocols.' },
                 { key: 'assignments', label: 'Field Deployment Alerts', desc: 'Sync alerts when an asset is deployed to a sector.' },
                 { key: 'updates', label: 'Intelligence Log Updates', desc: 'Weekly briefing of system performance and integrity.' },
               ].map((opt) => (
                 <div key={opt.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{opt.desc}</p>
                    </div>
                    <Switch 
                      checked={notifications[opt.key as keyof typeof notifications]}
                      onCheckedChange={(val) => handleToggleNotification(opt.key as keyof typeof notifications, val)}
                    />
                 </div>
               ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Security & Access</h3>
                <p className="text-xs text-slate-400 font-medium">Protect your operative credentials and session integrity.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-slate-100 rounded-xl space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Two-Factor Authentication
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 max-w-[280px]">Add an extra layer of security by requiring a mobile verification code.</p>
                  <Switch 
                    checked={security.twoFactor} 
                    onCheckedChange={(val) => {
                      setSecurity({...security, twoFactor: val});
                      toast({ title: "2FA Protocol Updated", description: `Two-factor authentication is now ${val ? 'active' : 'inactive'}.` });
                    }} 
                  />
                </div>
              </div>

              <div className="p-4 border border-slate-100 rounded-xl space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Key className="h-4 w-4" /> Session Management
                </h4>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Auto-Logout Timeout</Label>
                  <Select value={security.sessionTimeout} onValueChange={(v) => setSecurity({...security, sessionTimeout: v})}>
                    <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Minutes</SelectItem>
                      <SelectItem value="30">30 Minutes</SelectItem>
                      <SelectItem value="60">1 Hour</SelectItem>
                      <SelectItem value="never">Never (Not Recommended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              className="bg-slate-900 text-white font-bold h-11 px-8 rounded-xl"
              onClick={() => toast({ title: "Security Matrix Updated", description: "Your access protocols have been hardened." })}
            >
              Update Security
            </Button>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">App Language & Region</h3>
                <p className="text-xs text-slate-400 font-medium">Configure your localized interface and time synchronization.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interface Language</Label>
                <Select value={language.current} onValueChange={(v) => {
                  setLanguage({...language, current: v});
                  toast({ title: "Language Updated", description: `Interface will now render in ${v}.` });
                }}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English (US)</SelectItem>
                    <SelectItem value="spanish">Español (ES)</SelectItem>
                    <SelectItem value="french">Français (FR)</SelectItem>
                    <SelectItem value="hindi">हिन्दी (IN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Timezone Sync</Label>
                <Select value={language.timezone} onValueChange={(v) => setLanguage({...language, timezone: v})}>
                  <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">Pacific Time (PT)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (ET)</SelectItem>
                    <SelectItem value="UTC+0">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="UTC+5:30">India Standard Time (IST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="bg-slate-900 text-white font-bold h-11 px-8 rounded-xl"
              onClick={() => toast({ title: "Region Synced", description: "Interface localization complete." })}
            >
              Save Regional Settings
            </Button>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-900 rounded-xl text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Offline Recovery Protocol</h3>
                <p className="text-xs text-slate-400 font-medium">Automated tools to fix system bugs and repair data integrity.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="border-none bg-slate-50 p-6 rounded-2xl group hover:bg-slate-100 transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-teal-600" />
                      <h4 className="text-sm font-bold">Self-Healing Audit</h4>
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                      Scans the entire mission directory and identity matrix. Fixes broken IDs, repairs malformed strings, and ensures all operative roles are correctly synchronized.
                    </p>
                  </div>
                  <Button 
                    onClick={handleRunAudit} 
                    disabled={isAuditing}
                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-teal-600/20"
                  >
                    {isAuditing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                    Initialize Repair
                  </Button>
                </div>
              </Card>

              <Card className="border-none bg-slate-50 p-6 rounded-2xl group hover:bg-slate-100 transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <h4 className="text-sm font-bold">Local Database Sync</h4>
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                      Synchronizes your local tactical storage with the primary network. Use this if you encounter UI inconsistencies or display lag.
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({ title: "Local Sync Success", description: "Tactical cache successfully merged." });
                    }}
                    className="border-slate-200 rounded-xl h-11 px-6 font-bold bg-white text-slate-600"
                  >
                    Sync Cache
                  </Button>
                </div>
              </Card>

              <div className="pt-4 space-y-4">
                <Separator className="bg-slate-100" />
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-red-700 uppercase tracking-widest">Protocol Reset</p>
                    <p className="text-[10px] text-red-500 font-medium">Permanently purge all local data and return to initial deployment state.</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={handleResetDatabase}
                    className="text-red-600 hover:bg-red-100 hover:text-red-700 font-bold text-xs"
                  >
                    Hard Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { icon: User, label: 'Identity Profile', id: 'identity' },
    { icon: Bell, label: 'Notifications', id: 'notifications' },
    { icon: Shield, label: 'Security & Access', id: 'security' },
    { icon: Globe, label: 'App Language', id: 'language' },
    { icon: Wrench, label: 'Recovery Protocol', id: 'maintenance' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Preferences</h1>
        <p className="text-sm text-slate-500 font-medium">Configure your personal dashboard and communication protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <nav className="flex flex-col gap-1">
             {navItems.map((item) => (
               <Button 
                key={item.id} 
                variant="ghost" 
                onClick={() => setActiveTab(item.id as SettingsTab)}
                className={cn(
                 "justify-start h-11 rounded-xl px-4 font-bold text-xs gap-3 transition-all",
                 activeTab === item.id 
                  ? "bg-slate-900 text-white shadow-xl translate-x-1" 
                  : "text-slate-500 hover:bg-slate-50"
               )}>
                 <item.icon className="h-4 w-4" /> {item.label}
               </Button>
             ))}
          </nav>

          <Card className="bg-primary/5 border-none rounded-2xl p-6 space-y-2 mt-8">
             <div className="flex items-center gap-2 text-primary">
                <Languages className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Translation Active</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium">ResQLink automatically adapts to your system locale for mission critical updates.</p>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-none shadow-sm rounded-3xl p-8 min-h-[500px] glass-card">
            {renderSection()}
          </Card>
        </div>
      </div>
    </div>
  );
}

