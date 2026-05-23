"use client"

import React, { useEffect, useState } from "react";
import reportService from "@/services/report.services";
import type { IMonthlyReport, IFinance } from "@/types/Finance";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d?: string | Date) => {
  if (!d) return "-";
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

// ── sub-components ────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "green" | "red" | "blue";
}) {
  const colors = {
    green: { border: "#16a34a", glow: "rgba(22,163,74,0.12)", text: "#15803d", bg: "#f0fdf4" },
    red:   { border: "#dc2626", glow: "rgba(220,38,38,0.10)", text: "#b91c1c", bg: "#fef2f2" },
    blue:  { border: "#2563eb", glow: "rgba(37,99,235,0.10)", text: "#1d4ed8", bg: "#eff6ff" },
  }[accent];

  return (
    <div
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}40`,
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: `0 2px 12px ${colors.glow}, 0 1px 3px rgba(0,0,0,0.06)`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "box-shadow 0.2s",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6b7280",
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: colors.text,
          fontFamily: "'Syne', 'DM Mono', sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {fmt(value)}
      </span>
      <div style={{ width: 32, height: 2, borderRadius: 2, background: colors.border, opacity: 0.5 }} />
    </div>
  );
}

function Badge({ type }: { type: string }) {
  const isIncome = type?.toLowerCase() === "income" || type?.toLowerCase() === "pemasukan";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
        background: isIncome ? "#dcfce7" : "#fee2e2",
        color: isIncome ? "#15803d" : "#b91c1c",
        border: isIncome ? "1px solid #bbf7d0" : "1px solid #fecaca",
      }}
    >
      <span style={{ fontSize: 8 }}>{isIncome ? "▲" : "▼"}</span>
      {type}
    </span>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function ReportPage() {
  const [report, setReport] = useState<IMonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    reportService
      .monthly({ year, month })
      .then((res: any) => {
        if (!mounted) return;
        const data: IMonthlyReport | undefined = res?.data;
        setReport(data ?? null);
      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(err?.message || "Gagal mengambil laporan");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const now = new Date();
  const bulan = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

        .report-root {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 32px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
        }

        .report-table-row {
          transition: background 0.15s;
        }
        .report-table-row:hover {
          background: #f1f5f9 !important;
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .refresh-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.09);
        }

        .skeleton {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="report-root">
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 4, height: 28, background: "linear-gradient(180deg, #16a34a, #2563eb)", borderRadius: 4 }} />
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color: "#0f172a", margin: 0 }}>
                Laporan Keuangan
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>
              PERIODE · {bulan.toUpperCase()}
            </p>
          </div>

          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stat Cards ── */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 96 }} />)}
          </div>
        ) : error ? null : report ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            <StatCard label="Pemasukan" value={Number(report.income)} accent="green" />
            <StatCard label="Pengeluaran" value={Number(report.expense)} accent="red" />
            <StatCard label="Net Balance" value={Number(report.net)} accent="blue" />
          </div>
        ) : null}

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "14px 18px",
            color: "#b91c1c",
            fontSize: 14,
            marginBottom: 24,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Table Card ── */}
        <div style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {/* card header */}
          <div style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fafbfc",
          }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
              Detail Transaksi
            </span>
            {report?.details && (
              <span style={{
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                color: "#64748b",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "3px 10px",
              }}>
                {report.details.length} transaksi
              </span>
            )}
          </div>

          {/* table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["Tipe", "Jumlah", "Deskripsi", "Tanggal"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#94a3b8",
                        fontFamily: "'DM Mono', monospace",
                        background: "#f8fafc",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {[1, 2, 3, 4].map(j => (
                        <td key={j} style={{ padding: "14px 20px" }}>
                          <div className="skeleton" style={{ height: 14, width: j === 3 ? "60%" : "80%" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !report || !report.details || report.details.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "56px 20px", textAlign: "center" }}>
                      <div style={{ color: "#cbd5e1", fontSize: 32, marginBottom: 12 }}>◈</div>
                      <div style={{ color: "#94a3b8", fontSize: 14 }}>Tidak ada detail transaksi</div>
                    </td>
                  </tr>
                ) : (
                  report.details.map((d: IFinance, idx: number) => (
                    <tr
                      key={d._id}
                      className="report-table-row"
                      style={{ borderBottom: "1px solid #f8fafc" }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <Badge type={d.type} />
                      </td>
                      <td style={{
                        padding: "14px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: "'DM Mono', monospace",
                        color: d.type === "income" ? "#10b981" : "#ef4444",
                        letterSpacing: "-0.01em",
                      }}>
                        {d.type === "expense" ? "−" : "+"}
                        {fmt(Number(d.balance))}
                      </td>
                      <td style={{
                        padding: "14px 20px",
                        fontSize: 14,
                        color: "#475569",
                        maxWidth: 260,
                      }}>
                        {d.description || (
                          <span style={{ color: "#cbd5e1" }}>—</span>
                        )}
                      </td>
                      <td style={{
                        padding: "14px 20px",
                        fontSize: 12,
                        fontFamily: "'DM Mono', monospace",
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                      }}>
                        {d.date ? fmtDate(d.date) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}