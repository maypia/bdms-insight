import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Stethoscope, Mail, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — BDMS Department Assistant" },
      { name: "description", content: "Sign in to BDMS internal department knowledge platform." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("pattara.c@bdms.local");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-primary to-[oklch(0.42_0.16_255)] text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold tracking-tight text-lg">BDMS</div>
            <div className="text-xs text-primary-foreground/75 -mt-0.5">Department Assistant</div>
          </div>
        </div>
        <div className="relative max-w-md">
          <div className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/70 mb-3">
            Internal knowledge, instantly
          </div>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            ค้นหาคำตอบ<br />ของทุกแผนก<br />ได้ใน<span className="italic font-light"> วินาทีเดียว</span>
          </h1>
          <p className="text-primary-foreground/85 mt-5 leading-relaxed">
            แพลตฟอร์มผู้ช่วยภายในองค์กรสำหรับพนักงาน BDMS — ขั้นตอน เอกสาร ติดต่อ และกระบวนการอนุมัติ ในที่เดียว
          </p>
        </div>
        <div className="relative text-xs text-primary-foreground/70">
          © 2026 Bangkok Dusit Medical Services · Internal use only
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="font-semibold">BDMS Department Assistant</div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            ลงชื่อเข้าใช้ด้วยอีเมลพนักงาน BDMS ของคุณ
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/" });
            }}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="text-xs font-medium text-foreground/80">Work email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@bdms.local"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/60"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground/80">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/60"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground/80">
              <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-ring/40" />
              Remember me on this device
            </label>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm inline-flex items-center justify-center gap-2 hover:opacity-95 shadow-[var(--shadow-soft)] transition"
            >
              Sign in <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 text-xs text-muted-foreground text-center">
            ต้องการความช่วยเหลือ? ติดต่อ{" "}
            <Link to="/" className="text-primary hover:underline">IT Helpdesk</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
