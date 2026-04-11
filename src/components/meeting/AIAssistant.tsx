"use client";

import React, { useState } from 'react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I am your AI meeting assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, context: "" })
      });
      const data = await res.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: data.error || "Sorry, I couldn't process that." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "An error occurred while contacting the AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(inputValue);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white/90 backdrop-blur-lg border border-[#EAEAEA] shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in-20 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAEA]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B8FF3B] shadow-[0_0_8px_rgba(184,255,59,0.5)]"></div>
          <h3 className="font-bold text-gray-900 tracking-tight">AI Assistant</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M13 1L1 13M1 1L13 13" />
          </svg>
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-gray-100 text-gray-800 rounded-tr-sm' 
              : 'bg-[#B8FF3B] text-black rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#B8FF3B] text-black px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-black/50 rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both]" style={{ animationDelay: '-0.32s' }}></span>
              <span className="w-2 h-2 bg-black/50 rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both]" style={{ animationDelay: '-0.16s' }}></span>
              <span className="w-2 h-2 bg-black/50 rounded-full animate-[bounce_1.4s_infinite_ease-in-out_both]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-[#EAEAEA] bg-white/50 space-y-3 pb-5">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button 
            onClick={() => sendMessage("Summarize the meeting so far")}
            disabled={isLoading}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 rounded-full transition-all border border-gray-200 shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
          >
            Summarize
          </button>
          <button 
            onClick={() => sendMessage("Translate the last message to Hindi")}
            disabled={isLoading}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 rounded-full transition-all border border-gray-200 shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
          >
            Translate
          </button>
        </div>
        
        {/* Input area */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-white border border-gray-200 text-gray-800 text-sm rounded-full px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8FF3B] focus:border-transparent transition-all placeholder:text-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="p-2.5 bg-[#B8FF3B] hover:bg-[#a3e635] text-black rounded-full transition-all shadow-sm hover:shadow-md flex-shrink-0 active:scale-95 disabled:opacity-50"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[1px] translate-y-[-1px]">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
