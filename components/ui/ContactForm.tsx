'use client';

import React, { useState } from 'react';
import { Mail, Send, Terminal, ShieldAlert, CheckCircle } from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function ContactForm() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setStatus('transmitting');
    setProgress(0);

    // Simulate packet transfer / upload progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('success');
          return 100;
        }
        const step = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + step, 100);
      });
    }, 120);
  };

  const handleReset = () => {
    setFormState({ name: '', email: '', message: '' });
    setStatus('idle');
    setProgress(0);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Holographic Social Nodes */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex-1 flex flex-col justify-between">
          <div className="absolute inset-0 cyber-grid-dots opacity-20" />
          
          <div className="relative z-10">
            <h3 className="text-sm font-display uppercase tracking-widest text-cyber-blue font-bold flex items-center gap-2">
              <Terminal size={14} /> COMMUNICATOR_LINK.exe
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-3 leading-relaxed">
              Initiate direct contact. Establishing connection routes via secure network interfaces. Select an endpoint below for instant sync.
            </p>
          </div>

          <div className="space-y-3.5 mt-8 relative z-10">
            {/* Social Grid Cards */}
            <a 
              href="mailto:hafi.me.16@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="Mail Me"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl transition-all duration-300 hover:border-cyber-blue/40 hover:bg-cyber-blue/5 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyber-blue/10 text-cyber-blue group-hover:bg-cyber-blue/20 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 group-hover:text-white font-display">Email Inbox</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">hafi.me.16@gmail.com</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity">ESTABLISH_ROUTE</span>
            </a>

            <a 
              href="https://github.com/hafiz999" 
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="Github"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl transition-all duration-300 hover:border-cyber-purple/40 hover:bg-cyber-purple/5 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyber-purple/10 text-cyber-purple group-hover:bg-cyber-purple/20 group-hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] transition-all flex items-center justify-center">
                  <GithubIcon />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 group-hover:text-white font-display">GitHub profile</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">github.com/hafiz999</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity">CLONE_REPOS</span>
            </a>

            <a 
              href="https://www.linkedin.com/in/j-md-hafizur-rahman-6291a11b6/" 
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="LinkedIn"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl transition-all duration-300 hover:border-cyber-gold/40 hover:bg-cyber-gold/5 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyber-gold/10 text-cyber-gold group-hover:bg-cyber-gold/20 group-hover:shadow-[0_0_15px_rgba(255,170,0,0.4)] transition-all flex items-center justify-center">
                  <LinkedinIcon />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 group-hover:text-white font-display">LinkedIn Connect</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">linkedin.com/in/hafizur-rahman</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-cyber-gold opacity-0 group-hover:opacity-100 transition-opacity">SYNC_NETWORK</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Cyber Message Form Gateway */}
      <div className="lg:col-span-7 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

        {status === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display uppercase tracking-widest text-zinc-500 font-bold">MESSAGE_GATEWAY.bin</h3>
                <span className="text-[9px] font-mono text-green-400 animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> SYSTEM ONLINE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display uppercase tracking-wider text-zinc-400 font-semibold">User Identification</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 focus:border-cyber-blue focus:bg-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-display uppercase tracking-wider text-zinc-400 font-semibold">Transmission Endpoint</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 focus:border-cyber-blue focus:bg-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5 mt-5">
                <label className="block text-[10px] font-display uppercase tracking-wider text-zinc-400 font-semibold">Encrypted Payload</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Draft your transmissions..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/5 focus:border-cyber-blue focus:bg-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all placeholder:text-zinc-600 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              data-cursor-text="Transmit"
              className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-cyber-blue/10 hover:bg-cyber-blue/20 text-cyber-blue hover:text-white border border-cyber-blue hover:border-white rounded-xl text-xs font-display font-semibold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.05)] cursor-pointer"
            >
              <Send size={14} /> Initialize Transmission
            </button>
          </form>
        )}

        {status === 'transmitting' && (
          <div className="relative z-10 flex flex-col justify-center items-center h-full py-12">
            <ShieldAlert className="text-cyber-blue animate-bounce" size={36} />
            <h3 className="text-base font-display font-black tracking-widest text-white mt-4 uppercase">TRANSMITTING PACKETS</h3>
            <p className="text-[10px] text-zinc-400 font-mono mt-1">Routing headers and payload encrypt...</p>
            
            {/* Holographic loading progress bar */}
            <div className="w-full max-w-sm mt-8 border border-white/10 p-1.5 rounded-full bg-black/40">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple transition-all duration-150 shadow-[0_0_10px_#00f0ff]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between w-full max-w-sm mt-2 text-[9px] font-mono text-zinc-500">
              <span>SYNC_OFFSET: {progress * 4}ms</span>
              <span>PROGRESS: {progress}%</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="relative z-10 flex flex-col justify-center items-center h-full py-12 text-center">
            <CheckCircle className="text-green-400 animate-pulse" size={38} style={{ filter: "drop-shadow(0 0 8px rgba(74,222,128,0.4))" }} />
            <h3 className="text-lg font-display font-black tracking-widest text-green-400 mt-4 uppercase">HANDSHAKE COMPLETE</h3>
            <p className="text-xs text-zinc-300 mt-2 max-w-xs font-light">
              Transmission packet successfully compiled and routed. Thank you, {formState.name}. I will respond shortly.
            </p>
            
            <button
              onClick={handleReset}
              className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 rounded-xl text-[10px] font-display font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              Close Connection Route
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
