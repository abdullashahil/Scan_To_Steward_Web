"use client"

import { antibiotics, restrictedAntibiotics } from "@/app/data/antibiotics"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ListOfAntibioticsContent() {
  return (
    <div className="space-y-8 text-lg text-muted-foreground">
      {/* Regular Antibiotics Section */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          Antibiotics
        </h2>
        <p className="mb-4">
          Common antibiotics grouped by their families. Click on each category to learn more about dosage and usage.
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
                  {group.category}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base">
                <div className="space-y-4 pb-2">
                  <p className="text-muted-foreground">{group.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">Typical Dosage</h4>
                      <p className="text-sm">{group.typicalDosage}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">Used For</h4>
                      <p className="text-sm">{group.use}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">Examples</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.examples.map((example) => (
                        <span
                          key={example}
                          className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full font-medium"
                        >
                          {example}
                        </span>
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
          Restricted / High-End Antibiotics
        </h2>
        <p className="mb-4">
          These antibiotics are reserved for severe or resistant infections and require strict medical supervision.
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
                      <h4 className="font-semibold text-red-800 text-sm">Restriction</h4>
                      <p className="text-red-700 text-sm">{antibiotic.restriction}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm pl-1">
                    <strong>Reason:</strong> {antibiotic.reason}
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
          <strong>⚠️ Important:</strong> Always consult a healthcare professional before taking any antibiotics.
          Self-medication can lead to antibiotic resistance and serious side effects.
        </p>
      </div>
    </div>
  )
}
