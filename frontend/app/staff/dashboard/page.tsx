"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  Users,
  GraduationCap,
  School,
  FileBarChart,
  TrendingUp,
} from "lucide-react";

import athleteService from "@/services/athlete.services";
import coachService from "@/services/coach.services";
import schoolService from "@/services/school.services";
import financeService from "@/services/finance.services";

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [athleteCount, setAthleteCount] = useState(0);
  const [coachCount, setCoachCount] = useState(0);
  const [schoolCount, setSchoolCount] = useState(0);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          athleteRes,
          coachRes,
          schoolRes,
          financeRes,
        ] = await Promise.all([
          athleteService.list(),
          coachService.list(),
          schoolService.list(),
          financeService.list(),
        ]);

        const athletes = athleteRes?.data ?? athleteRes ?? [];
        const coaches = coachRes?.data ?? coachRes ?? [];
        const schools = schoolRes?.data ?? schoolRes ?? [];
        const finances = financeRes?.data ?? financeRes ?? [];

        setAthleteCount(athletes.length);
        setCoachCount(coaches.length);
        setSchoolCount(schools.length);

        const totalIncome = finances
          .filter((f: any) => f.type === "income")
          .reduce((sum: number, item: any) => sum + Number(item.balance), 0);

        const totalExpense = finances
          .filter((f: any) => f.type === "expense")
          .reduce((sum: number, item: any) => sum + Number(item.balance), 0);

        setIncome(totalIncome);
        setExpense(totalExpense);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const balance = income - expense;

  const stats = [
    {
      title: "Total Atlet",
      value: athleteCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Pelatih",
      value: coachCount,
      icon: GraduationCap,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Total Sekolah",
      value: schoolCount,
      icon: School,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Saldo Keuangan",
      value: formatIDR(balance),
      icon: Wallet,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard Pengurus
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Ringkasan data Trisula Sport Club
        </p>
      </div>

      {/* Statistic Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  {loading ? "..." : item.value}
                </h3>
              </div>

              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Finance Summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">
              Pemasukan
            </h3>
          </div>

          <p className="text-2xl font-bold text-emerald-600">
            {formatIDR(income)}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">
              Pengeluaran
            </h3>
          </div>

          <p className="text-2xl font-bold text-red-600">
            {formatIDR(expense)}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileBarChart className="h-5 w-5 text-violet-600" />
            <h3 className="font-semibold">
              Saldo Bersih
            </h3>
          </div>

          <p className="text-2xl font-bold text-violet-600">
            {formatIDR(balance)}
          </p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold mb-4">
          Menu Cepat
        </h3>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <a
            href="/staff/finance"
            className="rounded-xl border p-4 hover:bg-muted transition"
          >
            💰 Finance
          </a>

          <a
            href="/staff/athlete"
            className="rounded-xl border p-4 hover:bg-muted transition"
          >
            🥋 Athlete
          </a>

          <a
            href="/staff/coach"
            className="rounded-xl border p-4 hover:bg-muted transition"
          >
            👨‍🏫 Coach
          </a>

          <a
            href="/staff/school"
            className="rounded-xl border p-4 hover:bg-muted transition"
          >
            🏫 School
          </a>

          <a
            href="/staff/report"
            className="rounded-xl border p-4 hover:bg-muted transition"
          >
            📊 Report
          </a>
        </div>
      </div>
    </div>
  );
}