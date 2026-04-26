
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2, ShieldCheck, Lock } from "lucide-react";
import { useStore, type Role } from '@/lib/store';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { users, loginUser } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('coordinator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedEmail = email.toLowerCase().trim();

    try {
      if (isRegistering) {
        // Register flow
        const res = await authAPI.register({ name, email: normalizedEmail, password, role }) as any;
        await loginUser({ ...res.data.user, id: res.data.user.id || res.data.user._id }, res.data.token);
        router.push(`/dashboard/${res.data.user.role === 'volunteer' ? 'volunteer' : res.data.user.role}`);
      } else {
        // Login flow
        const res = await authAPI.login({ email: normalizedEmail, password, role }) as any;
        await loginUser({ ...res.data.user, id: res.data.user.id || res.data.user._id }, res.data.token);
        
        // Fix redirect mapping
        const target = res.data.user.role === 'volunteer' ? 'volunteer' : res.data.user.role;
        router.push(`/dashboard/${target}`);
      }
    } catch (err: any) {
      // Fallback for demo if backend is offline
      console.warn("Auth failed, attempting local fallback", err);
      
      await new Promise(r => setTimeout(r, 800));
      
      if (isRegistering) {
        const newUser = { id: `u${Date.now()}`, name, email: normalizedEmail, role, status: 'Available' as const };
        loginUser(newUser);
        router.push(`/dashboard/${role === 'volunteer' ? 'volunteer' : role}`);
      } else {
        // Fix: lowercase compare for local demo
        const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.role === role);
        if (user) {
          loginUser(user);
          const target = user.role === 'volunteer' ? 'volunteer' : user.role;
          router.push(`/dashboard/${target}`);
        } else {
          setError('Invalid email, password, or selected role.');
          setLoading(false);
        }
      }
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-body">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden font-body">
      {/* 3D Animated Spheres */}
      <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] opacity-40 animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-80 h-80 bg-accent/15 rounded-full blur-[100px] opacity-30 animate-float-subtle pointer-events-none" />
      
      <Card className="w-full max-w-lg border border-slate-200 bg-white/80 backdrop-blur-2xl shadow-2xl shadow-slate-200/50 rounded-[3rem] relative z-10 animate-entry-scale">
        <CardHeader className="space-y-4 text-center pt-12">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-slate-900 tracking-tight">
            {isRegistering ? "Register Identity" : "Sign In"}
          </CardTitle>
          <CardDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            ResQLink Intelligence Protocol
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-12 pb-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 text-center animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}
            
            {isRegistering && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-2">Full Name</Label>
                <Input 
                  placeholder="Operative Name" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-50 border-slate-100 rounded-2xl h-14 px-6 text-slate-900 focus-visible:ring-primary/20 font-bold transition-all shadow-sm"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-2">Email Protocol</Label>
              <Input 
                type="email" 
                placeholder="name@resqlink.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 border-slate-100 rounded-2xl h-14 px-6 text-slate-900 focus-visible:ring-primary/20 font-bold transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-2">Access Key</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 border-slate-100 rounded-2xl h-14 px-6 text-slate-900 focus-visible:ring-primary/20 font-bold transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-2">Interface Protocol</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="bg-slate-50 border-slate-100 h-14 rounded-2xl px-6 text-slate-900 font-bold focus:ring-primary/20 shadow-sm">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="coordinator">Case Coordinator</SelectItem>
                  <SelectItem value="volunteer">Field Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pb-12 px-12">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-7 rounded-2xl transition-all duration-300 text-lg shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (isRegistering ? "Register Operative" : "Authorize Access")}
            </Button>
            
            <div className="text-center space-y-4">
               <p className="text-xs font-bold text-slate-500">
                 {isRegistering ? "Already have an identity?" : "New operative?"}{" "}
                 <button 
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-primary hover:text-primary/80 transition-colors font-bold"
                 >
                    {isRegistering ? "Sign In Instead" : "Register Identity"}
                 </button>
               </p>
               
               {/* Demo Credentials */}
               <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-2 text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">Demo Access Protocols</p>
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-slate-400">Admin:</span>
                    <span className="text-slate-600 font-bold">admin@resqlink.com / password123</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-slate-400">Coord:</span>
                    <span className="text-slate-600 font-bold">coordinator@resqlink.com / password123</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-slate-400">Vol:</span>
                    <span className="text-slate-600 font-bold">volunteer@resqlink.com / password123</span>
                  </div>
               </div>

               <div className="pt-2">
                 <Link href="/" className="text-[10px] font-bold text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.2em]">
                    Return to Network Overview
                 </Link>
               </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
