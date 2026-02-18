import React from "react";
import { PROJECTS, TECH_STACK, BLOG_POSTS } from "../constants";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const featuredProject = PROJECTS.find((p) => p.featured) || PROJECTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4 lg:gap-6">
        {/* Profile Card */}
        <div className="group bento-card col-span-1 md:col-span-2 row-span-2 rounded-3xl border border-card-border bg-card p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 ease-out hover:border-glow-primary/50 hover:bg-surface-elevated hover:scale-[1.02] hover-target">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none inner-glow z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/5 to-glow-secondary/5" />
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start">
            <div
              className="size-32 rounded-full bg-cover bg-center border-4 border-card-border shadow-2xl flex-shrink-0 hover:scale-105 transition-all duration-300"
              style={{ backgroundImage: `url('/images/tatacuantico.jpg')` }}
            />
            <div className="flex-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Open for roles
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                Building the digital{" "}
                <span className="text-primary">infrastructure</span> of
                tomorrow.
              </h2>
              <p className="text-text-muted text-lg leading-relaxed max-w-lg">
                Senior Engineer specializing in Distributed Systems, Digital
                Signatures, and Financial Cores. 10+ years transforming complex
                business logic into scalable code.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 relative z-10">
            <Link
              to="/contact"
              className="px-8 h-12 rounded-2xl bg-primary hover:bg-blue-600 text-white font-bold flex items-center shadow-lg shadow-primary/20 transition-all"
            >
              Start a Project
            </Link>
          </div>
        </div>

        {/* Tech Stack Card */}
        <div className="group bento-card col-span-1 row-span-2 rounded-3xl border border-card-border bg-card p-6 flex flex-col gap-6 relative overflow-hidden transition-all duration-500 ease-out hover:border-glow-primary/50 hover:bg-surface-elevated hover:scale-[1.02] hover-target">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none inner-glow z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/5 to-glow-secondary/5" />
          </div>
          <div className="relative z-10 flex flex-col gap-6 h-full">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-text-muted">
                settings
              </span>
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">
                Expertise
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 h-full content-start">
              {TECH_STACK.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-card-border border border-white/5 hover:border-primary/30 transition-all group/stack"
                >
                  <span
                    className={`material-symbols-outlined text-[32px] ${tech.color} group-hover/stack:scale-110 transition-transform`}
                  >
                    {tech.icon}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paisaje */}
        <div
          className="bento-card col-span-1 row-span-2 rounded-3xl border border-card-border bg-card p-6 flex flex-col gap-6 relative overflow-hidden transition-all duration-500 ease-out hover:border-glow-primary/50 hover:bg-surface-elevated hover:scale-[1.02] hover-target"
          style={{
            backgroundImage: `url('/images/paisaje.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Featured Project Card */}
        <div className="group bento-card col-span-1 md:col-span-2 row-span-1 rounded-3xl border border-card-border bg-card relative overflow-hidden transition-all duration-500 ease-out hover:border-glow-primary/50 hover:bg-surface-elevated hover:scale-[1.02] hover-target min-h-[220px]">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none inner-glow z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/5 to-glow-secondary/5" />
          </div>
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
            style={{ backgroundImage: `url('${featuredProject.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
          <div className="relative p-8 h-full flex flex-col justify-center items-start gap-3">
            <div className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest backdrop-blur-sm">
              Featured Case Study
            </div>
            <h3 className="text-2xl font-bold text-white max-w-xs">
              {featuredProject.title}
            </h3>
            <p className="text-text-muted text-sm line-clamp-2 max-w-sm">
              {featuredProject.description}
            </p>
            <Link
              to="/projects"
              className="text-white font-bold text-sm flex items-center gap-2 mt-2 hover:text-primary transition-colors"
            >
              Read Details{" "}
              <span className="material-symbols-outlined text-[18px]">
                arrow_outward
              </span>
            </Link>
          </div>
        </div>

        {/* Blog Entry Card */}
        <div
          className="group bento-card col-span-1 row-span-1 rounded-3xl border border-card-border bg-card p-6 flex flex-col justify-between cursor-pointer transition-all duration-500 ease-out hover:border-glow-primary/50 hover:bg-surface-elevated hover:scale-[1.02] hover-target relative overflow-hidden"
          onClick={() => (window.location.hash = "#/blog")}
        >
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none inner-glow z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/5 to-glow-secondary/5" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
              <span className="text-xs text-text-muted font-mono">
                {BLOG_POSTS[0].date}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-2">
                Latest Writing
              </p>
              <h3 className="text-white font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                {BLOG_POSTS[0].title}
              </h3>
            </div>
          </div>
        </div>

        {/* Illustration Card (Location/Vibe) */}
        <div className="group bento-card col-span-1 row-span-1 rounded-3xl border border-card-border bg-card relative overflow-hidden transition-all duration-500 ease-out hover:border-glow-primary/50 hover:bg-surface-elevated hover:scale-[1.02] hover-target">
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none inner-glow z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/5 to-glow-secondary/5" />
          </div>
          <iframe
            src="https://maps.google.com/maps?q=Sopocachi,La+Paz,Bolivia&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale invert contrast-[1.2] pointer-events-none border-0"
            loading="lazy"
            title="Location Map"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
            <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-white tracking-wide">
              Centro Sopocachi, La Paz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
