"use client";

import { motion } from "framer-motion";
import { UserCircle2, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

export default function LoginButton() {
  const router   = useRouter();
  const pathname = usePathname();
  const { currentUser } = useStore();

  const isSplash    = pathname === "/" || pathname === "/initialize";
  const isLogin     = pathname === "/login";
  const isDashboard = pathname.startsWith("/dashboard") || pathname === "/map";

  // 1. Hide on splash screen and login page
  if (isSplash || isLogin) return null;

  // 2. Hide on dashboard pages (already inside the app)
  if (isDashboard) return null;

  const label = currentUser ? "Dashboard" : "Sign In";
  const href  = currentUser ? `/dashboard/${currentUser.role}` : "/login";
  const Icon  = currentUser ? LayoutDashboard : UserCircle2;

  return (
    <motion.button
      onClick={() => router.push(href)}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06, backgroundColor: "#e05a00" }}
      whileTap={{ scale: 0.94 }}
      className="fixed top-14 right-6 z-[500] flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[13px] font-bold tracking-wide select-none"
      style={{
        background: "#FF6A00",
        boxShadow: "0 4px 20px rgba(255,106,0,0.45), 0 1px 4px rgba(0,0,0,0.12)",
      }}
      aria-label={label}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </motion.button>
  );
}
