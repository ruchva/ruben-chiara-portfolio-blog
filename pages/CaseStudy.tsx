
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from '../src/components/Mermaid';

const CaseStudy: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/case-studies/${id}.md`)
            .then(res => {
                if (res.ok) return res.text();
                throw new Error('Case study not found');
            })
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setContent('# Case Study Not Found\n\nSorry, we couldn\'t find the requested case study.');
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
            <Link to="/projects" className="inline-flex items-center text-text-muted hover:text-primary mb-8 transition-colors group">
                <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back to Work
            </Link>

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

export default CaseStudy;
