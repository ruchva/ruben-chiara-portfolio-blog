
import React from 'react';
import { Project, BlogPost, TechStackItem } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'diplomas',
    title: 'Diploma de Bachiller Digital - Bolivia 2026',
    description: 'Sistema de gobierno para la emisión de diplomas de bachiller: 5 servicios desacoplados (backend, frontend, worker de generación de PDF, microservicio de firma digital e infraestructura como código con Ansible), SSO nacional (Ciudadanía Digital/AGETIC) y pruebas de carga reales. 15+ meses de evolución documentada con ADRs.',
    tags: ['React', 'Next.js', 'Spring Boot', 'PostgreSQL', 'Redis', 'Ansible', 'Firma Digital'],
    image: '/images/diplomas-architecture.svg',
    featured: true,
    type: 'web'
  },
  {
    id: 'diplomas-infra',
    title: 'Infraestructura y Despliegue - Ansible',
    description: 'Infraestructura como código para el ecosistema Diplomas: clúster distribuido de 4 nodos (datos, 2× worker, edge), aprovisionado por Ansible sobre SSH sin agentes. Reemplazó un piloto de un solo nodo con un diseño multi-entorno, promoción por git tag y secretos por entorno vía ansible-vault.',
    tags: ['Ansible', 'Docker', 'IaC', 'Observabilidad'],
    image: '/images/ansible-infra-topology.svg',
    type: 'backend'
  },
  {
    id: 'logros',
    title: 'Portal de Logros Educativos',
    description: 'Visualización y gestión de trayectoria académica estudiantil, con autenticación y almacenamiento gestionados en Supabase.',
    tags: ['React', 'Vite', 'Supabase', 'Tailwind'],
    image: '/images/logros-illustration.svg',
    type: 'web'
  },
  {
    id: 'certificacion',
    title: 'Portal de Certificación de Diplomas',
    description: 'Validación pública de certificaciones académicas con pasarela de pagos integrada para la emisión de duplicados y constancias.',
    tags: ['Spring Boot', 'React', 'Payment Gateway', 'PostgreSQL'],
    image: '/images/certificacion-illustration.svg',
    type: 'web'
  },
  {
    id: 'fintech',
    title: 'Core Bancario e Infraestructura Financiera',
    description: 'Implementación y mantenimiento de sistemas críticos para bolsa de valores y banca tradicional sobre infraestructura on-premise.',
    tags: ['Java', 'Oracle', 'JBoss', 'RedHat'],
    image: '/images/fintech-illustration.svg',
    type: 'fintech'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'websockets-a-polling',
    title: 'Por qué eliminamos WebSocket en favor de polling',
    excerpt: 'Un proxy corporativo que descarta el header Upgrade y un balanceador sin sesiones pegajosas rompían el progreso en tiempo real. La solución fue, contra la intuición, volver a algo más simple.',
    date: 'Sep 29, 2026',
    category: 'Engineering',
    readingTime: '9 min'
  },
  {
    id: 'open-banking-bolivia',
    title: 'Open Banking: la próxima frontera para la innovación financiera en Bolivia',
    excerpt: 'Un análisis sobre el estado regulatorio del Open Banking en Bolivia, sus beneficios y los siete pilares para una implementación exitosa. Publicado originalmente en LinkedIn.',
    date: 'Sep 2026',
    category: 'Industry',
    readingTime: '9 min'
  },
  {
    id: 'pruebas-de-carga-que-mienten',
    title: '"La cola está vacía" no es éxito: pruebas de carga que mentían',
    excerpt: 'Un mecanismo de pruebas de carga asumía que cola vacía significaba trabajo completado. La realidad: el 100% de las notificaciones fallaban en silencio y nadie se enteraba.',
    date: 'Jul 20, 2026',
    category: 'Engineering',
    readingTime: '11 min'
  },
  {
    id: 'fallo-silencioso-docker-tomcat',
    title: 'Un guion bajo rompió todas nuestras notificaciones',
    excerpt: 'Un nombre de servicio en Docker Compose con un guion bajo, RFC 1123 y el conector HTTP de Tomcat se combinaron para producir un fallo que nunca llegó a los logs de la aplicación.',
    date: 'Jul 15, 2026',
    category: 'Engineering',
    readingTime: '7 min'
  },
  {
    id: 'ceremonia-confirmacion-irreversible',
    title: 'Diseñar fricción a propósito: ceremonias para acciones irreversibles',
    excerpt: 'Cómo construimos una pantalla de confirmación que obliga a leer antes de autorizar, con un respaldo en PDF inmutable cuyo hash protege el acto, no el archivo.',
    date: 'Jun 7, 2026',
    category: 'Engineering',
    readingTime: '10 min'
  },
  {
    id: 'sso-nacional-strangler-fig',
    title: 'Integrar un SSO nacional sin romper el sistema legado',
    excerpt: 'Cómo migramos a la identidad digital nacional (Ciudadanía Digital/AGETIC) conviviendo con el login legado, usando el patrón Strangler Fig y un único contrato de sesión.',
    date: 'May 13, 2026',
    category: 'Engineering',
    readingTime: '10 min'
  }
];

export const TECH_STACK: TechStackItem[] = [
  { name: 'Java', slug: 'openjdk', hex: 'FFFFFF' },
  { name: 'Spring Boot', slug: 'springboot', hex: '6DB33F' },
  { name: 'PostgreSQL', slug: 'postgresql', hex: '4169E1' },
  { name: 'Redis', slug: 'redis', hex: 'FF4438' },
  { name: 'React', slug: 'react', hex: '61DAFB' },
  { name: 'Next.js', slug: 'nextdotjs', hex: 'FFFFFF' },
  { name: 'TypeScript', slug: 'typescript', hex: '3178C6' },
  { name: 'Docker', slug: 'docker', hex: '2496ED' },
  { name: 'Ansible', slug: 'ansible', hex: 'EE0000' },
  { name: 'Linux', slug: 'linux', hex: 'FCC624' },
];

export const SOCIAL_LINKS = {
  github: 'https://github.com/ruchva',
  linkedin: 'https://www.linkedin.com/in/ruben-chiara',
  email: 'ruchva@gmail.com',
  whatsapp: 'https://wa.me/59174048770',
};
