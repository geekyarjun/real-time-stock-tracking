"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TokenChartProps {
  data?: {
    symbol: string;
    exchange: string;
  };
  className?: string;
}

export function TokenChart({ data, className }: TokenChartProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !data.symbol || !data.exchange || !container.current) return;

    // Remove old widget before adding a new one
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${data?.exchange}:${data?.symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "light",
          "style": "1",
          "locale": "en",
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container?.current?.appendChild(script);
  }, [data]);

  if (!data) return null;

  return (
    <div
      className={cn(
        "w-full h-[500px] border rounded-lg p-3 [&_iframe]:h-full",
        className
      )}
    >
      <div
        className="tradingview-widget-container"
        ref={container}
        style={{ height: "100%", width: "100%" }}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height: "calc(100% - 32px)", width: "100%" }}
        ></div>
      </div>
    </div>
  );
}
