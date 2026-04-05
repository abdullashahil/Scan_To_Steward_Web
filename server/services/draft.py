EXTRACTION_PROMPT = """
Extract prescription details from this handwritten medical image.

INTELLIGENT EXTRACTION RULES:
- Handwriting may be unclear → interpret using medical knowledge
- Correct obvious spelling mistakes in medicine names (e.g., "Pantuid" → "Pantocid")
- Normalize medicine names to their commonly known standard names
- Do NOT guess completely unknown words
- If uncertain → keep closest meaningful interpretation

---

ANTIBIOTIC FILTERING (VERY IMPORTANT):
- Identify ALL medicines in the prescription
- ONLY include medicines that are ANTIBIOTICS
- Ignore non-antibiotic drugs (e.g., probiotics like happibiotic, antacids, vitamins, painkillers, antihistamines)
- Use your medical knowledge to classify medicines correctly

---

CRITICAL MEDICINE NORMALIZATION RULE:

For EACH antibiotic:
- Extract BRAND NAME (as written)
- Identify correct GENERIC COMPOSITION using medical knowledge or from the policy context
- ALWAYS format as: Brand Name - (Generic Composition)

Examples:
- Augmentin 625 → Augmentin 625 - (Amoxicillin + Clavulanate)
- Azee 500 → Azee 500 - (Azithromycin)
- Mox CV 625 → Mox CV 625 - (Amoxicillin + Clavulanic Acid)

⚠️ This format is STRICT and MUST be followed

---

FREQUENCY INTERPRETATION RULES (VERY IMPORTANT):

Prescriptions often use shorthand. You MUST convert them into clear, patient-friendly language.

Interpret the following patterns:
- 1-0-1 → Twice a day (morning and night)
- 1-1-1 → Three times a day (morning, afternoon, night)
- 0-1-0 → Once a day (afternoon)
- 1-0-0 → Once a day (morning)
- 0-0-1 → Once a day (night)

Medical abbreviations:
- OD → Once daily
- BD → Twice daily
- TDS → Three times daily
- QID → Four times daily
- HS → At bedtime
- SOS → Only when needed
- STAT → Immediately

Time-based instructions:
- "After food" → Add to instructions
- "Before food" → Add to instructions

⚠️ OUTPUT REQUIREMENT:
- ALWAYS convert frequency into clear natural language
- ALSO preserve original pattern in brackets if present

Example:
- "1-0-1" → "Twice a day (1-0-1)"
- "BD" → "Twice daily"

---

OUTPUT RULES:
- Output MUST be clean Markdown (React Markdown compatible)
- Keep structure consistent and readable
- Do NOT include empty sections
- You MAY include additional relevant details if clearly present

---

OUTPUT FORMAT:

## Patient Details (Include only if present)
- Name:
- Age/Sex:
- Date:
- Hospital/Clinic:

## Diagnosis (Include only if present or when you can use your medical knowledge to infer)
- Condition / Symptoms:

## Antibiotics Prescribed (Include ONLY antibiotic medicines)

### 1. <Standard Medicine Name>
- Dose:
- Frequency: <Clear human-readable format + original pattern>
- Duration:
- Instructions:

(Repeat for each antibiotic)

## Additional Notes (Include if any extra instructions, warnings, or observations exist)

## Other Relevant Details (Include any clearly visible useful info not covered above)
"""