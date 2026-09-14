import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledyim Farm Livestock",
  description: "Small farm livestock records for cattle and goats"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-stone-50 text-field-ink">
          <header className="border-b border-stone-200 bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
              <Link href="/" className="text-lg font-bold text-field-moss">Ledyim Farm</Link>
              <div className="flex gap-2 text-sm font-medium">
                <Link className="nav-link" href="/">Dashboard</Link>
                <Link className="nav-link" href="/animals">Animals</Link>
                <Link className="button-primary px-3 py-2" href="/animals/new">Add</Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
