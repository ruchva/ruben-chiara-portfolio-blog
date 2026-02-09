
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import CaseStudy from './pages/CaseStudy';

const Dock: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/projects', icon: 'grid_view', label: 'Work' },
    { path: '/blog', icon: 'article', label: 'Blog' },
    { path: '/contact', icon: 'mail', label: 'Contact' }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-2 bg-card/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/5">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${isActive(item.path) ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
          >
            <span className="material-symbols-outlined text-[24px] group-hover:-translate-y-1 transition-transform">
              {item.icon}
            </span>
            <span className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-black text-white text-[10px] px-2 py-1 rounded transition-opacity pointer-events-none">
              {item.label}
            </span>
            {isActive(item.path) && (
              <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Header: React.FC = () => (
  <header className="max-w-7xl mx-auto w-full px-6 py-8 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
        <span className="material-symbols-outlined font-bold">terminal</span>
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight text-white leading-none">Ruben Chiara</h1>
        <p className="text-xs text-text-muted font-medium">Senior Full Stack Engineer</p>
      </div>
    </div>
    <div className="hidden sm:flex gap-4">
      <Link to="/contact" className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors flex items-center">
        Hire Me
      </Link>
    </div>
  </header>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col pb-32">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<CaseStudy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Dock />
      </div>
    </Router>
  );
};

export default App;
