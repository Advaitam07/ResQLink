"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  LogOut,
  Home,
  Map as MapIcon,
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { clearSession, useStore } from '@/lib/store';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { currentUser, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  if (pathname === '/login' || pathname === '/') return null;

  const menuItems = [
    { icon: Home,            label: 'Home',       href: '/home' },
    { icon: LayoutDashboard, label: 'Dashboard',  href: `/dashboard/${currentUser?.role || 'coordinator'}` },
    { icon: MapIcon,         label: 'Map',        href: '/map' },
    { icon: Briefcase,       label: 'Cases',      href: '/dashboard/cases' },
    { icon: Users,           label: 'Volunteers', href: '/dashboard/volunteers' },
    { icon: BarChart3,       label: 'Reports',    href: '/dashboard/reports' },
    { icon: Settings,        label: 'Settings',   href: '/dashboard/settings' },
    { icon: Info,            label: 'About',      href: '/about' },
  ];

  // Pages that get orange active state
  const orangePages = ['/dashboard/settings', '/map', '/about'];

  const NavItems = () => (
    <>
      {menuItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href.startsWith('/dashboard/') && pathname.startsWith(item.href));
        const isOrange = isActive && orangePages.includes(item.href);

        return (
          <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
            <span className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[13px] font-bold tracking-tight group relative btn-click",
              isOrange
                ? "sidebar-active-orange"
                : isActive
                  ? "bg-slate-900 text-white shadow-xl"
                  : "text-slate-400 hover:bg-accent hover:text-white"
            )}>
              <item.icon className={cn(
                "h-4 w-4 shrink-0 transition-all duration-200",
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              <span>{item.label}</span>
              {mounted && isActive && (
                <div className={cn(
                  "absolute right-3 h-1.5 w-1.5 rounded-full animate-pulse",
                  isOrange
                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    : "bg-accent shadow-[0_0_8px_rgba(251,146,60,0.6)]"
                )} />
              )}
            </span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-[200] lg:hidden bg-white border border-slate-200 rounded-xl p-2 shadow-md btn-click"
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[150] bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-slate-100 flex flex-col z-[160] font-body transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-8 pb-4">
          <Link href="/home" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="p-2 bg-slate-900 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 font-headline">ResQLink</span>
          </Link>
        </div>

        {/* Rescue graphic strip */}
        <div className="mx-4 mb-4 px-4 py-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-emergency-ring" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">System Active</p>
            <p className="text-[8px] text-slate-400 font-medium">All nodes operational</p>
          </div>
          <div className="ml-auto h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
          <NavItems />
        </nav>

        <div className="p-4 border-t border-slate-50">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 rounded-2xl px-4 text-slate-400 hover:bg-accent hover:text-white font-bold transition-all text-[13px] gap-3 btn-click"
            onClick={mounted ? handleLogout : undefined}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
