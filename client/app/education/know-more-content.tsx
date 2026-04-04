"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { t } from "@/lib/translations"

export default function KnowMoreContent() {
  const { lang } = useLanguage()
  return (
    <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
      <div>
        <h3 className="font-semibold text-foreground">🦠 {t("infections", lang)}</h3>
        <p>
          {t("infectionsDesc", lang)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">💊 {t("whatAreAntibiotics", lang)}</h3>
        <p>
          {t("whatAreAntibioticsDesc", lang)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">⚠️ {t("misuseOfAntibiotics", lang)}</h3>
        <p>
          {t("misuseOfAntibioticsDesc", lang)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">🧬 {t("antibioticResistanceAMR", lang)}</h3>
        <p>
          {t("amrDesc", lang)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">✅ {t("properUse", lang)}</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("properUse1", lang)}</li>
          <li>{t("properUse2", lang)}</li>
          <li>{t("properUse3", lang)}</li>
          <li>{t("properUse4", lang)}</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">⏰ {t("medicationAdherence", lang)}</h3>
        <p>
          {t("adherenceDesc", lang)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">⚕️ {t("sideEffectsSafety", lang)}</h3>
        <p>
          {t("sideEffectsDesc", lang)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">🧪 {t("bacterialVsViral", lang)}</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>{t("bacterial", lang)}</strong> {t("bacterialExample", lang)}</li>
          <li><strong>{t("viral", lang)}</strong> {t("viralExample", lang)}</li>
        </ul>
      </div>
    </div>
  )
}
