"use client";

import React, { useEffect, useRef, useState } from "react";
import coachService, {
  ICreateCoachPayload,
} from "@/services/coach-setting.services";

import schoolService from "@/services/school.services";

import type { ICoach } from "@/types/Coach";
import type { ISchool } from "@/types/School";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const [coaches, setCoaches] = useState<ICoach[]>([]);
  const [schools, setSchools] = useState<ISchool[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([]);

  const [openSchoolDropdown, setOpenSchoolDropdown] =
    useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const coachRes = await coachService.list();
        const schoolRes = await schoolService.list();

        if (!mounted) return;

        const coachData = Array.isArray(coachRes?.data)
          ? coachRes.data
          : [];

        const schoolData = Array.isArray(schoolRes?.data)
          ? schoolRes.data
          : [];

        setCoaches(coachData);
        setSchools(schoolData);
      } catch (err: any) {
        console.error(err);

        setError(err?.message || "Gagal mengambil data");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenSchoolDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const toggleSchool = (id: string) => {
    setSelectedSchoolIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleCreate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const payload: ICreateCoachPayload = {
        name,
        birthdate,
        schoolIds:
          selectedSchoolIds.length > 0
            ? selectedSchoolIds
            : undefined,
      };

      const res: any = await coachService.create(
        payload
      );

      const created = res?.data ?? res;

      if (created) {
        setCoaches((prev) => [created, ...prev]);
      }

      setShowCreate(false);

      setName("");
      setBirthdate("");
      setSelectedSchoolIds([]);
    } catch (err: any) {
      setError(
        err?.message || "Gagal membuat pelatih"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pelatih ini?")) return;

    try {
      await coachService.remove(id);

      setCoaches((prev) =>
        prev.filter((coach) => coach._id !== id)
      );
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Pengaturan - Pelatih
        </h1>

        <Button onClick={() => setShowCreate(true)}>
          Tambah Pelatih
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelatih</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>
                    Tanggal Lahir
                  </TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead className="w-[140px] text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center"
                    >
                      Memuat...
                    </TableCell>
                  </TableRow>
                ) : coaches.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Belum ada pelatih
                    </TableCell>
                  </TableRow>
                ) : (
                  coaches.map((coach) => (
                    <TableRow key={coach._id}>
                      <TableCell className="font-medium">
                        {coach.name}
                      </TableCell>

                      <TableCell>
                        {coach.birthdate
                          ? new Date(
                              coach.birthdate
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      <TableCell>
                        {coach.schools &&
                        coach.schools.length > 0
                          ? coach.schools
                              .map((id) => {
                                const school =
                                  schools.find(
                                    (s) =>
                                      s._id === id
                                  );

                                return school
                                  ? school.name
                                  : id;
                              })
                              .join(", ")
                          : "-"}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              coach._id &&
                              handleDelete(
                                coach._id
                              )
                            }
                          >
                            Hapus
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

      <Dialog
        open={showCreate}
        onOpenChange={setShowCreate}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Tambah Pelatih
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={handleCreate}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nama
              </label>

              <Input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tanggal Lahir
              </label>

              <Input
                type="date"
                value={birthdate}
                onChange={(e) =>
                  setBirthdate(e.target.value)
                }
                required
              />
            </div>

            {/* CUSTOM MULTI SELECT */}
            <div
              className="space-y-2 relative"
              ref={dropdownRef}
            >
              <label className="text-sm font-medium">
                Sekolah
              </label>

              <button
                type="button"
                onClick={() =>
                  setOpenSchoolDropdown(
                    !openSchoolDropdown
                  )
                }
                className="flex min-h-11 w-full flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2 text-left"
              >
                {selectedSchoolIds.length > 0 ? (
                  schools
                    .filter((school) =>
                      selectedSchoolIds.includes(
                        school._id
                      )
                    )
                    .map((school) => (
                      <div
                        key={school._id}
                        className="flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                      >
                        <span>{school.name}</span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            toggleSchool(
                              school._id
                            );
                          }}
                          className="font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Pilih sekolah...
                  </span>
                )}
              </button>

              {openSchoolDropdown && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                  {schools.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      Tidak ada sekolah
                    </div>
                  ) : (
                    schools.map((school) => {
                      const checked =
                        selectedSchoolIds.includes(
                          school._id
                        );

                      return (
                        <label
                          key={school._id}
                          className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-muted"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleSchool(
                                school._id
                              )
                            }
                            className="h-4 w-4"
                          />

                          <span className="text-sm">
                            {school.name}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Menyimpan..."
                  : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}