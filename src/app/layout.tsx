import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, ClipboardList, Plus, Sprout } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledyim Farm Livestock",
  description: "Small farm livestock records for cattle and goats"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-field-moss text-white shadow-sm"><Sprout size={20} /></span>
                <span className="leading-tight"><span className="block text-base font-black text-field-soil">Ledyim Farm</span><span className="hidden text-xs font-semibold text-field-moss sm:block">Livestock records</span></span>
              </Link>
              <div className="flex items-center gap-1 rounded-lg border border-white/70 bg-white/60 p-1 shadow-sm">
                <Link className="nav-link" href="/"><BarChart3 size={16} /> <span className="hidden sm:inline">Dashboard</span></Link>
                <Link className="nav-link" href="/animals"><ClipboardList size={16} /> <span className="hidden sm:inline">Animals</span></Link>
                <Link className="button-primary px-3 py-2" href="/animals/new"><Plus size={16} /> <span className="hidden sm:inline">Add</span></Link>
              </div>
            </nav>
          </header>
          <main className="page-wrap">{children}</main>
        </div>
      </body>
    </html>
  );
}
