"use client";

import React, { useEffect, useState } from "react";
import coachService from "@/services/coach.services";
import { ICoach } from "@/types/Coach";
import { Button } from "@/components/ui/button";

export default function CoachPage() {
  const [data, setData] = useState<ICoach[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [schoolsInput, setSchoolsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await coachService.list();
        if (mounted) setData(res?.data ?? res ?? []);
      } catch (e: any) {
        setError(e?.message || "Gagal mengambil data");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        name,
        birthdate: birthdate || undefined,
        schools: schoolsInput ? schoolsInput.split(",").map((s) => s.trim()).filter(Boolean) : [],
      } as any;

      const res = await coachService.create(payload);
      const created = res?.data ?? res;
      if (created) {
        setData((prev) => [created, ...prev]);
      } else {
        // if API returned wrapper { data: { ... } }
        if (res && typeof res === "object" && "data" in res && res.data) {
          setData((prev) => [res.data, ...prev]);
        }
      }

      // reset form
      setName("");
      setBirthdate("");
      setSchoolsInput("");
      setShowForm(false);
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan pelatih");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Daftar Pelatih</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowForm(true)}>Tambah Pelatih</Button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="overflow-auto rounded-md border">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Tanggal Lahir</th>
              <th className="px-4 py-2">Sekolah</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Memuat...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Belum ada data pelatih.
                </td>
              </tr>
            ) : (
              data.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{new Date(c.birthdate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{(c.schools || []).join(", ")}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm">Lihat</Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Add form modal (simple) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-medium mb-4">Tambah Pelatih</h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3"
            >
              <label className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Nama</span>
                <input
                  className="border px-3 py-2 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Tanggal Lahir</span>
                <input
                  type="date"
                  className="border px-3 py-2 rounded"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Sekolah (pisah koma)</span>
                <input
                  className="border px-3 py-2 rounded"
                  value={schoolsInput}
                  onChange={(e) => setSchoolsInput(e.target.value)}
                />
              </label>

              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
