import { useEffect, useRef } from "react";
import { REVENUE_TREND } from "../data/mockData";

export default function RevenueChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /* Dynamically import Chart.js only once */
    import("chart.js/auto").then(({ default: Chart }) => {
      if (chartRef.current) chartRef.current.destroy();

      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: REVENUE_TREND.map((r) => r.month),
          datasets: [
            {
              label: "Paid",
              data: REVENUE_TREND.map((r) => r.paid),
              backgroundColor: "#6b5ff8",
              borderRadius: 7,
              barPercentage: 0.45,
            },
            {
              label: "Pending",
              data: REVENUE_TREND.map((r) => r.pending),
              backgroundColor: "#e4e4ef",
              borderRadius: 7,
              barPercentage: 0.45,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                borderRadius: 5,
                usePointStyle: true,
                pointStyle: "circle",
                font: { size: 12, family: "'DM Sans'" },
                color: "#6e6e8a",
              },
            },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ` ₹${Number(ctx.raw).toLocaleString("en-IN")}`,
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 12, family: "'DM Sans'" }, color: "#a0a0b8" },
              border: { display: false },
            },
            y: {
              grid: { color: "#f0f0f7" },
              border: { display: false, dash: [4, 4] },
              ticks: {
                font: { size: 11, family: "'DM Mono'" },
                color: "#a0a0b8",
                callback: (v) => "₹" + Math.round(v / 1000) + "k",
              },
            },
          },
        },
      });
    });

    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div className="card p-6 animate-fade-up stagger-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[14px] font-display font-semibold text-surface-900">
            Revenue trend
          </p>
          <p className="text-[12px] text-surface-400 mt-0.5">Last 6 months performance</p>
        </div>
        <div className="flex gap-2">
          {["6M", "1Y", "All"].map((t, i) => (
            <button
              key={t}
              className={
                i === 0
                  ? "btn-primary py-1.5 px-3 text-xs rounded-lg! shadow-none!"
                  : "btn-ghost py-1.5 px-3 text-xs rounded-lg!"
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} height={85} />
    </div>
  );
}