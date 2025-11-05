
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from './common/Card';
import { Bot, Send, User } from 'lucide-react';
import type { ChatMessage } from '../types.tsx';
import { getChatbotResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: "Hello! I'm Eco, your AI climate assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const botResponseText = await getChatbotResponse(history, input);
    const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
    
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Eco Assistant</h1>
      <Card className="flex-1 flex flex-col h-full">
        <CardHeader>
          <CardTitle icon={<Bot size={24}/>}>Conversation</CardTitle>
        </CardHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-primary-green flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={20} />
                </div>
              )}
              <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'bot' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-secondary-blue text-white'}`}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-white flex-shrink-0">
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-green flex items-center justify-center text-white flex-shrink-0">
                  <Bot size={20} />
              </div>
              <div className="max-w-md p-3 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center">
                  <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about climate change..."
              className="w-full pr-12 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 focus:ring-primary-green focus:border-primary-green"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 w-10 h-10 flex items-center justify-center text-white bg-primary-green rounded-full m-1 hover:bg-green-600 disabled:bg-gray-400"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
