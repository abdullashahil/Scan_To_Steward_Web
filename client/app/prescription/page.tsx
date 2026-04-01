"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Bot,
  X,
  User,
  ShieldCheck,
  ArrowUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STREAMING_SPEED = 5; // characters per tick

type Role = "patient" | "pharmacist" | null;

type Message = {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

const PHARMACIST_CODE = process.env.NEXT_PUBLIC_PHARMACIST_CODE;

export default function Prescription() {
  const [role, setRole] = useState<Role>(null);
  const [authCode, setAuthCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  
  // Chat mode states
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleRemoveFile = () => {
    setFile(null);
    setShowChat(false);
    setMessages([]);
    setShowRemoveModal(false);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (streamingContent) {
      streamingRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingContent, thinking]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setAnalysis("");
    setMessages([]);
    setShowChat(false);
    setError("");
  }

  function verifyCode() {
    console.log(authCode, PHARMACIST_CODE);
    if (authCode === PHARMACIST_CODE) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid pharmacist access code");
    }
  }

  // Typewriter effect
  const streamResponse = useCallback((fullText: string, messageIndex: number) => {
    let currentIndex = 0;
    setStreamingContent("");
    
    const interval = setInterval(() => {
      currentIndex += STREAMING_SPEED;
      const visibleText = fullText.slice(0, currentIndex);
      setStreamingContent(visibleText);
      
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        setStreamingContent("");
        setMessages(prev => 
          prev.map((msg, idx) => 
            idx === messageIndex ? { ...msg, content: fullText, isStreaming: false } : msg
          )
        );
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  async function handleAnalyse() {
    if (!file || !role) return;

    setThinking(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);

      const response = await fetch(`${API_BASE_URL}/analyze-prescription`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data.response);
      setShowChat(true);
      
      // Add empty assistant message for streaming
      const assistantMessage: Message = { role: "assistant", content: "", isStreaming: true };
      setMessages([assistantMessage]);
      setThinking(false);
      
      // Start streaming animation
      streamResponse(data.response, 0);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze prescription. Please try again.");
      setThinking(false);
    }
  }

  async function handleSendMessage() {
    if (!inputMessage.trim() || !file || !role) return;

    const userMessage: Message = { role: "user", content: inputMessage.trim(), isStreaming: false };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setThinking(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", role);
      formData.append("message", userMessage.content);

      const response = await fetch(`${API_BASE_URL}/analyze-prescription`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setThinking(false);
      
      // Add assistant message and start streaming
      const assistantMessage: Message = { role: "assistant", content: "", isStreaming: true };
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        const assistantIndex = newMessages.length - 1;
        // Start streaming after state update
        setTimeout(() => streamResponse(data.response, assistantIndex), 0);
        return newMessages;
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      setThinking(false);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process your question. Please try again.", isStreaming: false }]);
    }
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
  /* PRESCRIPTION CHAT UI - ChatGPT Style */
  /* ---------------------------------- */

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-secondary" />
          <span className="font-semibold">
            {role === "patient"
              ? "Prescription Explanation"
              : "Pharmacist Analysis"}
          </span>
        </div>
        <button 
          onClick={() => { setFile(null); setShowChat(false); setMessages([]); }}
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          Reset
        </button>
      </header>

      <div className="flex-1 overflow-y-auto scroll-smooth">
        {/* Upload Section - Show when no analysis yet */}
        {!showChat && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-dashed border-border rounded-xl p-8 text-center bg-muted/30"
            >
              {!file ? (
                <label className="cursor-pointer flex flex-col items-center gap-3">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <span className="text-lg font-medium text-foreground">
                    Upload Prescription
                  </span>
                  <span className="text-sm text-muted-foreground">
                    PNG, JPG, or PDF
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="text-secondary h-8 w-8" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">Ready to analyze</p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setFile(null)}
                      className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition"
                    >
                      Remove
                    </button>
                    <button
                      onClick={handleAnalyse}
                      disabled={thinking}
                      className="px-6 py-2 bg-secondary text-white rounded-lg text-sm disabled:opacity-50 hover:opacity-90 transition"
                    >
                      {thinking ? "Analyzing..." : "Analyse Prescription"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Uploaded File Display - Always visible when file exists */}
        {file && (
          <div className="bg-muted/50 border-b border-border px-4 py-2">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                <span className="text-sm text-foreground font-medium truncate max-w-[200px] sm:max-w-[300px]">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                onClick={() => setShowRemoveModal(true)}
                className="p-1.5 rounded-full hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition"
                title="Remove prescription"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Messages - Full width like ChatGPT */}
        {showChat && messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-full py-6 ${
              msg.role === "user"
                ? "bg-background"
                : "bg-muted/50 border-y border-border/50"
            }`}
            ref={msg.isStreaming ? streamingRef : null}
          >
            <div className={`max-w-4xl mx-auto px-4 md:px-8 flex gap-4 md:gap-6 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}>
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                {msg.role === "assistant" ? (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    role === "pharmacist" ? "bg-slate-700" : "bg-secondary"
                  }`}>
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content - Full width, no bubble */}
              <div className={`flex-1 min-w-0 text-foreground ${
                msg.role === "user" ? "text-right" : ""
              }`}>
                <div className={`text-sm font-medium mb-1 text-muted-foreground ${
                  msg.role === "user" ? "text-right" : ""
                }`}>
                  {msg.role === "assistant" 
                    ? (role === "pharmacist" ? "ScanToSteward Clinical AI" : "ScanToSteward AI")
                    : "You"}
                </div>
                <div className={`prose prose-sm max-w-none text-left ${
                  role === "pharmacist" 
                    ? "text-foreground"
                    : "text-foreground"
                }`}>
                  {msg.isStreaming && !streamingContent ? (
                    <span className="inline-block w-2 h-4 bg-secondary animate-pulse" />
                  ) : (
                    <div>
                      <ReactMarkdown>
                        {msg.isStreaming && streamingContent ? streamingContent : msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  {msg.isStreaming && streamingContent && (
                    <span className="inline-block w-2 h-4 bg-secondary ml-1 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Thinking animation */}
        {showChat && thinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full py-6 bg-muted/50 border-y border-border/50"
          >
            <div className="max-w-4xl mx-auto px-4 md:px-8 flex gap-4 md:gap-6">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                role === "pharmacist" ? "bg-slate-700" : "bg-secondary"
              }`}>
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 pt-2">
                <span className="w-3 h-3 bg-secondary rounded-full animate-bounce" />
                <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-150" />
                <span className="w-3 h-3 bg-secondary rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom like ChatGPT */}
      {showChat && (
        <div className="border-t border-border bg-background p-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-muted/80 rounded-3xl border border-border/50 shadow-lg shadow-black/5 p-4 focus-within:border-secondary/50 focus-within:shadow-secondary/10 focus-within:shadow-lg transition-all duration-200">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={role === "patient" ? "Ask me..." : "Ask a clinical question..."}
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-lg text-foreground placeholder:text-muted-foreground/60 max-h-40 py-1 px-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{ minHeight: "24px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || thinking}
                className="flex-shrink-0 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:bg-muted-foreground/20 disabled:text-muted-foreground hover:opacity-90 transition-all duration-200 shadow-sm"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-center text-muted-foreground/60 mt-2">
              AI can make mistakes. Verify critical information.
            </p>
          </div>
        </div>
      )}
      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl border border-border shadow-xl max-w-md w-full p-6 space-y-4 relative z-[101]"
          >
            <h3 className="text-lg font-semibold text-foreground">
              Remove Prescription?
            </h3>
            <p className="text-sm text-muted-foreground">
              Removing the prescription will reset the chat and delete all conversation history. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveFile}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
              >
                Remove & Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}