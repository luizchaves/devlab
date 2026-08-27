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
  ecmascript: {
    title: 'Guia de ECMAScript',
    shortTitle: 'ECMAScript',
    href: '/courses/ecmascript/',
  },
} as const;

export type CourseId = keyof typeof courses;

export function getCourse(course: string | undefined) {
  if (!course || !(course in courses)) return undefined;

  return courses[course as CourseId];
}
