const courses = {
  'cstrc-jp-dw': {
    title: 'Desenvolvimento Web',
    shortTitle: 'DW',
    href: '/courses/cstrc-jp-dw/',
  },
  'csbes-jp-pw2': {
    title: 'Programação para Web 2',
    shortTitle: 'PW2',
    href: '/courses/csbes-jp-pw2/',
  },
  'ctii-jp-lp2': {
    title: 'Linguagem de Programação II',
    shortTitle: 'LP2',
    href: '/courses/ctii-jp-lp2/',
  },
  python: {
    title: 'Guia de Python',
    shortTitle: 'Python',
    href: '/courses/python/',
  },
  typescript: {
    title: 'Guia de TypeScript',
    shortTitle: 'TS',
    href: '/courses/typescript/',
  },
  html: {
    title: 'Guia de HTML',
    shortTitle: 'HTML',
    href: '/courses/html/',
  },
  css: {
    title: 'Guia de CSS',
    shortTitle: 'CSS',
    href: '/courses/css/',
  },
  ecmascript: {
    title: 'Guia de ECMAScript',
    shortTitle: 'ECMAScript',
    href: '/courses/ecmascript/',
  },
  'web-api': {
    title: 'Guia de Web APIs',
    shortTitle: 'Web APIs',
    href: '/courses/web-api/',
  },
  nodejs: {
    title: 'Guia de Node.js',
    shortTitle: 'Node.js',
    href: '/courses/nodejs/',
  },
  express: {
    title: 'Guia de Express.js',
    shortTitle: 'Express.js',
    href: '/courses/express/',
  },
  database: {
    title: 'Guia de Banco de Dados',
    shortTitle: 'Banco de Dados',
    href: '/courses/database/',
  },
  react: {
    title: 'Guia de React',
    shortTitle: 'React',
    href: '/courses/react/',
  },
  packages: {
    title: 'Guia de Pacotes',
    shortTitle: 'Pacotes',
    href: '/courses/packages/',
  },
} as const;

export type CourseId = keyof typeof courses;

export function getCourse(course: string | undefined) {
  if (!course || !(course in courses)) return undefined;

  return courses[course as CourseId];
}
