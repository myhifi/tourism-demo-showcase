"use client";

import { useState, useEffect, useRef } from "react";
import { NicheConfig, Service } from "@/config/schema";
import { getEstimateString } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  config: NicheConfig;
  service: Service;
  selectedAddOnIds: string[];
  groupSize: number;
  currency: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget({ config, service, selectedAddOnIds, groupSize, currency }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "initial", role: "assistant", content: config.ai.greeting },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load key on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem("gemini-key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsLiveMode(true);
    }
  }, []);

  // Reset chat messages when the niche changes
  useEffect(() => {
    setMessages([{ id: "initial", role: "assistant", content: config.ai.greeting }]);
    setInput("");
    setIsTyping(false);
  }, [config.slug, config.ai.greeting]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const saveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      sessionStorage.setItem("gemini-key", apiKey.trim());
      setIsLiveMode(true);
      setShowKeyInput(false);
    }
  };

  const removeKey = () => {
    sessionStorage.removeItem("gemini-key");
    setApiKey("");
    setIsLiveMode(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (!isLiveMode) {
      // ─── SIMULATED MODE ───
      setTimeout(() => {
        let reply = config.ai.simulatedReplies.find(
          (r) =>
            r.keywords.length > 0 &&
            r.keywords.some((k) => text.toLowerCase().includes(k))
        ) || config.ai.simulatedReplies.find((r) => r.keywords.length === 0);

        let content = reply?.response || "I'm not sure about that, but I can help with the options on this page.";

        const estimateStr = getEstimateString(service, selectedAddOnIds, groupSize, config.pricing, currency);
        
        // Interpolate dynamic context
        content = content
          .replace(/{serviceName}/g, service.name)
          .replace(/{estimate}/g, estimateStr)
          .replace(/{currency}/g, currency);

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content },
        ]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800); // Natural typing delay
      return;
    }

    // ─── LIVE BYOK MODE ───
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": apiKey,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          niche: config.slug,
          context: {
            serviceId: service.id,
            groupSize,
            addOnIds: selectedAddOnIds,
            currency,
          },
        }),
      });

      if (!response.ok) throw new Error("Live API error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      
      const msgId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: msgId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const parsed = JSON.parse(line.slice(2));
              assistantText += parsed;
              setMessages((prev) =>
                prev.map((m) => (m.id === msgId ? { ...m, content: assistantText } : m))
              );
            } catch (e) {} // Ignore parsing errors on split chunks
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "⚠️ Error connecting to the AI service. Please verify your API key.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-transform hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl border-l sm:inset-y-4 sm:right-4 sm:rounded-xl sm:border">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50 sm:rounded-t-xl">
            <div>
              <h3 className="font-bold text-slate-900">AI Concierge</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                {isLiveMode ? (
                  <><span className="h-2 w-2 rounded-full bg-green-500"></span> Live Mode (BYOK)</>
                ) : (
                  <><span className="h-2 w-2 rounded-full bg-blue-500"></span> Simulated Demo</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowKeyInput(!showKeyInput)}
                className={`text-xs font-medium border px-2 py-1 rounded transition-colors ${showKeyInput ? 'bg-slate-200 text-slate-900 border-slate-300' : 'text-slate-500 hover:text-slate-900 border-slate-200'}`}
              >
                API Settings
              </button>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>
          </div>

          {/* BYOK Form */}
          {showKeyInput && (
            <div className="p-4 bg-slate-100 border-b text-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-slate-700">
                  {config.ai.byokPrompt}
                </p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-semibold hover:underline whitespace-nowrap shrink-0 mt-0.5"
                >
                  Get a free key ↗
                </a>
              </div>
              
              <form onSubmit={saveKey} className="flex gap-2">
                <input
                  type="password"
                  placeholder="Paste Google Gemini key (AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 rounded border border-slate-300 px-3 py-1.5 focus:border-primary focus:outline-none text-sm"
                />
                <button type="submit" className="bg-primary text-white px-3 py-1.5 rounded font-medium text-sm hover:opacity-90">
                  {isLiveMode ? "Update" : "Save"}
                </button>
              </form>

              {isLiveMode && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Live Key Active
                  </span>
                  <button 
                    onClick={removeKey} 
                    className="text-xs text-red-500 hover:text-red-700 font-medium underline"
                  >
                    Disconnect Key
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-white border text-slate-700 rounded-bl-sm shadow-sm"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 pb-2 bg-slate-50/50 flex flex-wrap gap-2">
              {config.ai.suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-white border rounded-full px-3 py-1.5 text-slate-600 hover:border-primary hover:text-primary transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white sm:rounded-b-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="bg-primary text-primary-foreground rounded-full px-4 font-medium disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}