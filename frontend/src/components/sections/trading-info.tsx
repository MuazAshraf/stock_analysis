"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricExplainer } from "@/components/metric-explainer";
import { ShieldCheck, ShieldAlert, Users } from "lucide-react";
import type { Price } from "@/types/stock";

interface TradingInfoProps {
  price: Price;
}

export function TradingInfo({ price }: TradingInfoProps) {
  const ldcp = price.ldcp;
  const currentClose = price.current;
  const openPrice = price.open;

  const buyerStrong =
    currentClose != null && openPrice != null && currentClose > openPrice;
  const sellerStrong =
    currentClose != null && openPrice != null && currentClose < openPrice;

  const cbLow = price.circuit_breaker_low;
  const cbHigh = price.circuit_breaker_high;

  return (
    <Card className="border-[#E5E0D9] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-[#404E3F] flex items-center gap-2">
          Trading Info
          <Badge className="bg-[#F8F3EA] text-[#404E3F] text-xs font-normal">
            Daily Indicators
          </Badge>
        </CardTitle>
        <p className="text-sm text-[#404E3F]/60">
          Key trading signals that show buyer and seller activity today.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* LDCP */}
        {ldcp != null && (
          <div className="p-4 rounded-xl bg-[#F8F3EA]">
            <MetricExplainer
              label="LDCP"
              fullForm="Last Day Closing Price"
              explanation="The price at which this stock closed yesterday. Compare it with today's price to see if the stock went up or down from yesterday."
            />
            <div className="mt-2 flex items-center gap-4">
              <span className="text-2xl font-bold text-[#404E3F]">
                Rs. {ldcp.toFixed(2)}
              </span>
              {currentClose != null && (
                <Badge
                  className={`text-white ${
                    currentClose > ldcp ? "bg-[#4BC232]" : currentClose < ldcp ? "bg-red-500" : "bg-gray-400"
                  }`}
                >
                  {currentClose > ldcp
                    ? `Up Rs. ${(currentClose - ldcp).toFixed(2)} from yesterday`
                    : currentClose < ldcp
                      ? `Down Rs. ${(ldcp - currentClose).toFixed(2)} from yesterday`
                      : "Same as yesterday"}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Buyer vs Seller Strength */}
        <div className="p-4 rounded-xl bg-[#F3F1E5]">
          <MetricExplainer
            label="Who is Winning Today?"
            explanation="If the current price is higher than today's opening price, buyers are in control (they're pushing the price up). If it's lower, sellers are in control (they're pushing it down)."
          />
          <div className="mt-3 flex items-center gap-3">
            <Users className="h-8 w-8 text-[#2B5288]" />
            {buyerStrong ? (
              <div>
                <span className="text-lg font-bold text-[#4BC232]">
                  Buyers are Stronger
                </span>
                <p className="text-xs text-[#404E3F]/60">
                  Current price (Rs. {currentClose?.toFixed(2)}) is above
                  today&apos;s open (Rs. {openPrice?.toFixed(2)}) — buyers
                  pushed the price up
                </p>
              </div>
            ) : sellerStrong ? (
              <div>
                <span className="text-lg font-bold text-red-500">
                  Sellers are Stronger
                </span>
                <p className="text-xs text-[#404E3F]/60">
                  Current price (Rs. {currentClose?.toFixed(2)}) is below
                  today&apos;s open (Rs. {openPrice?.toFixed(2)}) — sellers
                  pushed the price down
                </p>
              </div>
            ) : (
              <div>
                <span className="text-lg font-bold text-[#404E3F]">
                  Market is Neutral
                </span>
                <p className="text-xs text-[#404E3F]/60">
                  Price is roughly the same as today&apos;s open — no clear
                  winner yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Circuit Breaker */}
        {cbLow != null && cbHigh != null && (
          <div className="p-4 rounded-xl bg-[#F8F3EA]">
            <MetricExplainer
              label="Circuit Breaker"
              fullForm="Price Safety Limit"
              explanation="The stock exchange sets a maximum limit on how much a stock price can go up or down in a single day. If the price hits this limit, trading may be paused to protect investors from extreme swings. Think of it like speed limits on a road."
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white">
                <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#404E3F]/60">Lower Limit</p>
                  <p className="text-sm font-bold text-red-500">
                    Rs. {cbLow.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white">
                <ShieldCheck className="h-5 w-5 text-[#4BC232] flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-[#404E3F]/60">Upper Limit</p>
                  <p className="text-sm font-bold text-[#4BC232]">
                    Rs. {cbHigh.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-[#404E3F]/60 mt-2">
              Today this stock can only trade between Rs. {cbLow.toFixed(2)} and
              Rs. {cbHigh.toFixed(2)}. If it hits either limit, trading may halt
              temporarily.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
