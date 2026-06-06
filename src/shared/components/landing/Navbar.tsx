"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/shared/components/ui/button";

const navLinks = [
  { name: "Características", href: "/caracteristicas" },
  { name: "Precios", href: "/precios" },
  { name: "Recursos", href: "/recursos" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl">
        <div className="px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground font-display font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 bg-primary/10 rounded-lg shadow-inner flex items-center justify-center">
              <Image src="/icon.svg" alt="Metavix Logo" width={20} height={20} />
            </div>
            Metavix
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 px-4 py-2 rounded-full transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden md:inline-flex rounded-full px-4" })}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ className: "rounded-full px-5 shadow-md shadow-primary/20 min-h-[44px]" })}
            >
              Registrarse
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl hover:bg-black/5 transition-colors"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-white/40 px-4 pb-4 pt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 px-4 py-3 rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-border/50">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: "ghost", className: "w-full rounded-xl justify-center" })}
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
