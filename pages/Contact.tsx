
import React from 'react';
import { SOCIAL_LINKS } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
          Let's build something <span className="text-primary">great</span>.
        </h2>
        <p className="text-xl text-text-muted leading-relaxed max-w-2xl">
          Whether you're looking for an architect for a new fintech platform or a full-stack developer to ship a specialized product, I'm ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Card (Static) */}
        <div className="group p-8 rounded-3xl bg-card border border-card-border flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:bg-surface-elevated hover:shadow-2xl hover:shadow-blue-500/10 cursor-default">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[32px]">mail</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted uppercase font-black tracking-widest mb-2">Email Me</p>
            <p className="text-white font-bold break-all">{SOCIAL_LINKS.email}</p>
          </div>
        </div>

        {/* LinkedIn Card */}
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-8 rounded-3xl bg-card border border-card-border flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:bg-surface-elevated hover:shadow-2xl hover:shadow-blue-500/10"
        >
          <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[32px]">linked_camera</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted uppercase font-black tracking-widest mb-2">Connect</p>
            <p className="text-white font-bold group-hover:text-blue-400 transition-colors">LinkedIn Profile</p>
          </div>
        </a>

        {/* GitHub Card */}
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-8 rounded-3xl bg-card border border-card-border flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:bg-surface-elevated hover:shadow-2xl hover:shadow-purple-500/10"
        >
          <div className="size-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[32px]">terminal</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted uppercase font-black tracking-widest mb-2">Code</p>
            <p className="text-white font-bold group-hover:text-purple-400 transition-colors">GitHub Profile</p>
          </div>
        </a>

        {/* WhatsApp Card */}
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-8 rounded-3xl bg-card border border-card-border flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-green-500/50 hover:bg-surface-elevated hover:shadow-2xl hover:shadow-green-500/10"
        >
          <div className="size-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[32px]">chat</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted uppercase font-black tracking-widest mb-2">Chat</p>
            <p className="text-white font-bold group-hover:text-green-400 transition-colors">WhatsApp</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Contact;
