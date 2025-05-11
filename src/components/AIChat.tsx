import React, { useState } from 'react';
import { MessageSquare, Send, X, Maximize2, Minimize2, Loader } from 'lucide-react';
import { useStore } from '../store';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/api';

export function AIChat() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { chatMessages, addChatMessage } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(input.trim());
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.trim(),
        timestamp: Date.now(),
      };
      addChatMessage(aiMessage);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: Date.now(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 flex items-center gap-2 z-50"
      >
        <MessageSquare size={20} className="md:w-6 md:h-6" />
        <span className="text-sm md:text-base">Ask Space AI</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed transition-all duration-300 ease-in-out z-50 ${
        isMinimized
          ? 'bottom-4 right-4 w-72'
          : 'bottom-4 right-4 w-[calc(100%-2rem)] md:w-96 h-[80vh] md:h-[32rem] max-h-[32rem]'
      }`}
    >
      <div className="bg-slate-800 rounded-lg shadow-lg h-full flex flex-col border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/90 backdrop-blur-sm rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Space AI Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto p-4 space-y-4 transition-all duration-300 ${
            isMinimized ? 'hidden' : ''
          }`}
        >
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
              <p>Ask me anything about space debris, satellites, or astronomy!</p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white ml-4'
                      : 'bg-slate-700 text-gray-100 mr-4'
                  } shadow-md hover:translate-y-[-1px] transition-transform`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-center">
              <Loader className="animate-spin text-blue-400" size={24} />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className={`p-4 border-t border-slate-700 transition-all duration-300 ${
            isMinimized ? 'hidden' : ''
          }`}
        >
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about space..."
              className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`p-2 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:scale-105 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </form>

        {isMinimized && (
          <div className="p-4 text-gray-300 text-sm">
            Click to expand chat...
          </div>
        )}
      </div>
    </div>
  );
}