export const antibiotics = [

  {
    category: "Penicillins & Beta-lactam combinations",
    description: "Common first-line antibiotics used for mild to moderate bacterial infections.",
    typicalDosage: "Usually taken 2–3 times a day (oral tablets) or given through injection in hospitals.",
    use: "Respiratory infections, urinary infections, soft tissue infections",
    examples: ["Amoxicillin", "Amoxicillin-Clavulanate", "Piperacillin-Tazobactam"]
  },

  {
    category: "Cephalosporins",
    description: "Broad-spectrum antibiotics widely used in hospitals.",
    typicalDosage: "Often given as an injection once or twice a day depending on the infection.",
    use: "Sepsis, pneumonia, surgical infections, urinary infections",
    examples: ["Ceftriaxone", "Cefotaxime", "Cefuroxime", "Cefazolin"]
  },

  {
    category: "Carbapenems",
    description: "Powerful antibiotics reserved for severe or resistant infections.",
    typicalDosage: "Given through IV injection every 6–8 hours in hospitals.",
    use: "Severe infections, ICU infections, drug-resistant infections",
    examples: ["Meropenem", "Imipenem", "Doripenem"]
  },

  {
    category: "Aminoglycosides",
    description: "Used mainly in combination therapy for serious infections.",
    typicalDosage: "Usually given once daily as an injection based on body weight.",
    use: "Severe infections, hospital-acquired infections",
    examples: ["Gentamicin", "Amikacin"]
  },

  {
    category: "Glycopeptides",
    description: "Used for resistant bacterial infections.",
    typicalDosage: "Given through IV injection 1–2 times a day based on body weight.",
    use: "Serious infections like MRSA and bloodstream infections",
    examples: ["Vancomycin", "Teicoplanin"]
  },

  {
    category: "Oxazolidinones",
    description: "Reserved antibiotics for difficult-to-treat infections.",
    typicalDosage: "Usually taken or given twice daily.",
    use: "Resistant infections like MRSA and VRE",
    examples: ["Linezolid"]
  },

  {
    category: "Lipopeptides",
    description: "Used for severe resistant infections.",
    typicalDosage: "Given once daily as an injection in hospitals.",
    use: "Severe resistant infections",
    examples: ["Daptomycin"]
  },

  {
    category: "Polymyxins",
    description: "Last-resort antibiotics for highly resistant infections.",
    typicalDosage: "Given through IV in hospitals with a starting higher dose, then regular doses twice daily.",
    use: "Multi-drug resistant infections",
    examples: ["Colistin", "Polymyxin B"]
  },

  {
    category: "Fluoroquinolones",
    description: "Broad-spectrum antibiotics available as tablets or injections.",
    typicalDosage: "Usually taken once or twice daily.",
    use: "Urinary, stomach, and respiratory infections",
    examples: ["Ciprofloxacin", "Levofloxacin", "Ofloxacin"]
  },

  {
    category: "Macrolides",
    description: "Commonly used for respiratory infections.",
    typicalDosage: "Usually taken once daily for a short course.",
    use: "Respiratory infections and atypical pneumonia",
    examples: ["Azithromycin", "Roxithromycin"]
  },

  {
    category: "Tetracyclines",
    description: "Broad-spectrum antibiotics used for various infections.",
    typicalDosage: "Usually taken once or twice daily.",
    use: "Skin infections, respiratory infections",
    examples: ["Doxycycline", "Tetracycline"]
  },

  {
    category: "Nitroimidazoles",
    description: "Effective against anaerobic infections and parasites.",
    typicalDosage: "Usually taken or given 2–3 times daily.",
    use: "Abdominal infections, gut infections",
    examples: ["Metronidazole", "Ornidazole", "Tinidazole"]
  },

  {
    category: "Antifungals",
    description: "Used to treat fungal infections.",
    typicalDosage: "Usually given once daily or as prescribed.",
    use: "Fungal infections in blood or organs",
    examples: ["Fluconazole", "Caspofungin"]
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