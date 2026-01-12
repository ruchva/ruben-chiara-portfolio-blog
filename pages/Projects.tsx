
import React from 'react';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16">
        <h2 className="text-5xl font-black text-white tracking-tight mb-4">Selected Works</h2>
        <p className="text-xl text-text-muted max-w-2xl">
          Deep dives into complex engineering problems, from digital identity at scale to low-level financial systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PROJECTS.map((project) => (
          <article key={project.id} className="group bento-card rounded-3xl border border-card-border bg-card overflow-hidden">
            <div className="h-64 overflow-hidden relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-card-border text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-text-muted mb-6 leading-relaxed">
                {project.description}
              </p>
              <button className="px-6 py-3 rounded-xl bg-card-border text-white text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                View Case Study <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Projects;
