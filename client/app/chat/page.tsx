"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bot, ArrowUp, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STREAMING_SPEED = 5; // characters per tick

type Message = {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "**Hi 👋, I'm here to help with your health questions.**\n\nYou can ask me things like:\n- What is Amoxicillin used for?\n- Can I stop antibiotics early?\n- What are common side effects?",
      isStreaming: false,
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
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

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input, isStreaming: false };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setThinking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
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
      console.error("Chat failed:", err);
      setThinking(false);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process your question. Please try again.", isStreaming: false }]);
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-secondary" />
          <span className="font-semibold text-foreground">
            AI Antibiotic Assistant
          </span>
        </div>
      </header>

      {/* Messages - Full width like ChatGPT */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-full py-6 ${msg.role === "user"
                ? "bg-background"
                : "bg-muted/50 border-y border-border/50"
              }`}
            ref={msg.isStreaming ? streamingRef : null}
          >
            <div className={`max-w-4xl mx-auto px-4 md:px-8 flex gap-4 md:gap-6 ${msg.role === "user" ? "flex-row-reverse" : ""
              }`}>
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                {msg.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content - Full width, no bubble */}
              <div className={`flex-1 min-w-0 text-foreground ${msg.role === "user" ? "text-right" : ""
                }`}>
                <div className={`text-sm font-medium mb-1 text-muted-foreground ${msg.role === "user" ? "text-right" : ""
                  }`}>
                </div>
                <div className={`prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-secondary prose-pre:bg-muted prose-pre:border prose-pre:border-border ${msg.role === "user" ? "text-right" : ""
                  }`}>
                  {msg.isStreaming && !streamingContent ? (
                    // Show nothing while waiting for first chunk
                    <span className="inline-block w-2 h-4 bg-secondary animate-pulse" />
                  ) : (
                    <ReactMarkdown>
                      {msg.isStreaming && streamingContent ? streamingContent : msg.content}
                    </ReactMarkdown>
                  )}
                  {/* Cursor blink effect while streaming */}
                  {msg.isStreaming && streamingContent && (
                    <span className="inline-block w-2 h-4 bg-secondary ml-1 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Thinking animation */}
        {thinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full py-6 bg-muted/50 border-y border-border/50"
          >
            <div className="max-w-4xl mx-auto px-4 md:px-8 flex gap-4 md:gap-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
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
      <div className="border-t border-border bg-background p-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-muted/80 rounded-3xl border border-border/50 shadow-lg shadow-black/5 p-4 focus-within:border-secondary/50 focus-within:shadow-secondary/10 focus-within:shadow-lg transition-all duration-200">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-lg text-foreground placeholder:text-muted-foreground/60 max-h-40 py-1 px-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              style={{ minHeight: "24px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || thinking}
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
    </div>
  );
}