import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';

interface AssistantProps {
  subjectName: string;
}

export const Assistant: React.FC<AssistantProps> = ({ subjectName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Placeholder response - AI integration disabled
    setTimeout(() => {
      const answer = 'Fitur asisten AI sedang tidak tersedia. Silakan hubungi instruktur untuk bantuan.';
      setHistory(prev => [...prev, { role: 'ai', content: answer }]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 mb-4 overflow-hidden flex flex-col h-[400px] animate-in slide-in-from-bottom-5">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
                <Bot size={20} />
                <h3 className="font-semibold text-sm">Asisten {subjectName}</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             {history.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">
                    <p>Halo! Saya asisten AI untuk matakuliah {subjectName}.</p>
                    <p className="mt-2 text-xs">Tanyakan tentang konsep, istilah, atau materi.</p>
                </div>
             )}
             {history.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                         msg.role === 'user' 
                         ? 'bg-primary-600 text-white rounded-br-none' 
                         : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                     }`}>
                         {msg.content}
                     </div>
                 </div>
             ))}
             {loading && (
                 <div className="flex justify-start">
                     <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                     </div>
                 </div>
             )}
          </div>

          <form onSubmit={handleAsk} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tanya sesuatu..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
            <button 
                type="submit" 
                disabled={loading}
                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition disabled:opacity-50"
            >
                <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Bot size={28} />
      </button>
    </div>
  );
};
