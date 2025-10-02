"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  FileText,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  MessageSquare,
} from "lucide-react";

interface Source {
  content: string;
  source: string;
  score: number;
  page: string;
  file: string;
}

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  sources?: string[];
  context?: Source[];
  numSources?: number;
  isLoading?: boolean;
}

interface ApiResponse {
  response: string;
  sources: string[];
  context: Source[];
  num_sources: number;
  query: string;
  status: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      content:
        "✨ Welcome to your intelligent AWS Assistant! I'm here to help you navigate through AWS documentation with precision and expertise. Feel free to ask me about any AWS service, best practices, or technical concepts!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: "Thinking...",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data: ApiResponse = await response.json();

      const botMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "bot",
        content: data.response,
        timestamp: new Date(),
        sources: data.sources,
        context: data.context,
        numSources: data.num_sources,
      };

      setMessages((prev) => prev.slice(0, -1).concat(botMessage));
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "bot",
        content:
          "Sorry, I encountered an error. Please make sure the Flask backend is running on http://localhost:5000",
        timestamp: new Date(),
      };
      setMessages((prev) => prev.slice(0, -1).concat(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatFileName = (filePath: string) => {
    return filePath.split("\\").pop()?.split("/").pop() || filePath;
  };

  const formatSource = (source: string) => {
    const parts = source.split(":");
    if (parts.length >= 2) {
      const file = formatFileName(parts[0]);
      const page = parts[1];
      return `${file} (Page ${page})`;
    }
    return source;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with glassmorphism effect */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  AWS Assistant
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Powered by advanced RAG technology
                </p>
              </div>
            </div>

            {/* Stats Badge */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="px-4 py-2 bg-white/70 rounded-full border border-gray-200 backdrop-blur-sm">
                <span className="text-sm font-medium text-gray-700">
                  {messages.length - 1} conversations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)]">
        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 md:gap-6 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                } animate-in slide-in-from-bottom-4 duration-500`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                        : "bg-gradient-to-r from-slate-600 to-gray-700"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div
                  className={`flex-1 max-w-4xl ${
                    message.type === "user" ? "flex flex-col items-end" : ""
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`relative p-4 md:p-6 rounded-3xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white ml-4 md:ml-16"
                        : "bg-white/90 border border-gray-200 text-gray-900 mr-4 md:mr-16"
                    }`}
                  >
                    {/* Message bubble tail */}
                    <div
                      className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 -right-1"
                          : "bg-white border-l border-b border-gray-200 -left-1"
                      }`}
                    ></div>

                    {message.isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-gray-600 font-medium">
                          Analyzing AWS documentation...
                        </span>
                      </div>
                    ) : (
                      <div className="prose prose-sm md:prose-base max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sources Section */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 mr-4 md:mr-16">
                      <button
                        onClick={() =>
                          setShowSources(
                            showSources === message.id ? null : message.id
                          )
                        }
                        className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:bg-white hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {message.numSources} sources referenced
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                            showSources === message.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showSources === message.id && (
                        <div className="mt-3 p-4 bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-300">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            Referenced Sources
                          </h4>
                          <div className="space-y-3">
                            {message.context?.map((ctx) => (
                              <div
                                key={ctx.source}
                                className="group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                                    <ExternalLink className="w-3 h-3" />
                                    {formatSource(ctx.source)}
                                  </span>
                                  <span className="text-xs font-medium px-2 py-1 bg-blue-200 text-blue-800 rounded-full">
                                    {(ctx.score * 100).toFixed(0)}% match
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                  {ctx.content.substring(0, 200)}
                                  {ctx.content.length > 200 && "..."}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-xs text-gray-500 mt-2 flex items-center gap-1 ${
                      message.type === "user"
                        ? "justify-end mr-4 md:mr-16"
                        : "ml-0"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Section */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3 md:gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about AWS services, architecture, best practices..."
                  className="w-full p-4 md:p-5 pr-12 md:pr-16 rounded-2xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 resize-none text-gray-900 bg-white placeholder-gray-500 shadow-lg transition-all duration-200 text-sm md:text-base"
                  rows={1}
                  disabled={isLoading}
                  style={{
                    minHeight: "56px",
                    maxHeight: "120px",
                    color: "#111827",
                    backgroundColor: "#ffffff",
                  }}
                />

                {/* Character count */}
                <div className="absolute bottom-2 right-16 md:right-20 text-xs text-gray-400">
                  {input.length}/500
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 p-4 md:p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none group"
              >
                <Send className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setInput("What is the difference between EC2 and Lambda?")
                }
                className="px-4 py-2 text-sm bg-white/70 hover:bg-white border border-gray-200 rounded-full transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                EC2 vs Lambda
              </button>
              <button
                onClick={() => setInput("Explain AWS S3 storage classes")}
                className="px-4 py-2 text-sm bg-white/70 hover:bg-white border border-gray-200 rounded-full transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                S3 Storage Classes
              </button>
              <button
                onClick={() =>
                  setInput("What are AWS best practices for security?")
                }
                className="px-4 py-2 text-sm bg-white/70 hover:bg-white border border-gray-200 rounded-full transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                Security Best Practices
              </button>
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Connected to AWS Knowledge Base</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
