
import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Send, Loader2, Sparkles, Download, RefreshCw, X } from 'lucide-react';
import { editImageWithAI } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    try {
      // Determine mimeType
      const mimeType = image.split(';')[0].split(':')[1];
      const editedImageUrl = await editImageWithAI(image, prompt, mimeType);
      if (editedImageUrl) {
        setResult(editedImageUrl);
      }
    } catch (error) {
      alert("Error editing image. Please check your API key and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clear = () => {
    setImage(null);
    setResult(null);
    setPrompt('');
  };

  return (
    <div className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-100 tracking-tight">Aura Mastery</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Transform your Hashira Avatar</p>
          </div>
        </div>
        {(image || result) && (
          <button onClick={clear} className="text-slate-500 hover:text-red-400 p-2">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="relative aspect-square w-full bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-800 overflow-hidden flex items-center justify-center group">
        {!image && !result ? (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-4 text-slate-600 group-hover:text-cyan-400 transition-colors"
          >
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <Camera className="w-10 h-10" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Select Aura Image</span>
          </button>
        ) : (
          <img 
            src={result || image!} 
            alt="Preview" 
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-500" 
          />
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Concentrating Breathing...</p>
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        hidden 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-slate-200 font-bold placeholder:text-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
            placeholder="e.g., 'Add a water dragon breathing effect'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!image || isProcessing}
          />
          <button
            onClick={handleEdit}
            disabled={!image || !prompt || isProcessing}
            className="absolute right-2 top-2 bottom-2 bg-cyan-600 disabled:bg-slate-800 text-white rounded-xl px-4 transition-all hover:bg-cyan-500 flex items-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Retro Filter', 'Watercolor Style', 'Add Water Ripples', 'Nagi Atmosphere'].map((tag) => (
            <button
              key={tag}
              onClick={() => setPrompt(`Change the style of this image to ${tag}`)}
              disabled={!image || isProcessing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <a 
          href={result} 
          download="aura_mastery.png"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-center flex items-center justify-center gap-3 transition-all"
        >
          <Download className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Claim Technique Art</span>
        </a>
      )}
    </div>
  );
};

export default ImageEditor;
