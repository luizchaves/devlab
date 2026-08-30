/**
 * Catálogo dos projetos práticos.
 *
 * Fonte única usada pela homepage, pela página de projetos e pelos links de
 * "Ver código-fonte". Cada `source` aponta para um projeto real e executável
 * dentro de `examples/`.
 */

export type ProjectLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type ProjectCategory = 'express' | 'invest-app' | 'monitor-app' | 'web-api';

export interface Project {
  /** Identificador estável, igual ao diretório em `examples/`. */
  id: string;
  name: string;
  description: string;
  level: ProjectLevel;
  category: ProjectCategory;
  /** Se verdadeiro, o projeto ganha destaque na aba principal da homepage. */
  featured?: boolean;
  /** Tecnologias usadas, exibidas como lista separada por ponto. */
  tech: string[];
  /** Conceitos abordados na aula correspondente. */
  concepts: string[];
  /** Caminho interno da documentação (sem o `base`). */
  docs: string;
  /** Caminho do projeto no repositório. */
  source: string;
}

export const projects: Project[] = [
  // --- APLICAÇÕES COMPLETAS (TRILHAS INTEGRADAS) ---
  {
    id: 'invest-app',
    name: 'InvestApp — Gestão Financeira',
    description:
      'Aplicação web completa de gestão de finanças e investimentos construída em 13 etapas: da interface em Tailwind, API REST com Express.js, TypeScript e Zod à persistência relacional com Prisma, autenticação JWT, upload de avatares e testes.',
    level: 'Avançado',
    category: 'invest-app',
    featured: true,
    tech: ['Express.js', 'TypeScript', 'Prisma', 'JWT', 'Zod', 'Tailwind CSS'],
    concepts: ['Trilha de 13 Etapas', 'Arquitetura REST', 'ORM Prisma', 'Autenticação', 'Upload'],
    docs: '/courses/expressjs/practice/investapp/',
    source: 'examples/courses/express/projects/invest-app-test',
  },
  {
    id: 'monitor-app',
    name: 'MonitorApp — Monitoramento de Servidores',
    description:
      'Aplicação web completa de monitoramento de infraestrutura e hosts construída em 13 etapas: dashboard responsivo em Tailwind, API RESTful em TypeScript, pings TCP assíncronos, Prisma ORM, controle de acesso e tempo real com SSE.',
    level: 'Avançado',
    category: 'monitor-app',
    featured: true,
    tech: ['Express.js', 'TypeScript', 'Prisma', 'SSE', 'JWT', 'Tailwind CSS'],
    concepts: ['Trilha de 13 Etapas', 'Ping Assíncrono', 'Sockets TCP', 'Tempo Real (SSE)', 'RBAC'],
    docs: '/courses/expressjs/practice/monitorapp/',
    source: 'examples/courses/express/projects/monitor-app-test',
  },

  // --- GUIA / TRILHA EXPRESS.JS ---
  {
    id: 'task-api',
    name: 'TaskAPI — Projeto modelo do guia',
    description:
      'A API de tarefas que serve de referência executável para as aulas do Guia de Express.js: uma única aplicação em doze etapas cumulativas, do primeiro servidor com /health até testes e deploy.',
    level: 'Avançado',
    category: 'express',
    featured: true,
    tech: ['Express.js', 'TypeScript', 'Zod', 'Prisma', 'node:crypto'],
    concepts: ['Trilha de 12 Etapas', 'Rotas e Middleware', 'MVC', 'Validação', 'Autenticação'],
    docs: '/courses/expressjs/practice/taskapi/',
    source: 'examples/courses/express/projects/task-api-typescript',
  },
  {
    id: 'express-auth',
    name: 'Express Auth',
    description:
      'Cadastro, autenticação por JWT e autorização por posse e papel, usando apenas node:crypto.',
    level: 'Avançado',
    category: 'express',
    featured: true,
    tech: ['Node.js', 'Express.js', 'TypeScript', 'node:crypto'],
    concepts: ['Argon2id', 'JWT HS256', 'Autenticação', 'Autorização'],
    docs: '/courses/expressjs/practice/express-auth/',
    source: 'examples/courses/express/projects/auth',
  },

  // --- FRONT-END & WEB APIS ---
  {
    id: 'pingwatch-landing',
    name: 'PingWatch — Landing Page',
    description:
      'Landing page moderna e altamente responsiva para um serviço SaaS de monitoramento.',
    level: 'Iniciante',
    category: 'web-api',
    tech: ['HTML5', 'CSS3', 'Tailwind CSS'],
    concepts: ['Landing page', 'Seção hero', 'Breakpoints responsivos'],
    docs: '/courses/css/frameworks/tailwind/',
    source: 'examples/courses/css/frameworks/tailwind/pingwatch-landing',
  },
  {
    id: 'invest-app-dom',
    name: 'InvestApp — Interatividade & LocalStorage',
    description:
      'Versão cliente do InvestApp manipulando o DOM e salvando preferências no navegador.',
    level: 'Intermediário',
    category: 'web-api',
    tech: ['JavaScript', 'DOM API', 'LocalStorage'],
    concepts: ['Manipulação de elementos', 'Persistência no navegador', 'Eventos'],
    docs: '/courses/web-api/',
    source: 'examples/courses/web-api/local-storage/invest-app',
  },
  {
    id: 'json-server-mock',
    name: 'Mock API com JSON Server',
    description:
      'Servidor REST mockado rapidamente para apoiar o desenvolvimento e testes de aplicações front-end.',
    level: 'Iniciante',
    category: 'web-api',
    tech: ['JSON Server', 'Node.js'],
    concepts: ['Mock de API REST', 'Simulação de backend', 'Faker data'],
    docs: '/courses/packages/',
    source: 'examples/courses/packages/json-server',
  },
];

export function getProject(id: string): Project {
  const project = projects.find((candidate) => candidate.id === id);

  if (!project) {
    throw new Error(
      `Projeto "${id}" não encontrado. Disponíveis: ${projects.map((p) => p.id).join(', ')}`
    );
  }

  return project;
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((project) => project.category === category);
}

export function getFeaturedProjects(): Project[] {
  const featured = projects.filter((project) => project.featured);
  const categoryOrder: Record<ProjectCategory, number> = {
    'invest-app': 1,
    'monitor-app': 2,
    express: 3,
    'web-api': 4,
  };

  return featured.sort(
    (a, b) => (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99)
  );
}
