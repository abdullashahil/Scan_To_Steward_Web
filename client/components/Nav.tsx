"use client";

import { useState } from "react";
import { Shield, Languages } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function LangDropdown() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi" | "ml">("en");

  const labelMap: Record<typeof lang, string> = {
    en: "English",
    hi: "हिन्दी",
    ml: "Malayalam",
  } as const;

  const flagMap: Record<typeof lang, string> = {
    en: "🇬🇧",
    hi: "🇮🇳",
    ml: "🇮🇳",
  } as const;

  return (
    <DropdownMenu onOpenChange={(v) => setOpen(v)} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex items-center gap-2 border-border bg-card text-foreground hover:bg-muted/60 cursor-pointer"
        >
          <Languages className="h-4 w-4 text-foreground/80" aria-hidden="true" />
          <span className="hidden sm:inline">{labelMap[lang]}</span>
          <span className="sm:hidden" aria-hidden="true">{flagMap[lang]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {([
          { code: "en", label: "English", flag: "🇬🇧" },
          { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
          { code: "ml", label: "Malayalam", flag: "🇮🇳" },
        ] as const).map((opt) => (
          <DropdownMenuItem
            key={opt.code}
            className={`cursor-pointer flex items-center gap-2 ${lang === opt.code ? "text-foreground" : "text-muted-foreground"}`}
            onClick={() => setLang(opt.code)}
          >
            <span className="text-base" aria-hidden>
              {opt.flag}
            </span>
            <span>{opt.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-secondary" />
          <span className="font-bold text-lg text-foreground">Scan to Steward</span>
        </Link>
        <div className="relative">
          <LangDropdown />
        </div>
      </div>
    </nav>
  );
}
