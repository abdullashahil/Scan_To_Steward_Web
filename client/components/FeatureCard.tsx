"use client";

import { motion } from "framer-motion";
import { GraduationCap, FileSearch, Bot, BellRing, type LucideIcon } from "lucide-react";

type Variant = "primary" | "teal" | "amber" | "rose";

interface FeatureCardProps {
  iconName: "GraduationCap" | "FileSearch" | "Bot" | "BellRing";
  title: string;
  description: string;
  ctaLabel?: string;
  variant?: Variant;
  href?: string;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = { GraduationCap, FileSearch, Bot, BellRing };

const variantStyles: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: "bg-primary", text: "text-white" },
  teal: { bg: "bg-secondary", text: "text-white" },
  amber: { bg: "bg-amber-500", text: "text-white" },
  rose: { bg: "bg-rose-500", text: "text-white" },
};

export default function FeatureCard({
  iconName,
  title,
  description,
  ctaLabel = "Try this",
  variant = "primary",
  href,
  index = 0,
}: FeatureCardProps) {
  const Icon = iconMap[iconName];
  const { bg, text } = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-card rounded-xl border border-border p-6 flex flex-col transition-all duration-300 hover:shadow-[var(--card-shadow-hover)] shadow-[var(--card-shadow)]"
    >
      <div className={`h-12 w-12 rounded-lg ${bg} ${text} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{description}</p>
      <button
        className={`
          cursor-pointer
          mt-auto
          inline-flex
          items-center
          justify-center
          gap-2
          px-4
          py-2
          rounded-lg
          text-sm
          font-semibold
          transition-all
          duration-200
          border
          ${text}
          ${bg}
          hover:opacity-90
          hover:shadow-md
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-primary
        `}
        onClick={() => href && (window.location.href = href)}
      >
        {ctaLabel}
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </button>
    </motion.div>
  );
}
