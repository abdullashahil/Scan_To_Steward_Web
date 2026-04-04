"use client"

import { antibiotics, restrictedAntibiotics } from "@/app/data/antibiotics"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/translations"

export default function ListOfAntibioticsContent() {
  const { lang } = useLanguage()
  return (
    <div className="space-y-8 text-lg text-muted-foreground">
      {/* Regular Antibiotics Section */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          {t("antibioticsHeading", lang)}
        </h2>
        <p className="mb-4">
          {t("antibioticsIntro", lang)}
        </p>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {antibiotics.map((group) => (
            <AccordionItem
              key={group.category}
              value={group.category}
              className="border rounded-lg px-4 bg-background data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-lg text-left font-semibold text-foreground hover:no-underline py-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span>
                  {t(group.category, lang)}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <div className="space-y-4 pb-2">
                  <p className="text-muted-foreground">{t(group.description, lang)}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{t("typicalDosage", lang)}</h4>
                      <p className="text-sm">{t(group.typicalDosage, lang)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{t("usedFor", lang)}</h4>
                      <p className="text-sm">{t(group.use, lang)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">{t("examples", lang)}</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.examples.map((example) => (
                        <div
                          key={example.name}
                          className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-3 py-2 bg-primary/10 text-primary text-sm rounded-lg"
                        >
                          <span className="font-semibold">{example.name}</span>
                          {example.dose && (
                            <span className="text-xs text-muted-foreground sm:border-l sm:pl-3 sm:border-primary/30">
                              {example.dose}
                            </span>
                          )}
                          {example.usedFor && (
                            <span className="text-xs text-muted-foreground">
                              {t(example.usedFor, lang)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Restricted Antibiotics Section */}
      <section className="pt-4 border-t">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          {t("restrictedAntibiotics", lang)}
        </h2>
        <p className="mb-4">
          {t("restrictedDesc", lang)}
        </p>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {restrictedAntibiotics.map((antibiotic) => (
            <AccordionItem
              key={antibiotic.name}
              value={antibiotic.name}
              className="border rounded-lg px-4 bg-red-50/50 data-[state=open]:shadow-md transition-shadow border-red-200"
            >
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline py-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium uppercase tracking-wide">
                    {antibiotic.category}
                  </span>
                  {antibiotic.name}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <div className="space-y-3 pb-2">
                  <div className="flex items-start gap-2 p-3 bg-red-100/50 rounded-lg">
                    <span className="text-red-600 mt-0.5">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-red-800 text-sm">{t("restriction", lang)}</h4>
                      <p className="text-red-700 text-sm">{t(antibiotic.restriction, lang)}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm pl-1">
                    <strong>{t("reason", lang)}:</strong> {t(antibiotic.reason, lang)}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Warning */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ {t("antibioticsWarning", lang)}
        </p>
      </div>
    </div>
  )
}
