
import React from 'react';
import { BLOG_POSTS } from '../constants';

const Blog: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-black text-white tracking-tight mb-4">Technical Logs</h2>
        <p className="text-xl text-text-muted">
          Thoughts on distributed systems, banking infrastructure, and the future of web architecture.
        </p>
      </div>

      <div className="space-y-8">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="group p-8 rounded-3xl border border-card-border bg-card hover:border-primary/40 transition-all">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <p className="text-sm font-mono text-text-muted mb-2">{post.date}</p>
                <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {post.readingTime}
                  </span>
                  <button className="text-primary hover:underline">Read Article</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
