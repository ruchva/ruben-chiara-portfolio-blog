
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from '../src/components/Mermaid';
import { BLOG_POSTS } from '../constants';

const BlogPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const meta = BLOG_POSTS.find((p) => p.id === id);

    useEffect(() => {
        setLoading(true);
        fetch(`/blog/${id}.md`)
            .then(res => {
                if (res.ok) return res.text();
                throw new Error('Post not found');
            })
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setContent('# Artículo no encontrado\n\nLo sentimos, no pudimos encontrar este artículo.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <Link to="/blog" className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors group">
                <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back to Technical Logs
            </Link>

            {meta && (
                <div className="flex items-center gap-4 mb-8 text-xs font-bold text-slate-500">
                    <span className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        {meta.category}
                    </span>
                    <span className="font-mono text-text-muted">{meta.date}</span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {meta.readingTime}
                    </span>
                </div>
            )}

            <article className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-3xl prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code(props) {
                            const { children, className, node, ...rest } = props
                            const match = /language-(\w+)/.exec(className || '')
                            if (match && match[1] === 'mermaid') {
                                return <Mermaid chart={String(children).replace(/\n$/, '')} />
                            }
                            return <code className={className} {...rest}>{children}</code>
                        }
                    }}
                >
                    {content}
                </Markdown>
            </article>
        </div>
    );
};

export default BlogPost;
