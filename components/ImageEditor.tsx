
import React, { useState, useRef } from 'react';
import { Camera, Send, Loader2, Sparkles, Download, X, Cloud } from 'lucide-react';
import { editImageWithAI } from '../services/geminiService';

export default function ImageEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    try {
      const mimeType = image.split(';')[0].split(':')[1];
      const res = await editImageWithAI(image, prompt, mimeType);
      if (res) setResult(res);
    } catch {
      alert("Sky calibration error. Ensure your Cloud Key is valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-sky-950/20 rounded-[3rem] p-8 border border-sky-900/30 space-y-6 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Cloud className="text-sky-400 w-6 h-6" />
            <h3 className="text-lg font-black text-white italic tracking-tighter">Cloud Persona</h3>
        </div>
        {(image || result) && (
          <button 
            onClick={() => {setImage(null); setResult(null);}} 
            className="p-2 bg-sky-900/40 rounded-xl text-sky-400 hover:bg-sky-800 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="relative aspect-square bg-sky-950 border-4 border-sky-900/30 rounded-[2.5rem] flex items-center justify-center overflow-hidden group shadow-2xl">
        {result || image ? (
          <img src={result || image!} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000" />
        ) : (
          <button 
            onClick={() => inputRef.current?.click()} 
            className="text-sky-800 flex flex-col items-center gap-4 hover:text-sky-400 transition-colors"
          >
            <div className="p-6 bg-sky-900/20 rounded-full border-2 border-dashed border-sky-900">
                <Camera size={48} />
            </div>
            <span className="font-black uppercase tracking-widest text-xs">Calibrate Lens</span>
          </button>
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 bg-sky-950/80 flex flex-col items-center justify-center text-sky-300 backdrop-blur-sm">
            <Loader2 className="animate-spin mb-4 w-10 h-10" />
            <span className="font-black uppercase tracking-[0.3em] text-xs">Uploading to Sky...</span>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={inputRef} 
        hidden 
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) { 
            const r = new FileReader(); 
            r.onload = () => setImage(r.result as string); 
            r.readAsDataURL(file); 
          }
        }} 
      />

      <div className="relative group">
        <input 
          className="w-full bg-sky-950/50 border border-sky-900/50 rounded-2xl py-5 px-6 text-white outline-none focus:ring-2 focus:ring-sky-500 transition-all font-black text-sm placeholder-sky-900/40" 
          placeholder="Manifest a new horizon..." 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
        />
        <button 
          onClick={handleEdit} 
          disabled={!image || isProcessing} 
          className="absolute right-2 top-2 bottom-2 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-900 disabled:opacity-50 text-white px-6 rounded-xl transition-all shadow-lg active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
      
      <p className="text-[10px] text-sky-900 font-bold uppercase text-center tracking-widest">
        AI Imagery powered by Gemini 2.5
      </p>
    </div>
  );
}
