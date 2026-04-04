import type { TranslationsKey } from "@/lib/translations"

export const antibiotics: {
  category: TranslationsKey;
  description: TranslationsKey;
  typicalDosage: TranslationsKey;
  use: TranslationsKey;
  examples: {
    name: string;
    dose?: string;
    usedFor?: TranslationsKey;
  }[];
}[] = [

  {
    category: "abxCat1",
    description: "abxDesc1",
    typicalDosage: "abxDosePattern1",
    use: "abxUse1",
    examples: [
      {
        name: "Amoxicillin",
        dose: "500 mg, 2–3 times daily",
        usedFor: "abxExUsed1"
      },
      {
        name: "Amoxicillin-Clavulanate",
        dose: "625 mg or 1 g, 2–3 times daily",
        usedFor: "abxExUsed2"
      },
      {
        name: "Piperacillin-Tazobactam",
        dose: "4.5 g IV every 6–8 hours",
        usedFor: "abxExUsed3"
      }
    ]
  },

  {
    category: "abxCat2",
    description: "abxDesc2",
    typicalDosage: "abxDosePattern2",
    use: "abxUse2",
    examples: [
      {
        name: "Ceftriaxone",
        dose: "1–2 g once daily (IV)",
        usedFor: "abxExUsed4"
      },
      {
        name: "Cefotaxime",
        dose: "1–2 g every 6–8 hours (IV)",
        usedFor: "abxExUsed5"
      },
      {
        name: "Cefuroxime",
        usedFor: "abxExUsed6"
      },
      {
        name: "Cefazolin",
        usedFor: "abxExUsed7"
      }
    ]
  },

  {
    category: "abxCat3",
    description: "abxDesc3",
    typicalDosage: "abxDosePattern3",
    use: "abxUse3",
    examples: [
      {
        name: "Meropenem",
        dose: "1 g every 8 hours (IV)",
        usedFor: "abxExUsed8"
      },
      {
        name: "Imipenem",
        dose: "500 mg every 6 hours (IV)",
        usedFor: "abxExUsed9"
      },
      {
        name: "Doripenem",
        usedFor: "abxExUsed10"
      }
    ]
  },

  {
    category: "abxCat4",
    description: "abxDesc4",
    typicalDosage: "abxDosePattern4",
    use: "abxUse4",
    examples: [
      {
        name: "Azithromycin",
        dose: "500 mg once daily",
        usedFor: "abxExUsed11"
      },
      {
        name: "Roxithromycin",
        usedFor: "abxExUsed12"
      }
    ]
  },

  {
    category: "abxCat5",
    description: "abxDesc5",
    typicalDosage: "abxDosePattern4",
    use: "abxUse5",
    examples: [
      {
        name: "Ciprofloxacin",
        dose: "500 mg twice daily",
        usedFor: "abxExUsed13"
      },
      {
        name: "Levofloxacin",
        dose: "500 mg once daily",
        usedFor: "abxExUsed14"
      },
      {
        name: "Ofloxacin",
        usedFor: "abxExUsed15"
      }
    ]
  },

  {
    category: "abxCat6",
    description: "abxDesc6",
    typicalDosage: "abxDosePattern5",
    use: "abxUse6",
    examples: [
      {
        name: "Gentamicin",
        usedFor: "abxExUsed16"
      },
      {
        name: "Amikacin",
        dose: "5–7 mg/kg per day",
        usedFor: "abxExUsed17"
      }
    ]
  },

  {
    category: "abxCat7",
    description: "abxDesc7",
    typicalDosage: "abxDosePattern6",
    use: "abxUse7",
    examples: [
      {
        name: "Doxycycline",
        dose: "100 mg twice daily",
        usedFor: "abxExUsed18"
      },
      {
        name: "Tetracycline",
        usedFor: "abxExUsed19"
      }
    ]
  },

  {
    category: "abxCat8",
    description: "abxDesc8",
    typicalDosage: "abxDosePattern7",
    use: "abxUse8",
    examples: [
      {
        name: "Vancomycin",
        usedFor: "abxExUsed20"
      },
      {
        name: "Teicoplanin",
        usedFor: "abxExUsed21"
      }
    ]
  },

  {
    category: "abxCat9",
    description: "abxDesc9",
    typicalDosage: "abxDosePattern8",
    use: "abxUse9",
    examples: [
      {
        name: "Linezolid",
        usedFor: "abxExUsed22"
      }
    ]
  },

  {
    category: "abxCat10",
    description: "abxDesc10",
    typicalDosage: "abxDosePattern9",
    use: "abxUse10",
    examples: [
      {
        name: "Daptomycin",
        usedFor: "abxExUsed23"
      }
    ]
  },

  {
    category: "abxCat11",
    description: "abxDesc11",
    typicalDosage: "abxDosePattern10",
    use: "abxUse11",
    examples: [
      {
        name: "Metronidazole",
        dose: "400–500 mg 2–3 times daily",
        usedFor: "abxExUsed24"
      },
      {
        name: "Ornidazole",
        usedFor: "abxExUsed25"
      },
      {
        name: "Tinidazole",
        dose: "2 g once daily (short course)",
        usedFor: "abxExUsed26"
      }
    ]
  },

  {
    category: "abxCat12",
    description: "abxDesc12",
    typicalDosage: "abxDosePattern11",
    use: "abxUse12",
    examples: [
      {
        name: "Nitrofurantoin",
        dose: "100 mg twice daily",
        usedFor: "abxExUsed27"
      }
    ]
  },

  {
    category: "abxCat13",
    description: "abxDesc13",
    typicalDosage: "abxDosePattern12",
    use: "abxUse13",
    examples: [
      {
        name: "Fosfomycin",
        dose: "3 g single dose",
        usedFor: "abxExUsed28"
      }
    ]
  },

  {
    category: "abxCat14",
    description: "abxDesc14",
    typicalDosage: "abxDosePattern13",
    use: "abxUse14",
    examples: [
      {
        name: "Aztreonam",
        dose: "1–2 g every 8–12 hours (IV)",
        usedFor: "abxExUsed29"
      }
    ]
  }

];


export const restrictedAntibiotics: {
  name: string;
  category: string;
  reason: TranslationsKey;
  restriction: TranslationsKey;
}[] = [

  {
    name: "Colistin",
    category: "Polymyxin",
    reason: "resReason3",
    restriction: "resRest3"
  },

  {
    name: "Vancomycin",
    category: "Glycopeptide",
    reason: "resReason1",
    restriction: "resRest1"
  },

  {
    name: "Linezolid",
    category: "Oxazolidinone",
    reason: "resReason2",
    restriction: "resRest2"
  },

  {
    name: "Daptomycin",
    category: "Lipopeptide",
    reason: "resReason4",
    restriction: "resRest4"
  },

  {
    name: "Meropenem",
    category: "Carbapenem",
    reason: "resReason1",
    restriction: "resRest1"
  },

  {
    name: "Imipenem",
    category: "Carbapenem",
    reason: "resReason1",
    restriction: "resRest1"
  },

  {
    name: "Tigecycline",
    category: "Glycylcycline",
    reason: "resReason5",
    restriction: "resRest5"
  }

];