"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import athleteService from "@/services/athlete.services"
import type { IAthlete } from "@/types/Athlete"

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

export default function AthletePage() {
	const [athletes, setAthletes] = useState<IAthlete[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true
		setLoading(true)
		athleteService
			.list()
			.then((res: any) => {
				if (!mounted) return
				// assume API returns array directly or { data }
				const data = Array.isArray(res) ? res : res?.data ?? []
				setAthletes(data)
			})
			.catch(() => setAthletes([]))
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
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Atlet</h2>
			</div>

			<div className="rounded-md border bg-card p-4">
				{loading ? (
					<div className="p-4">Memuat...</div>
				) : athletes.length === 0 ? (
					<div className="p-4">Tidak ada data atlet.</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nama</TableHead>
								<TableHead>Tanggal Lahir</TableHead>
								<TableHead>Sekolah</TableHead>
								<TableHead>Sabuk</TableHead>
								<TableHead>Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{athletes.map((a) => (
								<TableRow key={a._id}>
									<TableCell className="font-medium">{a.name}</TableCell>
									<TableCell>
										{a.birthdate
											? new Date(a.birthdate).toLocaleDateString()
											: "-"}
									</TableCell>
									<TableCell>{(a.schools || []).length}</TableCell>
									<TableCell>{a.belt ?? "-"}</TableCell>
									<TableCell>
										<Button size="sm" onClick={() => openDetail(a._id)}>
											Detail
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{detailLoading ? "Memuat..." : selected?.name ?? "Detail Atlet"}</DialogTitle>
						<DialogDescription>
							{detailLoading
								? "Sedang mengambil data atlet..."
								: selected
								? `ID: ${selected._id}`
								: "Tidak ada data"}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-2">
						{detailLoading ? (
							<div>Memuat...</div>
						) : selected ? (
							<div className="space-y-2">
								<div>
									<strong>Nama:</strong> {selected.name}
								</div>
								<div>
									<strong>Tanggal Lahir:</strong>{" "}
									{selected.birthdate ? new Date(selected.birthdate).toLocaleDateString() : "-"}
								</div>
								<div>
									<strong>Sekolah:</strong> {(selected.schools || []).length}
								</div>
								<div>
									<strong>Sabuk:</strong> {selected.belt ?? "-"}
								</div>
							</div>
						) : (
							<div>Tidak ada data</div>
						)}
					</div>

					<DialogFooter showCloseButton />
				</DialogContent>
			</Dialog>
		</div>
	)
}
