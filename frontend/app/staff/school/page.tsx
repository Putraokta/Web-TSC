"use client";

import React, { useEffect, useState } from "react";
import schoolService from "@/services/school.services";
import { ISchool, ICreateSchool } from "@/types/School";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Plus, Pencil, Eye, School } from "lucide-react";

export default function SchoolPage() {
  const [data, setData] = useState<ISchool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSchools() {
      setLoading(true);

      try {
        const res = await schoolService.list();
        const schools = res?.data ?? res ?? [];

        if (mounted) {
          setData(schools);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Gagal mengambil data sekolah");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSchools();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const payload: ICreateSchool = {
        name,
        address,
        phone,
        email,
      };

      const res = await schoolService.create(payload);
      const created = res?.data ?? res;

      if (created) {
        setData((prev) => [created, ...prev]);
      }

      setName("");
      setAddress("");
      setPhone("");
      setEmail("");

      setShowForm(false);
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan sekolah");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Data Sekolah
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data sekolah anggota Trisula Sport Club
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Sekolah
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* TABLE CARD */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="w-5 h-5 text-primary" />
            Daftar Sekolah
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Nama Sekolah</TableHead>
                  {/* <TableHead>Alamat</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Email</TableHead> */}
                  <TableHead className="w-[140px] text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8"
                    >
                      Memuat data sekolah...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Belum ada data sekolah
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((school) => (
                    <TableRow key={school._id}>
                      <TableCell className="font-medium">
                        {school.name}
                      </TableCell>

                      {/* <TableCell>
                        {school.address || "-"}
                      </TableCell>

                      <TableCell>
                        {school.phone || "-"}
                      </TableCell>

                      <TableCell>
                        {school.email || "-"}
                      </TableCell> */}

                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="secondary"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Sekolah</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nama Sekolah
              </label>

              <Input
                placeholder="Masukkan nama sekolah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* <div className="space-y-2">
              <label className="text-sm font-medium">
                Alamat
              </label>

              <Input
                placeholder="Masukkan alamat sekolah"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                No. Telepon
              </label>

              <Input
                placeholder="Masukkan nomor telepon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>

              <Input
                type="email"
                placeholder="Masukkan email sekolah"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div> */}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Batal
              </Button>

              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}