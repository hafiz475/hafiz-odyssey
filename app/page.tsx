'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, ArrowDown, ChevronRight, Play, ExternalLink, Zap } from 'lucide-react';
import LenisProvider from '@/components/LenisProvider';
import CustomCursor from '@/components/CustomCursor';
import CanvasContainer from '@/components/3d/CanvasContainer';
import HeroScene from '@/components/3d/HeroScene';
import JourneyScene from '@/components/3d/JourneyScene';
import SkillsGalaxyScene from '@/components/3d/SkillsGalaxyScene';
import FounderLabScene from '@/components/3d/FounderLabScene';
import AIZoneScene from '@/components/3d/AIZoneScene';
import ExperienceDashboard from '@/components/ui/ExperienceDashboard';
import ContactForm from '@/components/ui/ContactForm';

export default function Home() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const [journeyProgress, setJourneyProgress] = useState(0);
  
  // Active state for city node inspection inside Founder Lab
  const [selectedCityNode, setSelectedCityNode] = useState<{
    name: string;
    desc: string;
    color: string;
  } | null>(null);

  // Monitor scroll for the 3D Journey spline animation progress
  useEffect(() => {
    const handleScroll = () => {
      if (!journeyRef.current) return;
      const rect = journeyRef.current.getBoundingClientRect();
      const elementHeight = journeyRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      const totalScrollable = elementHeight - viewportHeight;
      const scrolled = -rect.top;
      
      const progress = Math.max(0.0, Math.min(scrolled / totalScrollable, 1.0));
      setJourneyProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LenisProvider>
      <CustomCursor />

      {/* Cyber Grid Base Atmosphere */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-radial-[at_50%_-20%] from-cyan-900/10 via-transparent to-transparent pointer-events-none z-0" />

      {/* Futuristic Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#hero" className="font-display font-black text-sm tracking-widest text-white flex items-center gap-1.5 hover:text-cyber-blue transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-blue animate-pulse" />
            HAF.CORE // v1.0
          </a>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#journey" className="text-[10px] font-display font-bold uppercase tracking-widest text-zinc-400 hover:text-cyber-blue transition-colors">Career spline</a>
            <a href="#skills" className="text-[10px] font-display font-bold uppercase tracking-widest text-zinc-400 hover:text-cyber-blue transition-colors">Skills orbits</a>
            <a href="#experience" className="text-[10px] font-display font-bold uppercase tracking-widest text-zinc-400 hover:text-cyber-blue transition-colors">Dashboard</a>
            <a href="#founder" className="text-[10px] font-display font-bold uppercase tracking-widest text-zinc-400 hover:text-cyber-blue transition-colors">Founder lab</a>
            <a href="#ai-zone" className="text-[10px] font-display font-bold uppercase tracking-widest text-zinc-400 hover:text-cyber-blue transition-colors">AI Core</a>
            <a href="#contact" className="px-4 py-1.5 glass-panel text-[10px] font-display font-bold uppercase tracking-widest text-cyber-blue rounded-lg border border-cyber-blue/30 hover:bg-cyber-blue hover:text-black hover:border-cyber-blue transition-all">Establish Link</a>
          </div>
        </nav>
      </header>

      <main className="relative z-10 w-full">
        {/* SECTION 1: HERO */}
        <section id="hero" className="relative h-screen flex items-center overflow-hidden border-b border-white/5">
          <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Side Details */}
            <div className="lg:col-span-6 space-y-6 select-none mt-12 lg:mt-0">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyber-blue" />
                <span className="text-[10px] font-display uppercase tracking-widest text-zinc-400 font-semibold">INITIALIZING IDENTITY PARSER</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-sm md:text-base font-display font-bold uppercase tracking-widest text-cyber-blue">Senior Product Engineer</h2>
                <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-none text-white">
                  J MD HAFIZUR<br />
                  <span className="text-gradient-blue-purple text-glow-blue">RAHMAN</span>
                </h1>
              </div>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl font-light">
                Engineering high-performance enterprise SaaS, scalable MERN architectures, and real-time synchronization pipelines. Bridging mechanical systems logic and full-stack product engineering.
              </p>
              <div className="flex gap-4 pt-2">
                <a 
                  href="#journey" 
                  className="flex items-center gap-2 px-6 py-3.5 bg-cyber-blue text-black font-display font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-white/20"
                >
                  Initiate Scan <ChevronRight size={14} />
                </a>
                <a 
                  href="#contact" 
                  className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-display font-bold uppercase tracking-widest text-[11px] rounded-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  Direct Link
                </a>
              </div>
            </div>
            {/* Right Side 3D Canvas */}
            <div className="lg:col-span-6 w-full h-[400px] lg:h-[550px] relative">
              <div className="absolute inset-0 bg-radial-gradient from-cyber-blue/10 to-transparent blur-3xl pointer-events-none" />
              <CanvasContainer cameraPosition={[0, 0, 5]} fov={75}>
                <HeroScene />
              </CanvasContainer>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce pointer-events-none">
            <span className="text-[9px] font-display uppercase tracking-widest text-zinc-500 font-bold">SCROLL ENGINE TO ENGAGE</span>
            <ArrowDown size={14} className="text-cyber-blue" />
          </div>
        </section>

        {/* SECTION 2: JOURNEY TIMELINE (TUNNEL) */}
        <section id="journey" ref={journeyRef} className="relative h-[250vh] bg-black">
          {/* Sticky view wrapper */}
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Overlay Header Info */}
            <div className="absolute top-24 left-6 md:left-12 z-20 pointer-events-none select-none">
              <span className="text-[10px] font-display uppercase tracking-widest text-cyber-blue font-bold">SYSTEMS_TRACE.log</span>
              <h2 className="text-xl md:text-3xl font-display font-black tracking-wide text-white mt-1">
                CAREER SPLINE <span className="text-zinc-600">TRANSIT</span>
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">PROGRESS VECTOR: {(journeyProgress * 100).toFixed(0)}%</p>
            </div>
            
            {/* Main Spline Canvas */}
            <div className="w-full h-full">
              <CanvasContainer cameraPosition={[0, 0, 15]} fov={70}>
                <JourneyScene scrollProgress={journeyProgress} />
              </CanvasContainer>
            </div>
            
            {/* Bottom scroll progression meter */}
            <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 z-20 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono text-zinc-500">
              <span>SECTOR_0: MECHANICAL</span>
              <div className="w-1/2 bg-white/5 h-[2px] rounded-full mx-4 relative overflow-hidden">
                <div 
                  className="h-full bg-cyber-blue shadow-[0_0_8px_#00f0ff]" 
                  style={{ width: `${journeyProgress * 100}%` }}
                />
              </div>
              <span>SECTOR_MAX: FOUNDER</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: SKILLS GALAXY */}
        <section id="skills" className="relative min-h-screen flex items-center py-24 border-t border-b border-white/5 bg-[#030303]">
          <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Texts */}
            <div className="lg:col-span-5 space-y-6 select-none">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-cyber-purple" />
                <span className="text-[10px] font-display uppercase tracking-widest text-zinc-400 font-semibold">SKILLSETS CONFIGURATION</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight text-white">
                TECHNOLOGY<br />
                <span className="text-gradient-blue-purple text-glow-purple">GALAXY</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Technologies organized as celestial bodies orbiting around our engineering core competency. Ranging from front-end layout rendering to real-time microservices and database clustering.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                  <span className="block text-[9px] font-display uppercase tracking-wider text-zinc-500 font-bold">Orbital Core</span>
                  <span className="text-xs font-semibold text-white mt-1 block">Full Stack MERN</span>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                  <span className="block text-[9px] font-display uppercase tracking-wider text-zinc-500 font-bold">Fast Interstellar</span>
                  <span className="text-xs font-semibold text-white mt-1 block">Redis & FastAPI</span>
                </div>
              </div>
            </div>

            {/* Right Galaxy Canvas */}
            <div className="lg:col-span-7 h-[450px] lg:h-[600px] relative">
              <CanvasContainer cameraPosition={[0, 4, 6]} fov={60}>
                <SkillsGalaxyScene />
              </CanvasContainer>
            </div>
          </div>
        </section>

        {/* SECTION 4: EXPERIENCE COMMAND CENTER */}
        <section id="experience" className="relative min-h-screen py-28 flex items-center bg-black">
          <div className="max-w-7xl mx-auto w-full px-6 relative z-10 space-y-12">
            <div className="space-y-2 text-center md:text-left select-none">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Shield size={14} className="text-cyber-blue animate-pulse" />
                <span className="text-[10px] font-display uppercase tracking-widest text-zinc-400 font-semibold">SECTOR COMMAND MONITOR</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-wide text-white">
                EXPERIENCE <span className="text-gradient-blue-purple">COMMAND</span> CENTER
              </h2>
              <p className="text-xs md:text-sm text-zinc-500 font-light max-w-xl">
                Operate the telemetry panels below to access execution outputs, performance metrics, and logs compiled across different positions.
              </p>
            </div>

            <ExperienceDashboard />
          </div>
        </section>

        {/* SECTION 5: FOUNDER LAB (DIRECTION7 CITY) */}
        <section id="founder" className="relative min-h-screen py-24 border-t border-b border-white/5 bg-[#030303] overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-cyber-gold/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left 3D City */}
            <div className="lg:col-span-7 h-[400px] lg:h-[550px] relative order-2 lg:order-1">
              <CanvasContainer cameraPosition={[4, 3, 5]} fov={55}>
                <FounderLabScene onSelectNode={setSelectedCityNode} />
              </CanvasContainer>
            </div>

            {/* Right Information Inspect Center */}
            <div className="lg:col-span-5 space-y-6 order-1 lg:order-2 select-none">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-gold" />
                <span className="text-[10px] font-display uppercase tracking-widest text-zinc-400 font-semibold">STARTUP LAB // DIRECTION7</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-none text-white">
                FOUNDER<br />
                <span className="text-gradient-gold-red" style={{ filter: "drop-shadow(0 0 15px rgba(255,170,0,0.15))" }}>LABORATORY</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Showcasing Direction7: a modular SaaS business architecture represented as a digital metropolis. Interact with buildings in the viewport to audit separate system modules.
              </p>

              {/* Inspector Output Panel */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 min-h-[160px] flex flex-col justify-between transition-all duration-300 relative">
                <div className="absolute top-0 right-4 translate-y-[-50%] bg-[#030303] px-2 text-[9px] font-mono text-cyber-gold">
                  INSPECTOR_V1.9
                </div>
                
                <AnimatePresence mode="wait">
                  {selectedCityNode ? (
                    <motion.div
                      key={selectedCityNode.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <h4 className="text-base font-display font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: selectedCityNode.color }} />
                        {selectedCityNode.name}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light font-sans">
                        {selectedCityNode.desc}
                      </p>
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-display font-semibold text-cyber-gold tracking-widest uppercase bg-cyber-gold/10 px-2 py-1 rounded">
                          <Play size={10} /> INITIALIZE DEMO RUN
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-6 text-center text-zinc-600"
                    >
                      <span className="text-[10px] font-mono uppercase tracking-wider animate-pulse">Awaiting mesh collision triggers...</span>
                      <span className="text-[9px] font-sans text-zinc-500 mt-1">Click buildings on the city graph to audit specs</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: AI INNOVATION ZONE */}
        <section id="ai-zone" className="relative min-h-screen py-24 flex items-center bg-black">
          <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Texts */}
            <div className="lg:col-span-5 space-y-6 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-display uppercase tracking-widest text-zinc-400 font-semibold">NEURAL PATTERNS</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-none text-white">
                AI INNOVATION<br />
                <span className="text-emerald-400" style={{ textShadow: "0 0 15px rgba(52,211,153,0.3)" }}>ZONE</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Exploring vector search algorithms, natural language classifiers, and automatic semantic scrapers. Showcasing the **AI Job Recommendation Platform** that computes matchmaking parameters inside high-dimensional vector space.
              </p>

              <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-2">
                <span className="block text-[9px] font-display uppercase tracking-wider text-zinc-500 font-bold">AI PLATFORM SCORES</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-light">Cosine Similarity Match</span>
                  <span className="font-mono text-emerald-400 font-bold">98.4%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-light">Embeddings Dimension</span>
                  <span className="font-mono text-zinc-300">1536 (Ada-002)</span>
                </div>
              </div>
            </div>

            {/* Right Neural Canvas */}
            <div className="lg:col-span-7 h-[400px] lg:h-[550px] relative">
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
              <CanvasContainer cameraPosition={[0, 0, 4.5]} fov={60}>
                <AIZoneScene />
              </CanvasContainer>
            </div>
          </div>
        </section>

        {/* SECTION 7: CONTACT PORTAL */}
        <section id="contact" className="relative min-h-screen py-28 flex items-center bg-[#030303] border-t border-white/5">
          <div className="max-w-7xl mx-auto w-full px-6 relative z-10 space-y-12">
            <div className="space-y-2 text-center select-none">
              <span className="text-[10px] font-display uppercase tracking-widest text-cyber-blue font-bold">TRANSMIT_ENDPOINT.bin</span>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-wide text-white">
                CONTACT <span className="text-gradient-blue-purple text-glow-blue">PORTAL</span>
              </h2>
              <p className="text-xs md:text-sm text-zinc-500 font-light max-w-md mx-auto">
                Sync socket paths and transmit packet dispatches directly into J Md Hafizur Rahman's primary mailbox gateway.
              </p>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      {/* Futuristic Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black py-8 select-none text-[10px] font-mono text-zinc-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>DESIGN SYSTEM INITIALIZED: v1.0.0-PROD</span>
          <span>&copy; {new Date().getFullYear()} J MD HAFIZUR RAHMAN. ALL RIGHTS ENCRYPTED.</span>
        </div>
      </footer>
    </LenisProvider>
  );
}
