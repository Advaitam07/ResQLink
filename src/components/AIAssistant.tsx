"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, Bot } from "lucide-react";
import { usePathname } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

// ── Canned AI responses ───────────────────────────────────────────────────────
const AI_RESPONSES: Record<string, string> = {
  default:
    "I'm ResQLink AI. I can help you coordinate missions, find volunteers, and analyze case data. What do you need?",
  hello:
    "Hello! I'm your ResQLink AI assistant. How can I help with your crisis coordination today?",
  case:
    "I can help you create, assign, or track cases. Head to the Cases section or ask me for a summary of active missions.",
  volunteer:
    "There are currently active volunteers available. Go to the Volunteers page to assign them to open cases.",
  map:
    "The Field Map shows all active mission markers. You can filter by urgency and export a PDF report from there.",
  report:
    "Reports are available under the Reports section. You can compile a full PDF protocol report with one click.",
  urgent:
    "High-urgency cases require immediate attention. I recommend checking the Cases page and filtering by 'High' urgency.",
  help:
    "I can assist with: cases, volunteers, map, reports, settings, and mission coordination. Just ask!",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return AI_RESPONSES.hello;
  if (lower.includes("case") || lower.includes("mission"))
    return AI_RESPONSES.case;
  if (lower.includes("volunteer") || lower.includes("asset"))
    return AI_RESPONSES.volunteer;
  if (lower.includes("map") || lower.includes("location"))
    return AI_RESPONSES.map;
  if (lower.includes("report") || lower.includes("pdf") || lower.includes("export"))
    return AI_RESPONSES.report;
  if (lower.includes("urgent") || lower.includes("emergency") || lower.includes("critical"))
    return AI_RESPONSES.urgent;
  if (lower.includes("help") || lower.includes("what can"))
    return AI_RESPONSES.help;
  return AI_RESPONSES.default;
}

// ── Robot SVG ─────────────────────────────────────────────────────────────────
function RobotIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 36" fill="none" aria-hidden>
      {/* Antenna */}
      <line x1="16" y1="0" x2="16" y2="5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="2.5" r="2" fill="#f97316" />
      {/* Head */}
      <rect x="5" y="5" width="22" height="14" rx="5" fill="#1e293b" />
      <rect x="8" y="8" width="16" height="8" rx="3" fill="#0f172a" />
      {/* Eyes */}
      <circle cx="12" cy="12" r="2.5" fill="#3b82f6" />
      <circle cx="20" cy="12" r="2.5" fill="#3b82f6" />
      <circle cx="12" cy="12" r="1" fill="white" />
      <circle cx="20" cy="12" r="1" fill="white" />
      {/* Body */}
      <rect x="4" y="21" width="24" height="13" rx="5" fill="#1e293b" />
      <rect x="8" y="24" width="16" height="7" rx="3" fill="#0f172a" />
      {/* Chest lights */}
      <circle cx="13" cy="27.5" r="1.8" fill="#f97316" opacity="0.9" />
      <circle cx="16" cy="27.5" r="1.8" fill="#3b82f6" opacity="0.9" />
      <circle cx="19" cy="27.5" r="1.8" fill="#10b981" opacity="0.9" />
      {/* Arms */}
      <rect x="0" y="22" width="4" height="9" rx="2" fill="#1e293b" />
      <rect x="28" y="22" width="4" height="9" rx="2" fill="#1e293b" />
    </svg>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center mr-2 mt-0.5 shrink-0">
          <Bot className="h-3.5 w-3.5 text-blue-400" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed font-medium ${
          isUser
            ? "bg-[#FF6A00] text-white rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const pathname = usePathname();
  const isSplash = pathname === "/" || pathname === "/initialize";
  const isLogin  = pathname === "/login";

  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: "Hi! I'm ResQLink AI 👋 Ask me anything about missions, volunteers, or the map." },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Only hide on entry/auth pages - MOVE AFTER HOOKS
  if (isSplash || isLogin) return null;

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: getAIResponse(text) },
      ]);
    }, 900);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-[499] w-[320px] rounded-3xl overflow-hidden"
            style={{
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <RobotIcon size={20} />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-teal-400 border-2 border-slate-900" />
                </div>
                <div>
                  <p className="text-white text-[13px] font-bold leading-none">ResQLink AI</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">Always online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="bg-white h-[300px] overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              {messages.map(m => <Bubble key={m.id} msg={m} />)}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                    <Bot className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="bg-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-slate-400 block"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-100 px-3 py-3 flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                style={{ cursor: "text" }}
              />
              <motion.button
                onClick={sendMessage}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                disabled={!input.trim()}
                className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
                style={{ background: input.trim() ? "#FF6A00" : "#e2e8f0" }}
              >
                <Send className="h-4 w-4 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col items-end gap-2">
        {/* Tooltip */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
            >
              Ask ResQLink AI
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={() => setOpen(prev => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          animate={open ? {} : {
            y: [0, -5, 0],
            transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative h-14 w-14 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
            boxShadow: open
              ? "0 0 0 3px rgba(59,130,246,0.5), 0 8px 24px rgba(0,0,0,0.3)"
              : "0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(59,130,246,0.15), 0 8px 24px rgba(0,0,0,0.25)",
          }}
          aria-label="Open AI Assistant"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ boxShadow: ["0 0 0 0 rgba(59,130,246,0.5)", "0 0 0 10px rgba(59,130,246,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Notification dot */}
          {!open && (
            <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-[#FF6A00] border-2 border-slate-900 z-10">
              <span className="absolute inset-0 rounded-full bg-[#FF6A00] animate-ping opacity-75" />
            </span>
          )}

          {/* Icon — robot when closed, X when open */}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="robot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <RobotIcon size={26} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
