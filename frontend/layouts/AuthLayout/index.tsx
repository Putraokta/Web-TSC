import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand">
          <div className="brand-card">
            <Image src="/logo.jpeg" alt="Trisula Sport Club" width={120} height={120} />
          </div>
          <h1 className="brand-title">
            Trisula <span>Sport Club</span>
          </h1>
          <p className="brand-subtitle">Portal Akademik untuk pengelolaan data anggota, jadwal latihan, dan informasi kegiatan klub</p>
        </section>

        <section className="auth-panel">
          <div className="auth-card">{children}</div>
          <p className="auth-footer">© 2026 Trisula Sport Club. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
}
