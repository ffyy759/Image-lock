
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './types';
import { extractPromptFromImage, getUrvashiReply } from './services/geminiService';
import { PHONE_STYLES, LIGHTING_STYLES, NEGATIVE_PROMPT } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hii! Mai Urvashi hoon. Ultra-Lock logic ke saath tera identity preservation 100% fix kar dungi. Bas photo upload kar! 🔐✨',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<keyof typeof PHONE_STYLES>('SAMSUNG');
  const [selectedLighting, setSelectedLighting] = useState<keyof typeof LIGHTING_STYLES>('INDOOR');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, image?: string, isPrompt?: boolean) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      image,
      isPrompt,
      timestamp: new Date()
    }]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addMessage('assistant', "Prompt copy ho gaya! Ab Nano Banana me bina soche paste kar do. 😎");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setIsLoading(true);
      
      addMessage('user', `Ultra-Lock prompt nikaalo. Style: ${selectedPhone}, Light: ${selectedLighting}`, base64);

      try {
        const generatedPrompt = await extractPromptFromImage(base64);
        
        // Final assembly
        const finalOutput = `${generatedPrompt}\n\n[STYLE OVERRIDE]\n${PHONE_STYLES[selectedPhone]}\n${LIGHTING_STYLES[selectedLighting]}\n\n[MANDATORY NEGATIVE PROMPT]\n${NEGATIVE_PROMPT}`;
        
        const reply = await getUrvashiReply("Ready");
        addMessage('assistant', reply);
        addMessage('assistant', finalOutput, undefined, true);
        
      } catch (err) {
        addMessage('assistant', "Oops, kuch gadbad ho gayi. API check karo yaar.");
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-[#0e0e10] border-x border-gray-800 text-gray-100 font-sans">
      <header className="p-4 border-b border-gray-800 bg-[#131314] flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-microchip text-white"></i>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">URVASHI PROMPT ENG.</h1>
            <p className="text-[10px] text-indigo-400 font-mono tracking-widest">IDENTITY LOCK v3.0</p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-gray-500 uppercase px-2 py-1 bg-gray-800/50 rounded">1080p Realism</div>
      </header>

      {/* Control Panel */}
      <div className="p-3 bg-[#131314] border-b border-gray-800 flex gap-4 overflow-x-auto no-scrollbar">
        <div className="flex flex-col gap-1.5 min-w-fit">
          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Camera Style</span>
          <div className="flex gap-1.5">
            {Object.keys(PHONE_STYLES).map(style => (
              <button
                key={style}
                onClick={() => setSelectedPhone(style as any)}
                className={`px-3 py-1 rounded-md text-[9px] font-bold border transition-all ${selectedPhone === style ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 min-w-fit">
          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Environment</span>
          <div className="flex gap-1.5">
            {Object.keys(LIGHTING_STYLES).map(light => (
              <button
                key={light}
                onClick={() => setSelectedLighting(light as any)}
                className={`px-3 py-1 rounded-md text-[9px] font-bold border transition-all ${selectedLighting === light ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
              >
                {light.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-4 ${
              m.role === 'user' 
                ? 'bg-[#1e1f23] border border-gray-700 rounded-tr-none' 
                : m.isPrompt 
                  ? 'bg-black/40 border border-indigo-500/20 text-indigo-100 rounded-tl-none font-mono text-[11px] leading-relaxed'
                  : 'bg-transparent text-gray-300'
            }`}>
              {m.role === 'assistant' && !m.isPrompt && (
                <div className="text-[9px] font-black text-indigo-500 mb-1 flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                  URVASHI AI
                </div>
              )}
              
              <p className={m.isPrompt ? "whitespace-pre-wrap select-all" : ""}>{m.content}</p>
              
              {m.image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-800 bg-black/40 p-1">
                  <img src={m.image} alt="Reference" className="w-full h-auto object-contain max-h-64 rounded" />
                </div>
              )}

              {m.isPrompt && (
                <button 
                  onClick={() => copyToClipboard(m.content)}
                  className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-copy"></i> Copy Optimized Prompt
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-4 flex flex-col gap-2">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-[8px] text-gray-600 font-mono tracking-widest uppercase">Locking identity & capturing pose...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="p-4 bg-[#131314] border-t border-gray-800">
        <label className={`group relative flex items-center justify-between w-full bg-[#1a1b1e] hover:bg-[#232429] transition-all rounded-xl p-5 cursor-pointer border-2 border-dashed ${isLoading ? 'opacity-50 cursor-not-allowed border-gray-800' : 'border-indigo-500/10 hover:border-indigo-500/30'}`}>
          <div className="flex flex-col">
            <span className="text-xs font-black text-gray-200 uppercase tracking-wider">Upload Reference</span>
            <span className="text-[8px] text-gray-500 uppercase font-mono mt-1">Extract strict identity prompt</span>
          </div>
          <div className="bg-indigo-600 w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-xl group-hover:bg-indigo-500 transition-colors">
            <i className="fa-solid fa-camera text-lg"></i>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </label>
      </footer>
    </div>
  );
};

export default App;
