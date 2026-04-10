"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";

function LangDropdown() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  const labelMap = {
    en: "English",
    hi: "हिन्दी",
    ml: "Malayalam",
  } as const;

  const flagMap = {
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
            onClick={() => setLang(opt.code as "en" | "hi" | "ml")}
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
  const { lang } = useLanguage();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Scan to Steward"
            width={140}
            height={40}
            className="h-12 w-auto"
            priority
          />
          <span className="font-bold text-lg text-foreground">{t("appName", lang)}</span>

        </Link>
        <div className="relative">
          <LangDropdown />
        </div>
      </div>
    </nav>
  );
}
