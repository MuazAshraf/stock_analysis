"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import {
  TrendingUp,
  TrendingDown,
  Trophy,
  Scale,
  CheckCircle2,
  Lightbulb,
  DollarSign,
  BarChart3,
  Activity,
  ShieldCheck,
  Tag,
  PieChart,
  Percent,
  ArrowUpRight,
  Users,
  AlertTriangle,
  Coins,
} from "lucide-react";
import { formatPercent } from "@/lib/format";
import { formatCompact } from "@/lib/format";
import type {
  CompareResponse,
  ComparisonMetric,
  StockData,
  FinancialYear,
  RatioYear,
} from "@/types/stock";
import type { LucideIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* ─────────────────────────── Types ─────────────────────────── */

interface QualityRating {
  label: string;
  color: "green" | "yellow" | "red";
}

interface MetricConfig {
  friendlyTitle: string;
  beginnerExplanation: string;
  icon: LucideIcon;
  referenceRange: string;
  explainerTooltip: string;
  rateValue: (v: number | string | null) => QualityRating;
}

interface CategoryGroup {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  metricIndices: number[];
}

/* ─────────────────────── Quality raters ────────────────────── */

function rateRisk(v: number | string | null): QualityRating {
  const s = String(v ?? "").toLowerCase();
  if (s === "low") return { label: "Low Risk", color: "green" };
  if (s === "moderate") return { label: "Medium Risk", color: "yellow" };
  return { label: "High Risk", color: "red" };
}

function rateDividends(v: number | string | null): QualityRating {
  const s = String(v ?? "").toLowerCase();
  if (s.includes("consistent") || s.includes("regular"))
    return { label: "Consistent", color: "green" };
  if (s.includes("irregular")) return { label: "Irregular", color: "yellow" };
  return { label: "No Dividends", color: "red" };
}

function rateNumeric(
  v: number | string | null,
  goodBelow: number | null,
  goodAbove: number | null,
  fairBelow: number | null,
  fairAbove: number | null,
  labels: [string, string, string],
): QualityRating {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  if (isNaN(n)) return { label: "N/A", color: "yellow" };
  if (goodBelow != null && n < goodBelow)
    return { label: labels[0], color: "green" };
  if (goodAbove != null && n >= goodAbove)
    return { label: labels[0], color: "green" };
  if (fairBelow != null && fairAbove != null && n >= fairBelow && n <= fairAbove)
    return { label: labels[1], color: "yellow" };
  if (fairBelow != null && n >= fairBelow && fairAbove == null)
    return { label: labels[1], color: "yellow" };
  if (fairAbove != null && n <= fairAbove && fairBelow == null)
    return { label: labels[1], color: "yellow" };
  return { label: labels[2], color: "red" };
}

/* ─────────────────── Per-metric configuration ─────────────── */

const METRIC_CONFIG: MetricConfig[] = [
  // 0 — P/E Ratio
  {
    friendlyTitle: "Price-to-Earnings (P/E)",
    beginnerExplanation:
      "How many rupees you pay for every Rs. 1 of profit the company earns.",
    icon: Tag,
    referenceRange: "Under 15 = cheap  |  15–25 = fair  |  Over 25 = expensive",
    explainerTooltip:
      "P/E Ratio = Share Price ÷ Earnings Per Share. Lower usually means cheaper.",
    rateValue: (v) =>
      rateNumeric(v, 15, null, 15, 25, [
        "Looks Cheap",
        "Fair Price",
        "Expensive",
      ]),
  },
  // 1 — Net Profit Margin
  {
    friendlyTitle: "Net Profit Margin",
    beginnerExplanation:
      "Out of every Rs. 100 in revenue, how much the company keeps as profit.",
    icon: PieChart,
    referenceRange: "Above 15% = healthy  |  5–15% = average  |  Below 5% = low",
    explainerTooltip:
      "Net Profit Margin = (Profit After Tax ÷ Revenue) × 100. Higher is better.",
    rateValue: (v) =>
      rateNumeric(v, null, 15, 5, 15, ["Healthy", "Average", "Low"]),
  },
  // 2 — EPS Growth
  {
    friendlyTitle: "Earnings Growth (EPS)",
    beginnerExplanation:
      "How fast the company's per-share profit is growing compared to last year.",
    icon: Percent,
    referenceRange:
      "Above 10% = strong  |  0–10% = stable  |  Below 0% = declining",
    explainerTooltip:
      "EPS Growth = change in Earnings Per Share year-over-year. Higher is better.",
    rateValue: (v) =>
      rateNumeric(v, null, 10, 0, 10, [
        "Strong Growth",
        "Stable",
        "Declining",
      ]),
  },
  // 3 — 1-Year Price Change
  {
    friendlyTitle: "1-Year Price Change",
    beginnerExplanation:
      "How much the stock price went up or down over the past 12 months.",
    icon: ArrowUpRight,
    referenceRange:
      "Above 20% = strong rally  |  0–20% = moderate  |  Below 0% = lost value",
    explainerTooltip:
      "The percentage the share price has moved in the last 52 weeks.",
    rateValue: (v) =>
      rateNumeric(v, null, 20, 0, 20, [
        "Strong Rally",
        "Moderate",
        "Lost Value",
      ]),
  },
  // 4 — Free Float
  {
    friendlyTitle: "Free Float",
    beginnerExplanation:
      "What percentage of shares are available for everyday investors to buy and sell.",
    icon: Users,
    referenceRange:
      "Above 40% = very liquid  |  20–40% = moderate  |  Below 20% = low liquidity",
    explainerTooltip:
      "Free float = shares available for public trading. Higher means easier to buy/sell.",
    rateValue: (v) =>
      rateNumeric(v, null, 40, 20, 40, [
        "Very Liquid",
        "Moderate",
        "Low Liquidity",
      ]),
  },
  // 5 — Risk Level
  {
    friendlyTitle: "Risk Level",
    beginnerExplanation:
      "An overall risk assessment based on debt, volatility, and financial health.",
    icon: AlertTriangle,
    referenceRange: 'Low = safest  |  Moderate = some risk  |  High = risky',
    explainerTooltip:
      "A rule-based risk rating combining multiple financial health factors.",
    rateValue: rateRisk,
  },
  // 6 — Dividends
  {
    friendlyTitle: "Dividend Track Record",
    beginnerExplanation:
      "Whether the company regularly shares a part of its profits with investors.",
    icon: Coins,
    referenceRange:
      "Consistent = reliable income  |  Irregular = unpredictable  |  None = no payouts",
    explainerTooltip:
      "Dividend consistency shows how reliably a company rewards shareholders.",
    rateValue: rateDividends,
  },
];

/* ──────────────────── Category groupings ──────────────────── */

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: "Who's Cheaper?",
    subtitle: "Valuation — are you paying a fair price?",
    icon: DollarSign,
    metricIndices: [0],
  },
  {
    title: "Who Makes More Money?",
    subtitle: "Profitability — is the business earning well?",
    icon: BarChart3,
    metricIndices: [1, 2],
  },
  {
    title: "Who's Performing Better?",
    subtitle: "Market performance over the past year",
    icon: Activity,
    metricIndices: [3],
  },
  {
    title: "Who's Safer to Invest In?",
    subtitle: "Risk, liquidity, and income reliability",
    icon: ShieldCheck,
    metricIndices: [4, 5, 6],
  },
];

/* ──────────────────── Color helpers ───────────────────────── */

const qualityColors = {
  green: {
    bg: "bg-[#4BC232]/10",
    text: "text-[#4BC232]",
    border: "border-[#4BC232]/40",
    badge: "bg-[#4BC232]/15 text-[#3a9927] border-[#4BC232]/30",
  },
  yellow: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-300/40",
    badge: "bg-amber-50 text-amber-700 border-amber-300/40",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-300/40",
    badge: "bg-red-50 text-red-600 border-red-300/40",
  },
} as const;

/* ─────────────── Trend Chart Constants & Helpers ─────────── */

const STOCK_A_COLOR = "#4BC232";
const STOCK_B_COLOR = "#2B5288";

interface TrendDataPoint {
  year: string;
  valueA: number | null;
  valueB: number | null;
}

function alignFinancialData(
  financialsA: FinancialYear[],
  financialsB: FinancialYear[],
  field: keyof Pick<FinancialYear, "total_income" | "profit_after_tax" | "eps">,
): TrendDataPoint[] {
  const mapA = new Map(financialsA.map((f) => [f.period, f[field]]));
  const mapB = new Map(financialsB.map((f) => [f.period, f[field]]));
  const allYears = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();
  return allYears.map((year) => ({
    year,
    valueA: mapA.get(year) ?? null,
    valueB: mapB.get(year) ?? null,
  }));
}

function alignRatioData(
  ratiosA: RatioYear[],
  ratiosB: RatioYear[],
  field: keyof Pick<RatioYear, "net_profit_margin" | "eps_growth">,
): TrendDataPoint[] {
  const mapA = new Map(ratiosA.map((r) => [r.year, r[field]]));
  const mapB = new Map(ratiosB.map((r) => [r.year, r[field]]));
  const allYears = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();
  return allYears.map((year) => ({
    year,
    valueA: mapA.get(year) ?? null,
    valueB: mapB.get(year) ?? null,
  }));
}

/* ──────────────────── Helpers ─────────────────────────────── */

function getFriendlyName(idx: number): string {
  return METRIC_CONFIG[idx]?.friendlyTitle ?? `Metric ${idx + 1}`;
}

function getWonRoundNames(
  metrics: ComparisonMetric[],
  side: "a" | "b",
): string[] {
  return metrics
    .map((m, i) => (m.winner === side ? getFriendlyName(i) : null))
    .filter((x): x is string => x != null);
}

/* ═══════════════════════ Main Component ═════════════════════ */

interface ComparisonViewProps {
  data: CompareResponse;
}

export function ComparisonView({ data }: ComparisonViewProps) {
  const { stock_a, stock_b, comparison } = data;

  const priceA = stock_a.price.current ?? 0;
  const priceB = stock_b.price.current ?? 0;
  const changeA = stock_a.price.change ?? 0;
  const changeB = stock_b.price.change ?? 0;
  const changePctA = stock_a.price.change_percent ?? 0;
  const changePctB = stock_b.price.change_percent ?? 0;

  const symA = stock_a.company.symbol;
  const symB = stock_b.company.symbol;

  const isWinnerA = comparison.score_a > comparison.score_b;
  const isWinnerB = comparison.score_b > comparison.score_a;
  const isTie = comparison.score_a === comparison.score_b;

  const wonByA = getWonRoundNames(comparison.metrics, "a");
  const wonByB = getWonRoundNames(comparison.metrics, "b");

  return (
    <div className="space-y-6">
      {/* 1 — Header: Two companies */}
      <Card className="border-[#E5E0D9] bg-white shadow-sm">
        <CardContent className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <StockHeaderSide
              symbol={symA}
              name={stock_a.company.name}
              price={priceA}
              change={changeA}
              changePct={changePctA}
            />
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#404E3F] text-white flex items-center justify-center font-bold text-sm">
                VS
              </div>
            </div>
            <StockHeaderSide
              symbol={symB}
              name={stock_b.company.name}
              price={priceB}
              change={changeB}
              changePct={changePctB}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2 — Quick Verdict */}
      <QuickVerdict
        symA={symA}
        symB={symB}
        scoreA={comparison.score_a}
        scoreB={comparison.score_b}
        verdict={comparison.verdict}
        wonByA={wonByA}
        wonByB={wonByB}
        isTie={isTie}
        isWinnerA={isWinnerA}
        isWinnerB={isWinnerB}
      />

      {/* 3 — Scoreboard */}
      <VisualScoreboard
        symA={symA}
        symB={symB}
        scoreA={comparison.score_a}
        scoreB={comparison.score_b}
        total={comparison.metrics.length}
        wonByA={wonByA}
        wonByB={wonByB}
        isWinnerA={isWinnerA}
        isWinnerB={isWinnerB}
        isTie={isTie}
      />

      {/* 4 — Grouped metric sections */}
      {CATEGORY_GROUPS.map((group) => (
        <CategorySection
          key={group.title}
          group={group}
          metrics={comparison.metrics}
          symA={symA}
          symB={symB}
        />
      ))}

      {/* 5 — 4-Year Financial Trends */}
      <FinancialTrendsSection
        stockA={stock_a}
        stockB={stock_b}
        symA={symA}
        symB={symB}
      />

      {/* 6 — Area Trend Comparison */}
      <AreaTrendsSection
        stockA={stock_a}
        stockB={stock_b}
        symA={symA}
        symB={symB}
      />
    </div>
  );
}

/* ─────────────────── Stock Header Side ────────────────────── */

function StockHeaderSide({
  symbol,
  name,
  price,
  change,
  changePct,
}: {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Badge className="bg-[#2B5288] text-white text-xs">{symbol}</Badge>
      </div>
      <h3 className="text-lg font-bold text-[#404E3F]">{name}</h3>
      <p className="text-2xl font-bold text-[#404E3F] mt-1">
        Rs. {price.toFixed(2)}
      </p>
      <div
        className={`flex items-center justify-center gap-1 ${
          change >= 0 ? "text-[#4BC232]" : "text-red-500"
        }`}
      >
        {change >= 0 ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        )}
        <span className="text-sm font-semibold">
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)} ({formatPercent(changePct)})
        </span>
      </div>
    </div>
  );
}

/* ──────────────────── Quick Verdict ───────────────────────── */

function QuickVerdict({
  symA,
  symB,
  scoreA,
  scoreB,
  verdict,
  wonByA,
  wonByB,
  isTie,
  isWinnerA,
  isWinnerB,
}: {
  symA: string;
  symB: string;
  scoreA: number;
  scoreB: number;
  verdict: string;
  wonByA: string[];
  wonByB: string[];
  isTie: boolean;
  isWinnerA: boolean;
  isWinnerB: boolean;
}) {
  const winnerSym = isWinnerA ? symA : isWinnerB ? symB : null;
  const winnerScore = isWinnerA ? scoreA : scoreB;
  const total = scoreA + scoreB + (7 - scoreA - scoreB); // always 7

  return (
    <Card
      className={`shadow-sm overflow-hidden ${
        isTie
          ? "border-amber-300/50 bg-amber-50/30"
          : "border-[#4BC232]/30 bg-[#4BC232]/5"
      }`}
    >
      <CardContent className="py-6">
        {/* Headline */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {isTie ? (
            <Scale className="h-6 w-6 text-amber-500" />
          ) : (
            <Trophy className="h-6 w-6 text-[#4BC232]" />
          )}
          <h2
            className={`text-xl sm:text-2xl font-bold ${
              isTie ? "text-amber-600" : "text-[#4BC232]"
            }`}
          >
            {isTie
              ? "It's a Tie!"
              : `${winnerSym} Wins ${winnerScore} out of ${total} Rounds`}
          </h2>
        </div>

        {/* Backend verdict */}
        {verdict && (
          <p className="text-sm text-[#404E3F]/80 leading-relaxed text-center max-w-2xl mx-auto mb-4">
            {verdict}
          </p>
        )}

        {/* What each stock won */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {wonByA.length > 0 && (
            <div className="bg-white/60 rounded-lg p-3 border border-[#E5E0D9]">
              <p className="text-xs font-semibold text-[#404E3F]/60 mb-1">
                {symA} won:
              </p>
              <p className="text-sm text-[#404E3F] font-medium">
                {wonByA.join(", ")}
              </p>
            </div>
          )}
          {wonByB.length > 0 && (
            <div className="bg-white/60 rounded-lg p-3 border border-[#E5E0D9]">
              <p className="text-xs font-semibold text-[#404E3F]/60 mb-1">
                {symB} won:
              </p>
              <p className="text-sm text-[#404E3F] font-medium">
                {wonByB.join(", ")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─────────────────── Visual Scoreboard ────────────────────── */

function VisualScoreboard({
  symA,
  symB,
  scoreA,
  scoreB,
  total,
  wonByA,
  wonByB,
  isWinnerA,
  isWinnerB,
  isTie,
}: {
  symA: string;
  symB: string;
  scoreA: number;
  scoreB: number;
  total: number;
  wonByA: string[];
  wonByB: string[];
  isWinnerA: boolean;
  isWinnerB: boolean;
  isTie: boolean;
}) {
  const ties = total - scoreA - scoreB;
  const pctA = (scoreA / total) * 100;
  const pctTie = (ties / total) * 100;
  const pctB = (scoreB / total) * 100;

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm overflow-hidden">
      <CardContent className="py-6">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Trophy className="h-5 w-5 text-[#404E3F]" />
          <h3 className="text-lg font-bold text-[#404E3F]">Scoreboard</h3>
        </div>

        {/* Score boxes */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center max-w-md mx-auto">
          <ScoreBox
            symbol={symA}
            score={scoreA}
            isWinner={isWinnerA}
          />
          <div className="text-2xl font-bold text-[#404E3F]/30">-</div>
          <ScoreBox
            symbol={symB}
            score={scoreB}
            isWinner={isWinnerB}
          />
        </div>

        {/* Tug of war bar */}
        <div className="mt-5 max-w-md mx-auto">
          <div className="flex h-3 rounded-full overflow-hidden border border-[#E5E0D9]">
            {pctA > 0 && (
              <div
                className="bg-[#4BC232] transition-all duration-500"
                style={{ width: `${pctA}%` }}
              />
            )}
            {pctTie > 0 && (
              <div
                className="bg-amber-400 transition-all duration-500"
                style={{ width: `${pctTie}%` }}
              />
            )}
            {pctB > 0 && (
              <div
                className="bg-[#2B5288] transition-all duration-500"
                style={{ width: `${pctB}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-[#404E3F]/50 mt-1.5">
            <span className="font-medium text-[#4BC232]">{symA}</span>
            {ties > 0 && (
              <span className="font-medium text-amber-500">
                {ties} Tied
              </span>
            )}
            <span className="font-medium text-[#2B5288]">{symB}</span>
          </div>
        </div>

        {/* Rounds won lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mt-4">
          <RoundsWonList symbol={symA} rounds={wonByA} color="text-[#4BC232]" />
          <RoundsWonList
            symbol={symB}
            rounds={wonByB}
            color="text-[#2B5288]"
          />
        </div>

        {isTie && (
          <p className="text-center text-sm text-amber-600 mt-3 font-medium">
            Both stocks are evenly matched!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreBox({
  symbol,
  score,
  isWinner,
}: {
  symbol: string;
  score: number;
  isWinner: boolean;
}) {
  return (
    <div
      className={`text-center p-4 rounded-xl ${
        isWinner
          ? "bg-[#4BC232]/10 border-2 border-[#4BC232]"
          : "bg-[#F3F1E5]"
      }`}
    >
      <p className="text-xs font-medium text-[#404E3F]/60 mb-1">{symbol}</p>
      <p
        className={`text-4xl font-bold ${
          isWinner ? "text-[#4BC232]" : "text-[#404E3F]"
        }`}
      >
        {score}
      </p>
      <p className="text-[10px] text-[#404E3F]/40 mt-0.5">Rounds Won</p>
      {isWinner && (
        <Badge className="mt-2 bg-[#4BC232] text-white text-xs">Winner</Badge>
      )}
    </div>
  );
}

function RoundsWonList({
  symbol,
  rounds,
  color,
}: {
  symbol: string;
  rounds: string[];
  color: string;
}) {
  if (rounds.length === 0) return null;
  return (
    <div className="text-center sm:text-left">
      <p className={`text-xs font-semibold ${color} mb-1`}>
        {symbol} won:
      </p>
      <ul className="space-y-0.5">
        {rounds.map((r) => (
          <li
            key={r}
            className="text-xs text-[#404E3F]/70 flex items-center gap-1 justify-center sm:justify-start"
          >
            <CheckCircle2 className={`h-3 w-3 ${color} shrink-0`} />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ──────────────────── Category Section ─────────────────────── */

function CategorySection({
  group,
  metrics,
  symA,
  symB,
}: {
  group: CategoryGroup;
  metrics: ComparisonMetric[];
  symA: string;
  symB: string;
}) {
  const Icon = group.icon;
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#404E3F] text-white flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#404E3F]">{group.title}</h3>
          <p className="text-xs text-[#404E3F]/50">{group.subtitle}</p>
        </div>
      </div>
      <div className="space-y-4">
        {group.metricIndices.map((idx) => {
          const metric = metrics[idx];
          if (!metric) return null;
          return (
            <EnhancedMetricCard
              key={idx}
              metric={metric}
              config={METRIC_CONFIG[idx]}
              symA={symA}
              symB={symB}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────── Enhanced Metric Card ─────────────────── */

function EnhancedMetricCard({
  metric,
  config,
  symA,
  symB,
}: {
  metric: ComparisonMetric;
  config: MetricConfig;
  symA: string;
  symB: string;
}) {
  const Icon = config.icon;
  const winnerIsA = metric.winner === "a";
  const winnerIsB = metric.winner === "b";
  const ratingA = config.rateValue(metric.value_a);
  const ratingB = config.rateValue(metric.value_b);
  const colorsA = qualityColors[ratingA.color];
  const colorsB = qualityColors[ratingB.color];

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardContent className="py-5 px-5">
        {/* Title row */}
        <div className="flex items-start gap-2 mb-1">
          <Icon className="h-5 w-5 text-[#2B5288] mt-0.5 shrink-0" />
          <div className="min-w-0">
            <MetricExplainer
              label={config.friendlyTitle}
              explanation={config.explainerTooltip}
            />
          </div>
        </div>

        {/* Beginner explanation */}
        <p className="text-xs text-[#404E3F]/60 mb-4 ml-7">
          {config.beginnerExplanation}
        </p>

        {/* Two value boxes */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
          <ValueBox
            symbol={symA}
            display={metric.display_a}
            isWinner={winnerIsA}
            rating={ratingA}
            colors={colorsA}
          />
          <div className="flex items-center">
            <span className="text-xs font-semibold text-[#404E3F]/30">vs</span>
          </div>
          <ValueBox
            symbol={symB}
            display={metric.display_b}
            isWinner={winnerIsB}
            rating={ratingB}
            colors={colorsB}
          />
        </div>

        {/* Reference range */}
        <div className="mt-3 px-3 py-2 rounded-md bg-[#F8F3EA]/60 border border-[#E5E0D9]/50">
          <p className="text-[11px] text-[#404E3F]/50 text-center">
            {config.referenceRange}
          </p>
        </div>

        {/* What this means */}
        {metric.explanation && (
          <div className="mt-3 p-3 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]/50">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#404E3F] mb-0.5">
                  What this means
                </p>
                <p className="text-xs text-[#404E3F]/70 leading-relaxed">
                  {metric.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ──────────────────── Value Box ────────────────────────────── */

function ValueBox({
  symbol,
  display,
  isWinner,
  rating,
  colors,
}: {
  symbol: string;
  display: string;
  isWinner: boolean;
  rating: QualityRating;
  colors: (typeof qualityColors)[keyof typeof qualityColors];
}) {
  return (
    <div
      className={`text-center p-3 rounded-lg border ${
        isWinner
          ? "bg-[#4BC232]/10 border-[#4BC232]/40"
          : "bg-[#F3F1E5] border-transparent"
      }`}
    >
      <p className="text-xs font-medium text-[#404E3F]/60 mb-1">{symbol}</p>
      <div className="flex items-center justify-center gap-1.5">
        {isWinner && (
          <CheckCircle2 className="h-4 w-4 text-[#4BC232] shrink-0" />
        )}
        <span
          className={`text-lg font-bold ${
            isWinner ? "text-[#4BC232]" : "text-[#404E3F]"
          }`}
        >
          {display}
        </span>
      </div>
      {/* Independent quality badge */}
      <Badge
        variant="outline"
        className={`mt-2 text-[10px] px-2 py-0.5 ${colors.badge}`}
      >
        {rating.label}
      </Badge>
    </div>
  );
}

/* ═══════════════ 4-Year Financial Trends Section ═════════════ */

function CompareTrendBadge({
  symbol,
  values,
}: {
  symbol: string;
  values: (number | null)[];
}) {
  const nonNull = values.filter((v): v is number => v != null);
  if (nonNull.length < 2) return null;
  const isGrowing = nonNull[nonNull.length - 1] > nonNull[0];
  return (
    <Badge
      className={`text-[10px] gap-1 ${
        isGrowing
          ? "bg-[#4BC232]/10 text-[#4BC232] border-[#4BC232]/30"
          : "bg-red-50 text-red-500 border-red-200"
      }`}
    >
      {isGrowing ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {symbol}: {isGrowing ? "Growing" : "Declining"}
    </Badge>
  );
}

function ComparisonTrendChart({
  title,
  explanation,
  data,
  symA,
  symB,
  formatValue,
  unit,
}: {
  title: string;
  explanation: string;
  data: TrendDataPoint[];
  symA: string;
  symB: string;
  formatValue?: (v: number) => string;
  unit?: string;
}) {
  if (data.length === 0) return null;

  const tooltipFmt = formatValue ?? ((v: number) => v.toLocaleString("en-PK"));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <MetricExplainer label={title} explanation={explanation} />
        <div className="flex flex-wrap gap-1.5">
          <CompareTrendBadge
            symbol={symA}
            values={data.map((d) => d.valueA)}
          />
          <CompareTrendBadge
            symbol={symB}
            values={data.map((d) => d.valueB)}
          />
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D9" />
            <XAxis
              dataKey="year"
              tick={{ fill: "#404E3F", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) =>
                formatValue ? formatValue(v) : formatCompact(v)
              }
              tick={{ fill: "#404E3F", fontSize: 12 }}
              width={60}
            />
            <RechartsTooltip
              formatter={(value, name) => [
                `${unit ? unit + " " : "Rs. "}${tooltipFmt(Number(value))}`,
                name,
              ]}
              contentStyle={{
                backgroundColor: "#F8F3EA",
                border: "1px solid #E5E0D9",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="valueA"
              name={symA}
              fill={STOCK_A_COLOR}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="valueB"
              name={symB}
              fill={STOCK_B_COLOR}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function FinancialTrendsSection({
  stockA,
  stockB,
  symA,
  symB,
}: {
  stockA: StockData;
  stockB: StockData;
  symA: string;
  symB: string;
}) {
  const hasFinancials =
    stockA.financials_annual.length > 0 || stockB.financials_annual.length > 0;
  const hasRatios = stockA.ratios.length > 0 || stockB.ratios.length > 0;

  if (!hasFinancials && !hasRatios) return null;

  const incomeData = hasFinancials
    ? alignFinancialData(
        stockA.financials_annual,
        stockB.financials_annual,
        "total_income",
      )
    : [];
  const profitData = hasFinancials
    ? alignFinancialData(
        stockA.financials_annual,
        stockB.financials_annual,
        "profit_after_tax",
      )
    : [];
  const epsData = hasFinancials
    ? alignFinancialData(
        stockA.financials_annual,
        stockB.financials_annual,
        "eps",
      )
    : [];
  const marginData = hasRatios
    ? alignRatioData(stockA.ratios, stockB.ratios, "net_profit_margin")
    : [];
  const epsGrowthData = hasRatios
    ? alignRatioData(stockA.ratios, stockB.ratios, "eps_growth")
    : [];

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#404E3F] text-white flex items-center justify-center">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#404E3F]">
            4-Year Financial Trends
          </h3>
          <p className="text-xs text-[#404E3F]/50">
            Side-by-side historical performance comparison
          </p>
        </div>
      </div>

      <Card className="border-[#E5E0D9] bg-white shadow-sm">
        <CardContent className="py-5 px-5 space-y-6">
          {/* Color legend */}
          <div className="flex items-center gap-4 text-xs text-[#404E3F]/70 p-2 rounded-md bg-[#F8F3EA]/60 border border-[#E5E0D9]/50">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: STOCK_A_COLOR }}
              />
              {symA}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: STOCK_B_COLOR }}
              />
              {symB}
            </span>
          </div>

          {incomeData.length > 0 && (
            <ComparisonTrendChart
              title="Total Income"
              explanation="All the money the company earned from its business operations before paying any expenses. Higher is generally better."
              data={incomeData}
              symA={symA}
              symB={symB}
            />
          )}

          {profitData.length > 0 && (
            <ComparisonTrendChart
              title="Profit After Tax"
              explanation="The actual profit left after the company pays all expenses and taxes. This is the real bottom line."
              data={profitData}
              symA={symA}
              symB={symB}
            />
          )}

          {epsData.length > 0 && (
            <ComparisonTrendChart
              title="Earnings Per Share (EPS)"
              explanation="How much profit the company made for each single share. If you own 1 share, this is your slice of the profit pie."
              data={epsData}
              symA={symA}
              symB={symB}
              formatValue={(v) => v.toFixed(2)}
              unit="Rs."
            />
          )}

          {marginData.length > 0 && (
            <ComparisonTrendChart
              title="Net Profit Margin"
              explanation="Out of every Rs. 100 in revenue, how much the company keeps as profit. Higher is better."
              data={marginData}
              symA={symA}
              symB={symB}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
          )}

          {epsGrowthData.length > 0 && (
            <ComparisonTrendChart
              title="EPS Growth"
              explanation="How fast the company's per-share profit is growing compared to the previous year. Positive means earnings are increasing."
              data={epsGrowthData}
              symA={symA}
              symB={symB}
              formatValue={(v) => `${v.toFixed(1)}%`}
              unit=""
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ═══════════ Overall Performance Index (Area Chart) ═════════ */

/**
 * Normalise a single TrendDataPoint[] series to 0–100 per metric.
 * For each data point the min/max across BOTH stocks across ALL years
 * is used so the scale is fair.
 */
function normaliseSeries(data: TrendDataPoint[]): TrendDataPoint[] {
  const allVals = data.flatMap((d) =>
    [d.valueA, d.valueB].filter((v): v is number => v != null),
  );
  if (allVals.length === 0) return [];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1; // avoid /0
  return data.map((d) => ({
    year: d.year,
    valueA: d.valueA != null ? ((d.valueA - min) / range) * 100 : null,
    valueB: d.valueB != null ? ((d.valueB - min) / range) * 100 : null,
  }));
}

interface CompositePoint {
  year: string;
  scoreA: number;
  scoreB: number;
  metricsUsed: number;
}

function buildCompositeIndex(
  allSeries: TrendDataPoint[][],
): CompositePoint[] {
  // Normalise each metric independently
  const normed = allSeries.map(normaliseSeries).filter((s) => s.length > 0);
  if (normed.length === 0) return [];

  // Collect all years across every metric
  const yearSet = new Set<string>();
  normed.forEach((s) => s.forEach((d) => yearSet.add(d.year)));
  const years = Array.from(yearSet).sort();

  return years.map((year) => {
    let sumA = 0,
      countA = 0,
      sumB = 0,
      countB = 0;
    for (const series of normed) {
      const point = series.find((d) => d.year === year);
      if (point?.valueA != null) {
        sumA += point.valueA;
        countA++;
      }
      if (point?.valueB != null) {
        sumB += point.valueB;
        countB++;
      }
    }
    return {
      year,
      scoreA: countA > 0 ? Math.round(sumA / countA) : 0,
      scoreB: countB > 0 ? Math.round(sumB / countB) : 0,
      metricsUsed: Math.max(countA, countB),
    };
  });
}

function AreaTrendsSection({
  stockA,
  stockB,
  symA,
  symB,
}: {
  stockA: StockData;
  stockB: StockData;
  symA: string;
  symB: string;
}) {
  const hasFinancials =
    stockA.financials_annual.length > 0 || stockB.financials_annual.length > 0;
  const hasRatios = stockA.ratios.length > 0 || stockB.ratios.length > 0;

  if (!hasFinancials && !hasRatios) return null;

  // Gather all available metric series
  const allSeries: TrendDataPoint[][] = [];
  if (hasFinancials) {
    allSeries.push(
      alignFinancialData(
        stockA.financials_annual,
        stockB.financials_annual,
        "total_income",
      ),
      alignFinancialData(
        stockA.financials_annual,
        stockB.financials_annual,
        "profit_after_tax",
      ),
      alignFinancialData(
        stockA.financials_annual,
        stockB.financials_annual,
        "eps",
      ),
    );
  }
  if (hasRatios) {
    allSeries.push(
      alignRatioData(stockA.ratios, stockB.ratios, "net_profit_margin"),
      alignRatioData(stockA.ratios, stockB.ratios, "eps_growth"),
    );
  }

  const composite = buildCompositeIndex(allSeries);
  if (composite.length === 0) return null;

  const latestA = composite[composite.length - 1].scoreA;
  const latestB = composite[composite.length - 1].scoreB;
  const leader = latestA > latestB ? symA : latestB > latestA ? symB : null;

  const series = [
    { name: symA, data: composite.map((d) => d.scoreA) },
    { name: symB, data: composite.map((d) => d.scoreB) },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    colors: [STOCK_A_COLOR, STOCK_B_COLOR],
    fill: { type: "solid", opacity: 0.2 },
    stroke: { curve: "smooth", width: 2.5 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: composite.map((d) => d.year),
      labels: { style: { colors: "#404E3F", fontSize: "12px" } },
      axisBorder: { color: "#E5E0D9" },
      axisTicks: { color: "#E5E0D9" },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: "#404E3F", fontSize: "12px" },
        formatter: (v) => `${Math.round(v)}`,
      },
    },
    grid: { borderColor: "#E5E0D9", strokeDashArray: 3 },
    tooltip: {
      y: { formatter: (v) => `${Math.round(v)} / 100` },
      theme: "light",
      style: { fontSize: "12px" },
    },
    legend: { show: false },
    annotations: {
      yaxis: [
        {
          y: 50,
          borderColor: "#E5E0D9",
          strokeDashArray: 6,
          label: {
            text: "Average (50)",
            position: "front",
            style: {
              color: "#404E3F",
              background: "transparent",
              fontSize: "10px",
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-lg bg-[#404E3F] text-white flex items-center justify-center">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#404E3F]">
            Overall Performance Index
          </h3>
          <p className="text-xs text-[#404E3F]/50">
            Combined score (0–100) from income, profit, EPS, margin &amp; growth
          </p>
        </div>
      </div>

      <Card className="border-[#E5E0D9] bg-white shadow-sm">
        <CardContent className="py-5 px-5 space-y-4">
          {/* Color legend + leader badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-[#404E3F]/70 p-2 rounded-md bg-[#F8F3EA]/60 border border-[#E5E0D9]/50">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: STOCK_A_COLOR }}
                />
                {symA}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: STOCK_B_COLOR }}
                />
                {symB}
              </span>
            </div>
            {leader && (
              <Badge className="bg-[#4BC232]/10 text-[#3a9927] border-[#4BC232]/30 text-xs gap-1">
                <Trophy className="h-3 w-3" />
                {leader} leads overall
              </Badge>
            )}
          </div>

          {/* The area chart */}
          <div className="h-[280px]">
            <ReactApexChart
              type="area"
              height={280}
              options={options}
              series={series}
            />
          </div>

          {/* Score summary */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`text-center p-3 rounded-lg border ${
                latestA >= latestB
                  ? "bg-[#4BC232]/10 border-[#4BC232]/40"
                  : "bg-[#F3F1E5] border-transparent"
              }`}
            >
              <p className="text-xs font-medium text-[#404E3F]/60 mb-0.5">
                {symA} Latest Score
              </p>
              <p
                className={`text-2xl font-bold ${
                  latestA >= latestB ? "text-[#4BC232]" : "text-[#404E3F]"
                }`}
              >
                {latestA}
                <span className="text-sm font-normal text-[#404E3F]/40">
                  /100
                </span>
              </p>
            </div>
            <div
              className={`text-center p-3 rounded-lg border ${
                latestB >= latestA
                  ? "bg-[#2B5288]/10 border-[#2B5288]/40"
                  : "bg-[#F3F1E5] border-transparent"
              }`}
            >
              <p className="text-xs font-medium text-[#404E3F]/60 mb-0.5">
                {symB} Latest Score
              </p>
              <p
                className={`text-2xl font-bold ${
                  latestB >= latestA ? "text-[#2B5288]" : "text-[#404E3F]"
                }`}
              >
                {latestB}
                <span className="text-sm font-normal text-[#404E3F]/40">
                  /100
                </span>
              </p>
            </div>
          </div>

          {/* Explainer */}
          <div className="p-3 rounded-lg bg-[#F8F3EA] border border-[#E5E0D9]/50">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-[#404E3F]/70 leading-relaxed">
                This index normalises each financial metric (income, profit,
                EPS, margin, growth) to a 0–100 scale, then averages them.
                The stock with the higher area is performing better overall.
                The gap between the two areas shows how far apart they are.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
