"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Bot,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

type Role = "patient" | "pharmacist" | null;

const PHARMACIST_CODE = process.env.NEXT_PUBLIC_PHARMACIST_CODE;

export default function Prescription() {
  const [role, setRole] = useState<Role>(null);
  const [authCode, setAuthCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [thinking, setThinking] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setAnalysis("");
  }

  function verifyCode() {
    console.log(authCode, PHARMACIST_CODE);
    if (authCode === PHARMACIST_CODE) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid pharmacist access code");
    }
  }

  async function handleAnalyse() {
    if (!file) return;

    setThinking(true);

    setTimeout(() => {
      if (role === "patient") {
        setAnalysis(`
## 🧾 Prescription Explanation

### 💊 Medicine
**Amoxicillin 500mg**

### What it does
This antibiotic helps fight **bacterial infections** such as throat or chest infections.

### How to take
- Take **1 capsule every 8 hours**
- Take **after food**
- Complete the **full course**

### ⚠️ Important
- Do not stop the medicine early
- Avoid alcohol while taking antibiotics

### 👍 Advice
- Drink plenty of water
- Take the medicine at the same time every day
`);
      } else {
        setAnalysis(`
## Clinical Prescription Analysis

### Patient Demographics
- Age: 32  
- Sex: Male  

### Probable Diagnosis
Acute **bacterial respiratory tract infection**.

### Antibiotic Therapy
**Amoxicillin 500 mg TID**

### Pharmacological Class
Beta-lactam antibiotic (Aminopenicillin).

### Mechanism of Action
Inhibits **bacterial cell wall synthesis** by binding to penicillin-binding proteins.

### Clinical Considerations
- Assess for **penicillin hypersensitivity**
- Monitor for **gastrointestinal intolerance**
- Consider **renal dose adjustment** if eGFR < 30

### Stewardship Notes
- Narrow spectrum antibiotic appropriate for suspected **streptococcal infection**
- Avoid unnecessary prolonged therapy (>7 days)
`);
      }

      setThinking(false);
    }, 2000);
  }

  /* ---------------------------------- */
  /* ROLE SELECTION SCREEN */
  /* ---------------------------------- */

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6 text-center">

          <h1 className="text-2xl font-bold text-foreground">
            Prescription Analysis
          </h1>

          <p className="text-muted-foreground text-sm">
            Select your role to continue
          </p>

          <div className="space-y-4">

            <button
              onClick={() => setRole("patient")}
              className="w-full border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-muted transition"
            >
              <User className="text-secondary" />
              <div className="text-left">
                <p className="font-medium">Patient</p>
                <p className="text-xs text-muted-foreground">
                  Simple explanation of your prescription
                </p>
              </div>
            </button>

            <button
              onClick={() => setRole("pharmacist")}
              className="w-full border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-muted transition"
            >
              <ShieldCheck className="text-secondary" />
              <div className="text-left">
                <p className="font-medium">Pharmacist</p>
                <p className="text-xs text-muted-foreground">
                  Detailed clinical prescription analysis
                </p>
              </div>
            </button>

          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------- */
  /* PHARMACIST AUTH SCREEN */
  /* ---------------------------------- */

  if (role === "pharmacist" && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">

          <h2 className="text-xl font-semibold text-center">
            Pharmacist Verification
          </h2>

          <input
            type="text"
            placeholder="Enter 10 digit pharmacist code"
            value={authCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setAuthCode(value);
            }}
            className="w-full border border-border rounded-lg px-4 py-2"
            maxLength={10}
            inputMode="numeric"
          />

          <button
            onClick={verifyCode}
            disabled={authCode.length !== 10}
            className={`w-full py-2 rounded-lg ${
              authCode.length === 10
                ? 'bg-secondary text-white hover:opacity-90 transition-opacity'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Verify
          </button>

        </div>
      </div>
    );
  }

  /* ---------------------------------- */
  /* PRESCRIPTION CHAT UI */
  /* ---------------------------------- */

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center gap-2">
        <FileText className="h-5 w-5 text-secondary" />
        <span className="font-semibold">
          {role === "patient"
            ? "Prescription Explanation"
            : "Pharmacist Analysis"}
        </span>
      </div>

      <div className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Upload */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-dashed border-border rounded-xl p-6 text-center bg-muted/30"
        >
          {!file ? (
            <label className="cursor-pointer flex flex-col items-center gap-3">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload Prescription
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG, PDF
              </span>

              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <FileText className="text-secondary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                </div>
              </div>

              <button onClick={() => setFile(null)}>
                <X />
              </button>
            </div>
          )}
        </motion.div>

        {/* Analyse Button */}
        {file && (
          <button
            onClick={handleAnalyse}
            className="w-full bg-secondary text-white py-3 rounded-lg"
          >
            Analyse Prescription
          </button>
        )}

        {/* Thinking */}
        {thinking && (
          <div className="flex gap-3">
            <Bot className="text-secondary" />
            <div className="bg-muted px-4 py-3 rounded-xl flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce delay-150">•</span>
              <span className="animate-bounce delay-300">•</span>
            </div>
          </div>
        )}

        {/* Output */}
        {analysis && (
          <div className="flex gap-3">
            <Bot className="text-secondary" />

            <div
              className={`rounded-xl px-4 py-4 text-sm ${
                role === "pharmacist"
                  ? "bg-slate-900 text-white"
                  : "bg-muted"
              }`}
            >
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}