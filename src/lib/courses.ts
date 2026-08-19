const courses = {
  'cstrc-jp-dw': {
    title: 'Desenvolvimento Web',
    href: '/courses/cstrc-jp-dw/',
  },
} as const;

export type CourseId = keyof typeof courses;

export function getCourse(course: string | undefined) {
  if (!course || !(course in courses)) return undefined;

  return courses[course as CourseId];
}
