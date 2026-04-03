export const antibiotics = [

  {
    category: "Penicillins & Beta-lactam combinations",
    description: "Common first-choice antibiotics for mild to moderate infections.",
    typicalDosage: "Usually taken 2–3 times a day or given as an injection.",
    use: "Respiratory, urinary, and skin infections",
    examples: [
      {
        name: "Amoxicillin",
        dose: "500 mg, 2–3 times daily",
        usedFor: "Throat, sinus, and lung infections"
      },
      {
        name: "Amoxicillin-Clavulanate",
        dose: "625 mg or 1 g, 2–3 times daily",
        usedFor: "Respiratory and abdominal infections"
      },
      {
        name: "Piperacillin-Tazobactam",
        dose: "4.5 g IV every 6–8 hours",
        usedFor: "Severe infections like sepsis"
      }
    ]
  },

  {
    category: "Cephalosporins",
    description: "Widely used antibiotics in hospitals for serious infections.",
    typicalDosage: "Usually given once or twice daily as an injection.",
    use: "Pneumonia, sepsis, urinary infections",
    examples: [
      {
        name: "Ceftriaxone",
        dose: "1–2 g once daily (IV)",
        usedFor: "Severe infections and typhoid"
      },
      {
        name: "Cefotaxime",
        dose: "1–2 g every 6–8 hours (IV)",
        usedFor: "Serious infections like meningitis"
      },
      {
        name: "Cefuroxime",
        usedFor: "Respiratory and urinary infections"
      },
      {
        name: "Cefazolin",
        usedFor: "Preventing surgical infections"
      }
    ]
  },

  {
    category: "Carbapenems",
    description: "Strong antibiotics used for severe or resistant infections.",
    typicalDosage: "Given through IV in hospitals.",
    use: "Critical and drug-resistant infections",
    examples: [
      {
        name: "Meropenem",
        dose: "1 g every 8 hours (IV)",
        usedFor: "Severe and ICU infections"
      },
      {
        name: "Imipenem",
        dose: "500 mg every 6 hours (IV)",
        usedFor: "Serious infections"
      },
      {
        name: "Doripenem",
        usedFor: "Severe hospital infections"
      }
    ]
  },

  {
    category: "Aminoglycosides",
    description: "Used for serious infections, often along with other antibiotics.",
    typicalDosage: "Given as injection based on body weight.",
    use: "Severe infections",
    examples: [
      {
        name: "Gentamicin",
        usedFor: "Serious bacterial infections"
      },
      {
        name: "Amikacin",
        dose: "5–7 mg/kg per day",
        usedFor: "Severe infections"
      }
    ]
  },

  {
    category: "Glycopeptides",
    description: "Used for resistant infections like MRSA.",
    typicalDosage: "Given via IV with monitoring.",
    use: "Bloodstream and resistant infections",
    examples: [
      {
        name: "Vancomycin",
        usedFor: "MRSA and severe infections"
      },
      {
        name: "Teicoplanin",
        usedFor: "Resistant infections"
      }
    ]
  },

  {
    category: "Oxazolidinones",
    description: "Reserved for difficult-to-treat infections.",
    typicalDosage: "Usually taken twice daily.",
    use: "Resistant infections",
    examples: [
      {
        name: "Linezolid",
        usedFor: "MRSA and VRE infections"
      }
    ]
  },

  {
    category: "Lipopeptides",
    description: "Used for severe resistant infections.",
    typicalDosage: "Given once daily as injection.",
    use: "Serious infections",
    examples: [
      {
        name: "Daptomycin",
        usedFor: "Severe resistant infections"
      }
    ]
  },

  {
    category: "Polymyxins",
    description: "Last-resort antibiotics for highly resistant bacteria.",
    typicalDosage: "Given in hospitals under strict monitoring.",
    use: "Multi-drug resistant infections",
    examples: [
      {
        name: "Colistin",
        usedFor: "Highly resistant infections"
      },
      {
        name: "Polymyxin B",
        usedFor: "Severe resistant infections"
      }
    ]
  },

  {
    category: "Fluoroquinolones",
    description: "Broad-spectrum antibiotics available as tablets or injections.",
    typicalDosage: "Usually taken once or twice daily.",
    use: "Urinary, stomach, and respiratory infections",
    examples: [
      {
        name: "Ciprofloxacin",
        dose: "500 mg twice daily",
        usedFor: "UTI and gut infections"
      },
      {
        name: "Levofloxacin",
        dose: "500 mg once daily",
        usedFor: "Respiratory infections"
      },
      {
        name: "Ofloxacin",
        usedFor: "Urinary and stomach infections"
      }
    ]
  },

  {
    category: "Macrolides",
    description: "Common antibiotics for respiratory infections.",
    typicalDosage: "Usually taken once daily.",
    use: "Respiratory infections",
    examples: [
      {
        name: "Azithromycin",
        dose: "500 mg once daily",
        usedFor: "Respiratory infections and typhoid"
      },
      {
        name: "Roxithromycin",
        usedFor: "Respiratory infections"
      }
    ]
  },

  {
    category: "Tetracyclines",
    description: "Used for a wide range of infections.",
    typicalDosage: "Usually taken once or twice daily.",
    use: "Skin and respiratory infections",
    examples: [
      {
        name: "Doxycycline",
        dose: "100 mg twice daily",
        usedFor: "Respiratory and skin infections"
      },
      {
        name: "Tetracycline",
        usedFor: "Skin infections"
      }
    ]
  },

  {
    category: "Nitroimidazoles",
    description: "Effective for gut and anaerobic infections.",
    typicalDosage: "Usually taken 2–3 times daily.",
    use: "Abdominal and parasitic infections",
    examples: [
      {
        name: "Metronidazole",
        dose: "400–500 mg 2–3 times daily",
        usedFor: "Gut infections and amoebiasis"
      },
      {
        name: "Ornidazole",
        usedFor: "Parasitic infections"
      },
      {
        name: "Tinidazole",
        dose: "2 g once daily (short course)",
        usedFor: "Parasitic infections"
      }
    ]
  },

  {
    category: "Antifungals",
    description: "Used to treat fungal infections.",
    typicalDosage: "Usually taken once daily or as prescribed.",
    use: "Fungal infections",
    examples: [
      {
        name: "Fluconazole",
        dose: "100–200 mg once daily",
        usedFor: "Fungal infections"
      },
      {
        name: "Caspofungin",
        dose: "70 mg first dose, then 50 mg daily",
        usedFor: "Severe fungal infections"
      }
    ]
  }

];


export const restrictedAntibiotics = [

  {
    name: "Colistin",
    category: "Polymyxin",
    reason: "Last-resort antibiotic for highly resistant infections",
    restriction: "Use only with specialist approval"
  },

  {
    name: "Vancomycin",
    category: "Glycopeptide",
    reason: "Used for serious resistant infections like MRSA",
    restriction: "Requires monitoring and controlled use"
  },

  {
    name: "Linezolid",
    category: "Oxazolidinone",
    reason: "Used for multi-drug resistant infections",
    restriction: "Should not be used without proper indication"
  },

  {
    name: "Daptomycin",
    category: "Lipopeptide",
    reason: "Reserved for severe resistant infections",
    restriction: "Hospital-only use"
  },

  {
    name: "Meropenem",
    category: "Carbapenem",
    reason: "Very strong antibiotic for critical infections",
    restriction: "Avoid overuse to prevent resistance"
  },

  {
    name: "Imipenem",
    category: "Carbapenem",
    reason: "Used in ICU for severe infections",
    restriction: "Strict hospital usage"
  },

  {
    name: "Tigecycline",
    category: "Glycylcycline",
    reason: "Used for complicated resistant infections",
    restriction: "Specialist-controlled use"
  }

];