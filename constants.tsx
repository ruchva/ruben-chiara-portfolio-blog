
import React from 'react';
import { Project, BlogPost } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'diplomas',
    title: 'Sistema de Emisión de Diplomas de Bachiller',
    description: 'Plataforma robusta con Firma Digital integrada. Frontend en React/Next/MUI y Backend con Spring Boot, Postgres, Redis, y S3.',
    tags: ['React', 'Next.js', 'Spring Boot', 'Postgres', 'Digital Signature'],
    image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=2000&auto=format&fit=crop',
    featured: true,
    type: 'web'
  },
  {
    id: 'logros',
    title: 'Portal de Logros Educativos',
    description: 'Visualización y gestión de trayectoria académica. Desarrollado con Vite, React, shadcn/ui y Supabase.',
    tags: ['React', 'Vite', 'Supabase', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop',
    type: 'web'
  },
  {
    id: 'certificacion',
    title: 'Portal de Certificación de Diplomas',
    description: 'Servicio de validación y pagos para certificaciones académicas con pasarela de pagos integrada.',
    tags: ['Spring Boot', 'React', 'Payment Gateway', 'Postgres'],
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop',
    type: 'web'
  },
  {
    id: 'fintech',
    title: 'Core Bancario e Infraestructura Financiera',
    description: 'Implementación y mantenimiento de sistemas críticos para bolsa de valores y banca tradicional.',
    tags: ['Java', 'Oracle', 'JBoss', 'RedHat'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop',
    type: 'fintech'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Implementando Firma Digital en Java',
    excerpt: 'Guía técnica sobre el uso de estándares XAdES y PAdES en entornos gubernamentales.',
    date: 'Mar 15, 2024',
    category: 'Engineering',
    readingTime: '10 min'
  },
  {
    id: '2',
    title: 'Optimizando el Core Bancario',
    excerpt: 'Estrategias de tunning para bases de datos Oracle en entornos de alta transaccionalidad.',
    date: 'Feb 28, 2024',
    category: 'Database',
    readingTime: '15 min'
  }
];

export const TECH_STACK = [
  { name: 'React', icon: 'code_blocks', color: 'text-blue-400' },
  { name: 'Spring Boot', icon: 'settings_b_roll', color: 'text-green-500' },
  { name: 'Postgres', icon: 'database', color: 'text-indigo-400' },
  { name: 'TypeScript', icon: 'javascript', color: 'text-blue-500' },
  { name: 'Tailwind', icon: 'css', color: 'text-cyan-400' },
  { name: 'Java', icon: 'terminal', color: 'text-red-400' }
];
