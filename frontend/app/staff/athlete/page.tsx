"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import athleteService from "@/services/athlete.services"
import schoolService from "@/services/school.services"
import type { IAthlete } from "@/types/Athlete"
import type { ISchool } from "@/types/School"

import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ── Belt color badge helper ───────────────────────────────────────────────────
const beltStyles: Record<string, string> = {
	putih:    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
	kuning:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
	hijau:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
	biru:     "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
	merah:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
	hitam:    "bg-zinc-800 text-zinc-100 dark:bg-zinc-700 dark:text-zinc-100",
}
function BeltBadge({ belt }: { belt?: string | null }) {
	if (!belt || belt === "-") return <span className="text-muted-foreground text-sm">—</span>
	const key = belt.toLowerCase()
	const style = beltStyles[key] ?? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
	return (
		<span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium", style)}>
			{belt}
		</span>
	)
}

// ── Initials avatar ───────────────────────────────────────────────────────────
function InitialsAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase()
	const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1) * 17) % 360
	return (
		<span
			className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
			style={{ backgroundColor: `hsl(${hue},55%,48%)` }}
			aria-hidden="true"
		>
			{initials}
		</span>
	)
}

// ── Profile Avatar ───────────────────────────────────────────────────────────
function ProfileAvatar({ name, imageUrl }: { name: string; imageUrl?: string | null }) {
	const [hasError, setHasError] = useState(false)

	useEffect(() => {
		setHasError(false)
	}, [imageUrl])

	if (imageUrl && !hasError) {
		return (
			<img
				src={imageUrl}
				alt={name}
				className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full object-cover ring-1 ring-border shadow-inner"
				onError={() => setHasError(true)}
			/>
		)
	}
	return <InitialsAvatar name={name} />
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────
function SkeletonRows() {
	return (
		<>
			{Array.from({ length: 5 }).map((_, i) => (
				<TableRow key={i} className="hover:bg-transparent">
					{Array.from({ length: 5 }).map((_, j) => (
						<TableCell key={j}>
							<div className="h-4 rounded-md bg-muted animate-pulse" style={{ width: j === 0 ? "60%" : j === 4 ? "48px" : "50%" }} />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	)
}

// ── Detail field row ──────────────────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/50 last:border-0">
			<span className="text-[13px] text-muted-foreground flex-shrink-0 w-28">{label}</span>
			<span className="text-[13px] font-medium text-foreground text-right">{value}</span>
		</div>
	)
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AthletePage() {
	const [athletes, setAthletes] = useState<IAthlete[]>([])
	const [schools, setSchools] = useState<ISchool[]>([])
	const [loading, setLoading] = useState(true)

	const schoolMap = React.useMemo(() => {
		const map = new Map<string, string>()
		schools.forEach((s) => map.set(s._id, s.name))
		return map
	}, [schools])

	useEffect(() => {
		let mounted = true
		setLoading(true)
		Promise.all([
			athleteService.list(),
			schoolService.list({ limit: 1000 })
		])
			.then(([athleteRes, schoolRes]: any) => {
				if (!mounted) return
				const athleteData = Array.isArray(athleteRes) ? athleteRes : athleteRes?.data ?? []
				const schoolData = Array.isArray(schoolRes) ? schoolRes : schoolRes?.data ?? []
				setAthletes(athleteData)
				setSchools(schoolData)
			})
			.catch(() => {
				setAthletes([])
				setSchools([])
			})
			.finally(() => mounted && setLoading(false))

		return () => {
			mounted = false
		}
	}, [])

	const [open, setOpen] = useState(false)
	const [detailLoading, setDetailLoading] = useState(false)
	const [selected, setSelected] = useState<IAthlete | null>(null)

	const openDetail = (id: string) => {
		setSelected(null)
		setOpen(true)
		setDetailLoading(true)
		athleteService
			.get(id)
			.then((res: any) => {
				const data = res?.data ?? (Array.isArray(res) ? res[0] : res)
				setSelected(data)
			})
			.catch(() => setSelected(null))
			.finally(() => setDetailLoading(false))
	}

	return (
		<div className="space-y-5 p-6">
			{/* ── Page header ── */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-[18px] font-semibold tracking-tight text-foreground">Atlet</h2>
					<p className="text-[13px] text-muted-foreground mt-0.5">
						{!loading && `${athletes.length} atlet terdaftar`}
					</p>
				</div>
			</div>

			{/* ── Table card ── */}
			<div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/50">
							<TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 pl-4 py-3">
								Nama
							</TableHead>
							<TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 py-3">
								Tanggal Lahir
							</TableHead>
							<TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 py-3">
								Sekolah
							</TableHead>
							<TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 py-3">
								Sabuk
							</TableHead>
							<TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 py-3 pr-4">
								Aksi
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{loading ? (
							<SkeletonRows />
						) : athletes.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={5} className="py-16 text-center">
									<div className="flex flex-col items-center gap-2">
										<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
											<svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
											</svg>
										</div>
										<p className="text-[13px] text-muted-foreground">Tidak ada data atlet.</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							athletes.map((a) => (
								<TableRow
									key={a._id}
									className="border-b border-border/40 hover:bg-muted/30 transition-colors duration-100"
								>
									{/* Name + avatar */}
									<TableCell className="pl-4 py-3">
										<div className="flex items-center gap-2.5">
											<ProfileAvatar name={a.name} imageUrl={a.imageUrl} />
											<span className="text-[13.5px] font-medium text-foreground">
												{a.name}
											</span>
										</div>
									</TableCell>

									{/* Birthdate */}
									<TableCell className="text-[13px] text-muted-foreground py-3">
										{a.birthdate
											? new Date(a.birthdate).toLocaleDateString("id-ID", {
													day: "2-digit",
													month: "short",
													year: "numeric",
											  })
											: "—"}
									</TableCell>

									{/* School Name */}
									<TableCell className="py-3 text-[13px] text-muted-foreground">
										<div className="flex items-center gap-1.5">
											<svg className="h-3.5 w-3.5 text-muted-foreground/75 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
											</svg>
											<span className="font-medium truncate max-w-[170px]" title={a.schools?.map(id => schoolMap.get(id) || id).join(", ") || "—"}>
												{a.schools?.map(id => schoolMap.get(id) || id).join(", ") || "—"}
											</span>
										</div>
									</TableCell>

									{/* Belt */}
									<TableCell className="py-3">
										<BeltBadge belt={a.belt} />
									</TableCell>

									{/* Action */}
									<TableCell className="pr-4 py-3">
										<Button
											size="sm"
											variant="outline"
											onClick={() => openDetail(a._id)}
											className="h-7 px-3 text-[12px] rounded-lg border-border/60 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 dark:hover:bg-violet-950/30 dark:hover:text-violet-300 dark:hover:border-violet-700 transition-colors"
										>
											Detail
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* ── Detail Dialog ── */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="rounded-2xl border border-border/50 shadow-xl max-w-sm p-0 overflow-hidden gap-0">
					{/* Dialog header */}
					<DialogHeader className="px-5 pt-5 pb-4 border-b border-border/40">
						{detailLoading ? (
							<>
								<div className="h-5 w-36 rounded-md bg-muted animate-pulse mb-1" />
								<div className="h-3.5 w-24 rounded-md bg-muted animate-pulse" />
							</>
						) : (
							<>
								<div className="flex items-center gap-3 mb-1">
									{selected && <ProfileAvatar name={selected.name} imageUrl={selected.imageUrl} />}
									<DialogTitle className="text-[15px] font-semibold tracking-tight">
										{selected?.name ?? "Detail Atlet"}
									</DialogTitle>
								</div>
								<DialogDescription className="text-[12px] text-muted-foreground pl-11">
									{selected ? `ID: ${selected._id}` : "Tidak ada data"}
								</DialogDescription>
							</>
						)}
					</DialogHeader>

					{/* Dialog body */}
					<div className="px-5 py-4">
						{detailLoading ? (
							<div className="space-y-3">
								{Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="flex justify-between py-2.5 border-b border-border/40">
										<div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
										<div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
									</div>
								))}
							</div>
						) : selected ? (
							<div>
								<DetailRow label="Nama" value={selected.name} />
								<DetailRow
									label="Tanggal Lahir"
									value={
										selected.birthdate
											? new Date(selected.birthdate).toLocaleDateString("id-ID", {
													day: "2-digit",
													month: "long",
													year: "numeric",
											  })
											: "—"
									}
								/>
								<DetailRow
									label="Sekolah"
									value={selected.schools?.map(id => schoolMap.get(id) || id).join(", ") || "—"}
								/>
								<DetailRow
									label="Sabuk"
									value={<BeltBadge belt={selected.belt} />}
								/>
								{selected.imageUrl && (
									<div className="pt-3 pb-1 flex justify-center">
										<img
											src={selected.imageUrl}
											alt={selected.name}
											className="h-24 w-24 rounded-lg object-cover ring-2 ring-violet-500/20 shadow-sm"
											onError={(e) => {
												e.currentTarget.style.display = "none";
											}}
										/>
									</div>
								)}
							</div>
						) : (
							<p className="text-[13px] text-muted-foreground text-center py-6">
								Tidak ada data
							</p>
						)}
					</div>

					<DialogFooter className="px-5 pb-5 pt-1">
						<DialogClose asChild>
							<Button
								variant="outline"
								size="sm"
								className="w-full rounded-lg h-8 text-[13px] border-border/60"
							>
								Tutup
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}