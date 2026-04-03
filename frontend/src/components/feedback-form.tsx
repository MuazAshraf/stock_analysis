"use client";

import { useState } from "react";
import { Bug, Lightbulb, TrendingUp, MessageCircle, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitFeedback } from "@/lib/api";
import { cn } from "@/lib/utils";

type Category = "bug" | "feature" | "improvement" | "other";

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "bug", label: "Bug Report", icon: <Bug className="h-4 w-4" />, desc: "Something is broken" },
  { value: "feature", label: "Feature Request", icon: <Lightbulb className="h-4 w-4" />, desc: "I want something new" },
  { value: "improvement", label: "Improvement", icon: <TrendingUp className="h-4 w-4" />, desc: "Make something better" },
  { value: "other", label: "Other", icon: <MessageCircle className="h-4 w-4" />, desc: "General feedback" },
];

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("improvement");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = name.trim().length >= 1 && message.trim().length >= 10 && status !== "sending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      await submitFeedback(name.trim(), email.trim() || null, category, message.trim());
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-[#4BC232]/30 bg-[#4BC232]/5 p-8 text-center space-y-3">
        <CheckCircle2 className="h-10 w-10 text-[#4BC232] mx-auto" />
        <p className="text-sm font-semibold text-[#404E3F]">Thank you for your feedback!</p>
        <p className="text-xs text-[#404E3F]/60">We read every submission and will use it to improve the tool.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 px-4 py-2 text-xs font-semibold text-[#4BC232] border border-[#4BC232]/30 rounded-lg hover:bg-[#4BC232]/10 transition-colors cursor-pointer"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#E5E0D9] p-6 bg-[#F8F3EA] space-y-4">
      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="feedback-name" className="block text-xs font-medium text-[#404E3F] mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={100}
            className="w-full rounded-lg border border-[#E5E0D9] bg-white px-3 py-2.5 text-sm text-[#404E3F] placeholder:text-[#404E3F]/30 focus:outline-none focus:ring-2 focus:ring-[#4BC232]/30 focus:border-[#4BC232]"
          />
        </div>
        <div>
          <label htmlFor="feedback-email" className="block text-xs font-medium text-[#404E3F] mb-1">
            Email <span className="text-[#404E3F]/30 font-normal">(optional)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            maxLength={200}
            className="w-full rounded-lg border border-[#E5E0D9] bg-white px-3 py-2.5 text-sm text-[#404E3F] placeholder:text-[#404E3F]/30 focus:outline-none focus:ring-2 focus:ring-[#4BC232]/30 focus:border-[#4BC232]"
          />
        </div>
      </div>

      {/* Category selector */}
      <div>
        <label className="block text-xs font-medium text-[#404E3F] mb-2">What type of feedback?</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-all cursor-pointer",
                category === c.value
                  ? "bg-white border-[#4BC232] shadow-sm"
                  : "bg-white/50 border-[#E5E0D9] hover:border-[#4BC232]/50"
              )}
            >
              <span className={cn("transition-colors", category === c.value ? "text-[#4BC232]" : "text-[#404E3F]/40")}>
                {c.icon}
              </span>
              <span className={cn("text-xs font-semibold", category === c.value ? "text-[#404E3F]" : "text-[#404E3F]/60")}>
                {c.label}
              </span>
              <span className="text-[10px] text-[#404E3F]/40 leading-tight">{c.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="feedback-msg" className="block text-xs font-medium text-[#404E3F] mb-1">
          Your message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="feedback-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your feedback in detail... (minimum 10 characters)"
          rows={4}
          maxLength={2000}
          className="w-full rounded-lg border border-[#E5E0D9] bg-white px-3 py-2.5 text-sm text-[#404E3F] placeholder:text-[#404E3F]/30 focus:outline-none focus:ring-2 focus:ring-[#4BC232]/30 focus:border-[#4BC232] resize-none"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#404E3F]/40">
            {message.trim().length < 10 && message.length > 0 ? `${10 - message.trim().length} more characters needed` : ""}
          </span>
          <span className="text-[10px] text-[#404E3F]/40">{message.length}/2000</span>
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all",
          canSubmit
            ? "bg-[#4BC232] text-white hover:bg-[#3da828] cursor-pointer"
            : "bg-[#4BC232]/30 text-white/60 cursor-not-allowed"
        )}
      >
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Feedback
          </>
        )}
      </button>
    </form>
  );
}
