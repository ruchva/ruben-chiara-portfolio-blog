
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tight mb-6">Let's build something <span className="text-primary">great</span>.</h2>
          <p className="text-xl text-text-muted leading-relaxed mb-12">
            Whether you're looking for an architect for a new fintech platform or a full-stack developer to ship a specialized product, I'm ready to help.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="size-12 rounded-2xl bg-card border border-card-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase font-black tracking-widest mb-1">Email Me</p>
                <p className="text-white font-bold">ruben.chiara@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="size-12 rounded-2xl bg-card border border-card-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">linked_camera</span>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase font-black tracking-widest mb-1">LinkedIn</p>
                <p className="text-white font-bold">linkedin.com/in/rubenchiara</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-3xl border border-card-border">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted">Full Name</label>
              <input type="text" className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted">Email Address</label>
              <input type="email" className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted">Project Message</label>
              <textarea rows={4} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Tell me about your project..."></textarea>
            </div>
            <button className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-primary/20">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
