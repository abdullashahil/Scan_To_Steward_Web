"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Languages } from "lucide-react";
// import heroImage from "@/public/hero-medical.jpeg";
import FeatureCard from "@/components/FeatureCard";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const features = [
  {
    iconName: "GraduationCap" as const,
    title: "Patient Education",
    description: "Understand your antibiotics and how to use them safely.",
    variant: "primary" as const,
    href: "/education",
  },
  {
    iconName: "FileSearch" as const,
    title: "Prescription Analysis",
    description: "Upload your prescription and get a clear medicine explanation.",
    variant: "teal" as const,
    href: "/prescription",
  },
  {
    iconName: "Bot" as const,
    title: "AI Chatbot Assistant",
    description: "Ask any antibiotic question and get instant AI guidance.",
    variant: "amber" as const,
    href: "/chat",
  },
  {
    iconName: "BellRing" as const,
    title: "Adherence Reminders",
    description: "Get smart reminders so you never miss your medicine.",
    variant: "rose" as const,
    href: "/reminders",
  },
];

export default function Home() {
  // Inline component for language selection in nav
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
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(175_55%_42%_/_0.15),_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-xs font-medium text-white/80">AI-Powered Healthcare</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Smarter Antibiotic{" "}
                <span className="text-gradient">Stewardship</span>
              </h1>
              <p className="text-lg text-white/75 leading-relaxed max-w-lg mb-8">
                Scan prescriptions, educate patients, track adherence, and get AI-powered guidance — all in one platform designed for safer antibiotic use.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="cursor-pointer bg-secondary text-white px-7 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-secondary/25"
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 rounded-2xl bg-secondary/10 blur-3xl" />
              <Image
                src="/hero-medical.jpeg"
                alt="AI-powered prescription analysis dashboard"
                width={500}
                height={500}
                className="relative rounded-2xl shadow-2xl animate-float"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 lg:py-28 section-divider" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Modules</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4">
              Four Tools for Safer Antibiotic Use
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A comprehensive suite designed to optimize every step of the antibiotic lifecycle.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="hero-gradient py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              24/7 AI Support for Safer Antibiotic Use
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Join healthcare professionals using intelligent tools to combat antibiotic resistance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-secondary" />
            <span className="font-semibold text-foreground text-sm">Scan to Steward</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Scan to Steward. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
