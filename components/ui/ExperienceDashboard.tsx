'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu, Activity, Server, Radio, ArrowRight } from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  period: string;
  tech: string[];
  points: string[];
  metrics: { label: string; value: string }[];
  terminalLog: string;
}

const EXPERIENCES: Experience[] = [
  {
    company: "BizMagnets",
    role: "Senior Product Engineer",
    period: "2022 - Present",
    tech: ["React/Next.js", "Node.js", "Socket.IO", "Redis", "FastAPI", "MongoDB"],
    points: [
      "Architected core SaaS framework supporting multi-tenant databases with strict isolation rules.",
      "Optimized query runtimes by 40% via multi-level caching strategies using Redis and indexing pipelines.",
      "Led development of real-time communication modules powered by Socket.IO for automated chats.",
      "Spearheaded product engineering workflows, bridging product roadmap and system deployments."
    ],
    metrics: [
      { label: "API Speedup", value: "40%" },
      { label: "Active Nodes", value: "8 / 8" },
      { label: "SaaS Tenants", value: "1,200+" }
    ],
    terminalLog: `> GET /api/v1/system/status... [200 OK]
> CACHE STATUS: REDIS_ACTIVE [HIT RATE 94.2%]
> CONNECTIONS: 14,240 concurrent sockets established
> SYSTEM METRICS: Load average [0.42, 0.38, 0.29]
> BIZMAGNETS ENGINE: Operational [Version 4.2.1-stable]`
  },
  {
    company: "ChatsOps Health",
    role: "Full Stack Developer",
    period: "2021 - 2022",
    tech: ["React", "Express", "WebRTC", "Socket.IO", "PostgreSQL"],
    points: [
      "Engineered real-time HIPAA-compliant video and chat consultation channels utilizing WebRTC.",
      "Re-architected client state management reducing UI rendering lags by 30%.",
      "Created automated notification dispatches to bridge doctors and patient schedules seamlessly."
    ],
    metrics: [
      { label: "Uptime Ratio", value: "99.98%" },
      { label: "Consultations", value: "85K+" },
      { label: "Latency Avg", value: "32ms" }
    ],
    terminalLog: `> CONNECT /tunnel/webrtc/secure... [SUCCESS]
> SSL HANDSHAKE: AES-256-GCM encrypted session
> DISPATCH: Message broker queue: 0 pending
> INTEGRATION: Patient record sync [100%]
> HEALTH CHECK: DB status [CONNECTED]`
  },
  {
    company: "Nippon Paint",
    role: "Software Engineer & Tech Specialist",
    period: "2020 - 2021",
    tech: ["React Native", "Node.js", "MySQL", "AWS EC2"],
    points: [
      "Built and deployed high-performance internal inventory distribution trackers using React Native.",
      "Designed SQL indexing pipelines resolving supply-chain transaction queue blockages.",
      "Coordinated cloud migration workflows transitioning legacy inventory hubs onto AWS container clusters."
    ],
    metrics: [
      { label: "Sync Speed", value: "2.1x" },
      { label: "Logins/Day", value: "12K+" },
      { label: "Migrate Time", value: "0 Downtime" }
    ],
    terminalLog: `> INVENTORY SYNC: Core nodes online
> AWS RDS INSTANCE: CPU utilization at 14%
> CLUSTER STATUS: Auto-scaled to 3 replicas
> LOGISTICS QUEUE: Clean [0 messages backlogged]
> API SERVICE: Nippon Paint portal [RUNNING]`
  },
  {
    company: "Buckman",
    role: "Technology Consultant",
    period: "2018 - 2020 (IoT & Digital Specialist)",
    tech: ["IoT Integration", "Python scripts", "SCADA Integration", "Data Analysis"],
    points: [
      "Consulted on industrial telemetry pipelines linking IoT sensor modules to administrative centers.",
      "Automated heavy equipment report compilations with customized Python ETL schedulers.",
      "Applied mechanical engineering logic to optimize chemical telemetry flow loops."
    ],
    metrics: [
      { label: "Sensors Active", value: "140+" },
      { label: "ETL Runtime", value: "-80%" },
      { label: "Safety Rating", value: "100%" }
    ],
    terminalLog: `> POLLING SENSOR GATEWAY #42... [142 telemetry streams online]
> TELEMETRY FLOW: 12.8 kg/s [NORMAL RANGE]
> PARSE: Raw telemetry data conversion to JSON [OK]
> DATABASE WRITE: Chronograf database updated [SUCCESS]
> ALERTS ENGINE: Guard rails active`
  }
];

export default function ExperienceDashboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const exp = EXPERIENCES[activeIndex];

  // Dynamic typing simulation inside the terminal
  useEffect(() => {
    setTypedText('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < exp.terminalLog.length) {
        setTypedText((prev) => prev + exp.terminalLog.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 4); // Fast typing speed

    return () => clearInterval(interval);
  }, [activeIndex, exp.terminalLog]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Tabs (Command Modules) */}
      <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
        {EXPERIENCES.map((item, idx) => (
          <button
            key={item.company}
            onClick={() => setActiveIndex(idx)}
            className={`flex-1 lg:flex-initial text-left px-5 py-4 rounded-xl border transition-all duration-300 backdrop-blur-sm cursor-pointer whitespace-nowrap lg:whitespace-normal group relative overflow-hidden ${
              activeIndex === idx
                ? 'bg-cyber-blue/10 border-cyber-blue shadow-lg shadow-cyber-blue/5'
                : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            {/* Active glowing indicator light */}
            {activeIndex === idx && (
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyber-blue shadow-[0_0_10px_#00f0ff]" />
            )}
            
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                activeIndex === idx ? 'bg-cyber-blue/20 text-cyber-blue' : 'bg-white/5 text-zinc-400 group-hover:text-white'
              }`}>
                {idx === 0 ? <Cpu size={16} /> : idx === 1 ? <Radio size={16} /> : idx === 2 ? <Server size={16} /> : <Activity size={16} />}
              </div>
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-widest font-display ${
                  activeIndex === idx ? 'text-cyber-blue' : 'text-zinc-400 group-hover:text-white'
                }`}>
                  {item.company}
                </h4>
                <p className="text-[11px] text-zinc-500 font-light mt-0.5">{item.role}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right Core System Specs Dashboard */}
      <div className="lg:col-span-8 flex flex-col justify-between glass-panel rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 cyber-grid-dots opacity-30 pointer-events-none" />
        
        {/* Top Header stats */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-cyber-blue" />
              <span className="text-[10px] font-display uppercase tracking-widest text-zinc-500 font-semibold">Security Level: Authorized</span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-black tracking-wide text-white mt-1">
              {exp.role} <span className="text-cyber-blue">@{exp.company}</span>
            </h2>
            <p className="text-xs text-zinc-400 font-light mt-1 font-mono">{exp.period}</p>
          </div>
          
          <div className="flex gap-4">
            {exp.metrics.map((metric) => (
              <div key={metric.label} className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-right">
                <span className="block text-[9px] font-display uppercase tracking-wider text-zinc-500 font-semibold">{metric.label}</span>
                <span className="block text-sm font-mono font-bold text-cyber-blue text-glow-blue mt-0.5">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body content */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Deliverables List */}
          <div>
            <h3 className="text-xs font-display uppercase tracking-wider text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue" /> Core System Implementations
            </h3>
            <ul className="space-y-3">
              {exp.points.map((pt, i) => (
                <li key={i} className="flex gap-3 items-start text-xs text-zinc-400 leading-relaxed font-light">
                  <ArrowRight size={12} className="text-cyber-blue mt-0.5 flex-shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Simulated System Node Monitor Terminal */}
          <div className="flex flex-col h-full min-h-[180px] bg-black/70 border border-white/15 rounded-xl overflow-hidden font-mono text-[11px] leading-relaxed relative">
            <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                <Terminal size={12} className="text-cyber-blue" /> SYSTEM_LOGGER.sh
              </span>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>
            <div className="p-4 flex-1 text-green-400/90 whitespace-pre-wrap overflow-y-auto max-h-[160px] scrollbar-none select-text">
              {typedText}
              <span className="inline-block w-1.5 h-3 bg-green-400 ml-1 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tech orbits tags bar */}
        <div className="relative z-10 border-t border-white/10 pt-5 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-display uppercase tracking-wider text-zinc-500 font-semibold mr-2">Subsystem Stack:</span>
          {exp.tech.map((t) => (
            <span
              key={t}
              className="glass-panel text-white/80 border-white/10 px-3 py-1 rounded-lg text-[10px] font-mono hover:text-cyber-blue hover:border-cyber-blue/40 transition-colors duration-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
