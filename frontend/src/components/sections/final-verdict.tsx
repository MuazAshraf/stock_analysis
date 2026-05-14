"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  CircleDot,
  Tag,
} from "lucide-react";
import type { Analysis } from "@/types/stock";

interface FinalVerdictProps {
  analysis: Analysis;
}

function getHealthConfig(health: string) {
  const h = health.toLowerCase();
  if (h.includes("strong") || h.includes("good") || h.includes("healthy")) {
    return {
      icon: ShieldCheck,
      color: "#4BC232",
      bg: "bg-[#4BC232]/10",
      border: "border-[#4BC232]/30",
    };
  }
  if (h.includes("risk") || h.includes("weak") || h.includes("poor")) {
    return {
      icon: ShieldAlert,
      color: "#ef4444",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  }
  return {
    icon: ShieldQuestion,
    color: "#d97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
  };
}

function getRiskConfig(risk: string) {
  const r = risk.toLowerCase();
  if (r.includes("low")) {
    return { percent: 25, color: "#4BC232", label: "Low Risk" };
  }
  if (r.includes("high") || r.includes("very")) {
    return { percent: 85, color: "#ef4444", label: "High Risk" };
  }
  return { percent: 50, color: "#d97706", label: "Medium Risk" };
}

function getUrduHealth(health: string): string {
  const h = health.toLowerCase();
  if (h.includes("healthy")) return "Company ki financial halat achi hai";
  if (h.includes("stable")) return "Company ki financial halat theek hai, lekin behtari ki gunjaish hai";
  if (h.includes("concerning")) return "Company ki financial halat mushkil mein hai — ehtiyaat zaruri hai";
  return "";
}

function getUrduRisk(risk: string): string {
  const r = risk.toLowerCase();
  if (r.includes("low")) return "Ye stock kam risk wala hai — naye investors ke liye munasib";
  if (r.includes("high")) return "Ye stock zyada risk wala hai — sirf tajrubakaar investors ke liye";
  return "Ye stock darmiyani risk wala hai — thori ehtiyaat zaruri hai";
}

function getUrduValuation(val: string): string {
  const v = val.toLowerCase();
  if (v.includes("undervalued")) return "Ye stock filhal sasta lag raha hai apni value ke muqable mein";
  if (v.includes("overvalued")) return "Ye stock filhal mehenga lag raha hai apni value ke muqable mein";
  return "Ye stock apni sahi qeemat ke qareeb lag raha hai";
}

function getUrduVerdict(verdict: string): string {
  const v = verdict.toLowerCase();
  if (v.includes("strong")) return "Company ka karobar mazboot hai — achi nishani hai";
  if (v.includes("weak")) return "Company ka karobar kamzor hai — ehtiyaat karein";
  return "Company ka karobar theek hai — lekin behtari ki gunjaish hai";
}

export function FinalVerdict({ analysis }: FinalVerdictProps) {
  const healthConfig = getHealthConfig(analysis.financial_health);
  const riskConfig = getRiskConfig(analysis.risk_level);
  const HealthIcon = healthConfig.icon;

  return (
    <Card className="border-brand-border bg-brand-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-brand-fg flex items-center gap-2">
          Final Verdict
          <Badge className="bg-brand-bg text-brand-fg text-xs font-normal">
            Summary
          </Badge>
        </CardTitle>
        <p className="text-sm text-brand-fg/60">
          Our overall assessment of this stock, explained simply.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health badge + risk meter side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Overall Health */}
          <div
            className={`p-5 rounded-xl ${healthConfig.bg} border ${healthConfig.border}`}
          >
            <p className="text-xs font-medium text-brand-fg/60 mb-2">
              Overall Health
            </p>
            <div className="flex items-center gap-3">
              <HealthIcon
                className="h-10 w-10"
                style={{ color: healthConfig.color }}
              />
              <span
                className="text-2xl font-bold"
                style={{ color: healthConfig.color }}
              >
                {analysis.financial_health}
              </span>
            </div>
            {getUrduHealth(analysis.financial_health) && (
              <p className="text-xs text-brand-fg/50 mt-2 italic">
                {getUrduHealth(analysis.financial_health)}
              </p>
            )}
          </div>

          {/* Risk Meter */}
          <div className="p-5 rounded-xl bg-brand-bg">
            <p className="text-xs font-medium text-brand-fg/60 mb-2">
              Risk Level
            </p>
            <div className="relative h-3 bg-gradient-to-r from-green-300 via-yellow-300 to-red-400 rounded-full overflow-hidden mt-3">
              <div
                className="absolute top-0 h-full w-1.5 bg-brand-fg rounded-full shadow-md transition-all duration-700"
                style={{
                  left: `${Math.min(Math.max(riskConfig.percent, 2), 98)}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-green-600">Low</span>
              <span className="text-[10px] text-yellow-600">Medium</span>
              <span className="text-[10px] text-red-500">High</span>
            </div>
            <Badge
              className="mt-2 text-white"
              style={{ backgroundColor: riskConfig.color }}
            >
              {riskConfig.label}
            </Badge>
            <p className="text-xs text-brand-fg/50 mt-2 italic">
              {getUrduRisk(analysis.risk_level)}
            </p>
          </div>
        </div>

        {/* Valuation */}
        {analysis.valuation && (
          <div className="p-4 rounded-xl bg-brand-soft flex items-start gap-3">
            <Tag className="h-5 w-5 text-[#2B5288] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-brand-fg">
                Is this stock expensive or cheap right now?
              </p>
              <p className="text-sm text-brand-fg/80 mt-1">
                {analysis.valuation}
              </p>
              <p className="text-xs text-brand-fg/50 mt-1 italic">
                {getUrduValuation(analysis.valuation)}
              </p>
            </div>
          </div>
        )}

        {/* Business Verdict */}
        {analysis.business_verdict && (
          <div className="p-4 rounded-xl bg-brand-bg flex items-start gap-3">
            <CircleDot className="h-5 w-5 text-[#4BC232] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-brand-fg">
                Business Verdict
              </p>
              <p className="text-sm text-brand-fg/80 mt-1">
                {analysis.business_verdict}
              </p>
              <p className="text-xs text-brand-fg/50 mt-1 italic">
                {getUrduVerdict(analysis.business_verdict)}
              </p>
            </div>
          </div>
        )}

        {/* Summary Points */}
        {analysis.summary_points && analysis.summary_points.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-brand-fg mb-3">
              Key Takeaways (in plain English)
            </h4>
            <ul className="space-y-2">
              {analysis.summary_points.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-brand-soft"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2B5288] text-white text-xs flex items-center justify-center font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-brand-fg leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
