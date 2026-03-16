"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello 👋 I am your **Antibiotic Assistant**.\n\nYou can ask things like:\n- What is Amoxicillin used for?\n- Can I stop antibiotics early?\n- Are there side effects?",
    },
  ]);

  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setThinking(true);

    // Replace with your FastAPI endpoint
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "This is a **demo response**.\n\nYour backend response will appear here.\n\nExample markdown:\n\n- Bullet points\n- **Bold text**\n- Helpful explanations",
        },
      ]);
      setThinking(false);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center gap-2">
        <Bot className="h-5 w-5 text-secondary" />
        <span className="font-semibold text-foreground">
          AI Antibiotic Assistant
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl w-full mx-auto">

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : ""
            }`}
          >
            {msg.role === "assistant" && (
              <Bot className="h-6 w-6 text-secondary mt-1" />
            )}

            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-secondary text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>

            {/* {msg.role === "user" && (
              <User className="h-6 w-6 text-muted-foreground mt-1" />
            )} */}
          </motion.div>
        ))}

        {/* Thinking animation */}
        {thinking && (
          <div className="flex gap-3">
            <Bot className="h-6 w-6 text-secondary mt-1" />
            <div className="bg-muted rounded-xl px-4 py-3 flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce delay-150">•</span>
              <span className="animate-bounce delay-300">•</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about antibiotics..."
            className="flex-1 border border-border rounded-lg px-4 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}