const courses = {
  'dw-cstrc-jp': {
    title: 'Desenvolvimento Web',
    shortTitle: 'DW',
    href: '/courses/dw-cstrc-jp/',
  },
  'pw2-csbes-jp': {
    title: 'Programação para Web 2',
    shortTitle: 'PW2',
    href: '/courses/pw2-csbes-jp/',
  },
  'lp2-ctii-jp': {
    title: 'Linguagem de Programação II',
    shortTitle: 'LP2',
    href: '/courses/lp2-ctii-jp/',
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
  expressjs: {
    title: 'Guia de Express.js',
    shortTitle: 'Express.js',
    href: '/courses/expressjs/',
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
