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

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Laporan Keuangan Bulanan</h1>
        <div>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Memuat...</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : !report ? (
            <div>Tidak ada data laporan.</div>
          ) : (
            <div className="grid grid-cols-3 gap-4 pb-4">
              <div className="rounded-md border p-3">
                <div className="text-sm text-muted-foreground">Pemasukan</div>
                <div className="text-xl font-semibold">{Number(report.income).toLocaleString()}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-sm text-muted-foreground">Pengeluaran</div>
                <div className="text-xl font-semibold">{Number(report.expense).toLocaleString()}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-sm text-muted-foreground">Net</div>
                <div className="text-xl font-semibold">{Number(report.net).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* details table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {!report || !report.details || report.details.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Tidak ada detail
                    </TableCell>
                  </TableRow>
                ) : (
                  report.details.map((d: IFinance) => (
                    <TableRow key={d._id}>
                      <TableCell className="font-medium">{d.type}</TableCell>
                      <TableCell>{Number(d.balance).toLocaleString()}</TableCell>
                      <TableCell>{d.description ?? "-"}</TableCell>
                      <TableCell>{d.date ? new Date(d.date).toLocaleString() : "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
