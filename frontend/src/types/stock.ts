export interface StockListItem {
  symbol: string;
  name: string;
}

export interface Company {
  name: string;
  symbol: string;
  sector: string;
  description: string;
  ceo: string | null;
  chairman: string | null;
  secretary: string | null;
  website: string | null;
  auditor: string | null;
  fiscal_year_end: string | null;
}

export interface Price {
  current: number | null;
  change: number | null;
  change_percent: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  day_range_low: number | null;
  day_range_high: number | null;
  week52_high: number | null;
  week52_low: number | null;
  ldcp: number | null;
  pe_ratio: number | null;
  year_change_percent: number | null;
  ytd_change_percent: number | null;
  circuit_breaker_low: number | null;
  circuit_breaker_high: number | null;
}

export interface Equity {
  market_cap_thousands: number | null;
  total_shares: number | null;
  free_float_shares: number | null;
  free_float_percent: number | null;
}

export interface FinancialYear {
  period: string;
  sales: number | null;
  total_income: number | null;
  profit_after_tax: number | null;
  eps: number | null;
}

export interface RatioYear {
  year: string;
  net_profit_margin: number | null;
  eps_growth: number | null;
  peg: number | null;
}

export interface Payout {
  date: string | null;
  financial_results: string | null;
  details: string | null;
  book_closure: string | null;
}

export interface Analysis {
  business_verdict: string;
  financial_health: string;
  dividend_status: string;
  valuation: string;
  risk_level: string;
  summary_points: string[];
}

export interface IndexPoint {
  name: string;
  value: number | null;
  change: number | null;
  change_percent: number | null;
}

export interface IncomeStatementPeriod {
  period: string;
  revenue: number | null;
  gross_profit: number | null;
  operating_income: number | null;
  pretax_income: number | null;
  tax: number | null;
  net_income: number | null;
  eps: number | null;
}

export interface BalanceSheetPeriod {
  period: string;
  total_assets: number | null;
  total_equity: number | null;
  total_liabilities: number | null;
  total_debt: number | null;
  cash: number | null;
  current_assets: number | null;
  current_liabilities: number | null;
}

export interface CashFlowPeriod {
  period: string;
  operating_cash_flow: number | null;
  investing_cash_flow: number | null;
  financing_cash_flow: number | null;
  free_cash_flow: number | null;
  capital_expenditure: number | null;
  end_cash: number | null;
}

export interface FinancialStatements {
  income_annual: IncomeStatementPeriod[];
  income_quarterly: IncomeStatementPeriod[];
  balance_annual: BalanceSheetPeriod[];
  balance_quarterly: BalanceSheetPeriod[];
  cashflow_annual: CashFlowPeriod[];
  cashflow_quarterly: CashFlowPeriod[];
}

export interface StockData {
  company: Company;
  price: Price;
  equity: Equity;
  financials_annual: FinancialYear[];
  financials_quarterly: FinancialYear[];
  ratios: RatioYear[];
  payouts: Payout[];
  analysis: Analysis;
  indices: IndexPoint[];
  is_shariah: boolean;
  statements: FinancialStatements | null;
}

export interface ComparisonMetric {
  label: string;
  description: string;
  value_a: number | string | null;
  value_b: number | string | null;
  display_a: string;
  display_b: string;
  winner: "a" | "b" | "tie";
  explanation: string;
}

export interface ComparisonResult {
  metrics: ComparisonMetric[];
  score_a: number;
  score_b: number;
  verdict: string;
}

export interface CompareResponse {
  stock_a: StockData;
  stock_b: StockData;
  comparison: ComparisonResult;
}
