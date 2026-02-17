import type { StockData, CompareResponse } from "@/types/stock";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeStock(url: string): Promise<StockData> {
  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    let message = "Something went wrong. Please check the URL and try again.";
    try {
      const err = await response.json();
      if (err.detail) message = err.detail;
    } catch {
      // not JSON, use default
    }
    throw new Error(message);
  }

  return response.json();
}

export async function compareStocks(urlA: string, urlB: string): Promise<CompareResponse> {
  const response = await fetch(`${API_URL}/api/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url_a: urlA, url_b: urlB }),
  });

  if (!response.ok) {
    let message = "Something went wrong. Please check the URLs and try again.";
    try {
      const err = await response.json();
      if (err.detail) message = err.detail;
    } catch {
      // not JSON, use default
    }
    throw new Error(message);
  }

  return response.json();
}
