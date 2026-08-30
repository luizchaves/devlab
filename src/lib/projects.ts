/**
 * Catalogo dos projetos praticos.
 *
 * Fonte única usada pela homepage, pela pagina de projetos e pelos links de
 * "Ver codigo-fonte". Cada `source` aponta para um projeto real e executavel
 * dentro de `examples/`.
 */

export type ProjectLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Project {
  /** Identificador estável, igual ao diretório em `examples/`. */
  id: string;
  name: string;
  description: string;
  level: ProjectLevel;
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
  {
    id: 'express-basic',
    name: 'Hello Express',
    description: 'Primeiro servidor HTTP com Express: rotas, JSON e o ciclo requisição/resposta.',
    level: 'Iniciante',
    tech: ['Node.js', 'Express.js'],
    concepts: ['Servidor HTTP', 'Rotas', 'JSON'],
    docs: '/courses/expressjs/practice/hello-express/',
    source: 'examples/courses/express/projects/hello',
  },
  {
    id: 'express-router',
    name: 'Express Router',
    description: 'Separação das rotas em módulos com express.Router() e montagem por prefixo.',
    level: 'Iniciante',
    tech: ['Node.js', 'Express.js'],
    concepts: ['express.Router()', 'Modularização', 'Parâmetros de rota'],
    docs: '/courses/expressjs/practice/express-router/',
    source: 'examples/courses/express/projects/router',
  },
  {
    id: 'express-mvc',
    name: 'Express MVC',
    description:
      'Organização de uma aplicação Express utilizando MVC: models, controllers e routes.',
    level: 'Intermediário',
    tech: ['Node.js', 'Express.js', 'MVC'],
    concepts: ['Separação de responsabilidades', 'Controllers', 'Models', 'Middleware de erro'],
    docs: '/courses/expressjs/practice/express-mvc/',
    source: 'examples/courses/express/projects/mvc',
  },
  {
    id: 'express-typescript',
    name: 'Express TypeScript',
    description:
      'A mesma API em camadas, migrada para TypeScript e executada nativamente pelo Node.',
    level: 'Intermediário',
    tech: ['Node.js', 'Express.js', 'TypeScript'],
    concepts: ['Type stripping', 'Subpath imports', 'Tipagem de req e res', 'HttpError'],
    docs: '/courses/expressjs/practice/express-typescript/',
    source: 'examples/courses/express/projects/typescript',
  },
  {
    id: 'express-prisma',
    name: 'Express + Prisma',
    description:
      'Persistência real em SQLite com Prisma ORM e um CRUD completo sobre a estrutura MVC.',
    level: 'Avançado',
    tech: ['Node.js', 'Express.js', 'Prisma', 'SQLite'],
    concepts: ['ORM', 'Schema', 'Migrations', 'CRUD assíncrono'],
    docs: '/courses/expressjs/practice/express-prisma/',
    source: 'examples/courses/express/projects/prisma',
  },
  {
    id: 'express-auth',
    name: 'Express Auth',
    description:
      'Cadastro, autenticação por JWT e autorização por posse e papel, usando apenas node:crypto.',
    level: 'Avançado',
    tech: ['Node.js', 'Express.js', 'TypeScript', 'node:crypto'],
    concepts: ['Argon2id', 'JWT HS256', 'Autenticação', 'Autorização'],
    docs: '/courses/expressjs/practice/express-auth/',
    source: 'examples/courses/express/projects/auth',
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
