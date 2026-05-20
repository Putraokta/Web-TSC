"use client"

import React, { useEffect, useState } from "react";
import financeService from "@/services/finance.services";
import type { IFinance } from "@/types/Finance";

import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";

export default function FinancePage() {
	const [items, setItems] = useState<IFinance[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		setLoading(true);
		financeService
			.list()
			.then((res: any) => {
				if (!mounted) return;
				const data = Array.isArray(res) ? res : res?.data ?? [];
				setItems(data);
			})
			.catch(() => setItems([]))
			.finally(() => mounted && setLoading(false));

		return () => {
			mounted = false;
		};
	}, []);

	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<IFinance | null>(null);
	const [detailLoading, setDetailLoading] = useState(false);

	// create form states
	const [showCreate, setShowCreate] = useState(false);
	const [type, setType] = useState<"income" | "expense">("income");
	const [balance, setBalance] = useState<string>("");
	const [description, setDescription] = useState("");

	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const openDetail = (id: string) => {
		setSelected(null);
		setOpen(true);
		setDetailLoading(true);
		financeService
			.get(id)
			.then((res: any) => {
				const data = res?.data ?? (Array.isArray(res) ? res[0] : res);
				setSelected(data);
			})
			.catch(() => setSelected(null))
			.finally(() => setDetailLoading(false));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Keuangan</h2>
				<div>
					<Button size="sm" onClick={() => setShowCreate(true)}>
						Tambah
					</Button>
				</div>
			</div>

			<div className="rounded-md border bg-card p-4">
				{loading ? (
					<div className="p-4">Memuat...</div>
				) : items.length === 0 ? (
					<div className="p-4">Tidak ada data keuangan.</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Tipe</TableHead>
								<TableHead>Jumlah</TableHead>
								<TableHead>Deskripsi</TableHead>
								{/* <TableHead>Tanggal</TableHead> */}
								<TableHead className="w-[140px] text-center">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((f) => (
								<TableRow key={f._id}>
									<TableCell className="font-medium">{f.type}</TableCell>
									<TableCell>{Number(f.balance).toLocaleString()}</TableCell>
									<TableCell>{f.description ?? "-"}</TableCell>
									<TableCell>{f.date ? new Date(f.date).toLocaleDateString() : "-"}</TableCell>
									<TableCell className="text-center">
										<Button size="sm" onClick={() => openDetail(f._id!)}>
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
						<DialogTitle>{detailLoading ? "Memuat..." : selected?.type ?? "Detail Keuangan"}</DialogTitle>
						<DialogDescription>
							{detailLoading ? "Mengambil data..." : selected ? `ID: ${selected._id}` : "Tidak ada data"}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-2">
						{detailLoading ? (
							<div>Memuat...</div>
						) : selected ? (
							<div className="space-y-2">
								<div>
									<strong>Tipe:</strong> {selected.type}
								</div>
								<div>
									<strong>Jumlah:</strong> {Number(selected.balance).toLocaleString()}
								</div>
								<div>
									<strong>Deskripsi:</strong> {selected.description ?? "-"}
								</div>
								{/* <div>
									<strong>Tanggal:</strong> {selected.date ? new Date(selected.date).toLocaleDateString() : "-"}
								</div> */}
							</div>
						) : (
							<div>Tidak ada data</div>
						)}
					</div>

					<DialogFooter showCloseButton />
				</DialogContent>
			</Dialog>

			{/* CREATE FORM MODAL */}
			<Dialog open={showCreate} onOpenChange={setShowCreate}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Tambah Keuangan</DialogTitle>
					</DialogHeader>

					<form
						className="space-y-4"
						onSubmit={async (e) => {
							e.preventDefault();
							setFormError(null);
							if (!balance || Number(balance) <= 0) {
								setFormError("Masukkan jumlah yang valid");
								return;
							}
							setSubmitting(true);
							try {
								const payload = {
									type,
									balance: Number(balance),
									description,
								};
								const res = await financeService.create(payload);
								const created = res?.data ?? res;
								if (created) {
									setItems((prev) => [created, ...prev]);
								}
								setShowCreate(false);
								setType("income");
								setBalance("");
								setDescription("");
							} catch (err: any) {
								setFormError(err?.message || "Gagal menyimpan data");
							} finally {
								setSubmitting(false);
							}
						}}
					>
						<div className="grid gap-2">
							<div>
								<label className="text-sm font-medium">Tipe</label>
								<select
									className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base"
									value={type}
									onChange={(e) => setType(e.target.value as "income" | "expense")}
								>
									<option value="income">Pemasukan</option>
									<option value="expense">Pengeluaran</option>
								</select>
							</div>

							<div>
								<label className="text-sm font-medium">Jumlah</label>
								<Input
									type="number"
									value={balance}
									onChange={(e) => setBalance(e.target.value)}
									required
								/>
							</div>

							<div>
								<label className="text-sm font-medium">Deskripsi</label>
								<Input value={description} onChange={(e) => setDescription(e.target.value)} />
							</div>



							{formError && <div className="text-sm text-red-500">{formError}</div>}
						</div>

						<DialogFooter>
							<Button type="submit" disabled={submitting}>
								{submitting ? "Menyimpan..." : "Simpan"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

