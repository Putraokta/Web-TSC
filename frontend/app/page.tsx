import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent p-14 border-r border-white/10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <Image
                  src="/logo.jpeg"
                  alt="TSC Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Trisula
                  <span className="text-emerald-400"> Sport Club</span>
                </h1>

                <p className="text-zinc-400 mt-1">
                  Portal Akademik & Manajemen Atlet
                </p>
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-lg max-w-lg">
              Sistem informasi manajemen atlet, jadwal latihan, sekolah,
              prestasi, dan administrasi pencak silat Trisula Sport Club.
            </p>

            {/* <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-2xl font-bold text-white">100+</h3>
                <p className="text-sm text-zinc-400">Atlet Aktif</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-2xl font-bold text-white">25+</h3>
                <p className="text-sm text-zinc-400">Kejuaraan</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-2xl font-bold text-white">10+</h3>
                <p className="text-sm text-zinc-400">Pelatih</p>
              </div>
            </div> */}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}