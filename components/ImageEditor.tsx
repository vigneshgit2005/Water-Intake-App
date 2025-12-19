
import React, { useState, useRef } from 'react';
import { Camera, Send, Loader2, Sparkles, Download, X } from 'lucide-react';
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
      alert("Technique interrupted. Check API Key.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-100 flex items-center gap-2"><Sparkles className="text-cyan-400" /> Aura Mastery</h3>
        {(image || result) && <button onClick={() => {setImage(null); setResult(null);}} className="text-slate-500"><X /></button>}
      </div>
      <div className="relative aspect-square bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
        {result || image ? <img src={result || image!} className="w-full h-full object-cover" /> : 
          <button onClick={() => inputRef.current?.click()} className="text-slate-600 flex flex-col items-center gap-2"><Camera size={40} /><span>Upload Avatar</span></button>}
        {isProcessing && <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-cyan-400"><Loader2 className="animate-spin mb-2" /><span>Visualizing...</span></div>}
      </div>
      <input type="file" ref={inputRef} hidden onChange={e => {
        const file = e.target.files?.[0];
        if (file) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(file); }
      }} />
      <div className="relative">
        <input className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Describe the change..." value={prompt} onChange={e => setPrompt(e.target.value)} />
        <button onClick={handleEdit} disabled={!image || isProcessing} className="absolute right-2 top-2 bottom-2 bg-cyan-600 px-4 rounded-xl"><Send size={18} /></button>
      </div>
    </div>
  );
}
