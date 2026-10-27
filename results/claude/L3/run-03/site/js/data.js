/* Course catalog data for the Northfield University registration demo. */
'use strict';

const DEPARTMENTS = {
  CS: { name: 'Computer Science', color: 'cs' },
  MATH: { name: 'Mathematics', color: 'math' },
  BIO: { name: 'Biology', color: 'bio' },
  HIST: { name: 'History', color: 'hist' },
  ENGL: { name: 'English', color: 'engl' },
  PHYS: { name: 'Physics', color: 'phys' }
};

const TERMS = ['Spring 2027', 'Summer 2027'];

const MAX_CREDITS = 18;

const COURSES = [
  {
    id: 'CS101', code: 'CS 101', title: 'Introduction to Programming', dept: 'CS', level: 100, credits: 3,
    instructor: 'Dr. Amara Okafor', days: ['Mon', 'Wed', 'Fri'], start: '09:00', end: '09:50',
    seats: 40, enrolled: 31,
    description: 'Learn the fundamentals of programming with Python: variables, control flow, functions, and problem solving.'
  },
  {
    id: 'CS201', code: 'CS 201', title: 'Data Structures', dept: 'CS', level: 200, credits: 4,
    instructor: 'Prof. Daniel Kim', days: ['Tue', 'Thu'], start: '10:00', end: '11:50',
    seats: 35, enrolled: 35,
    description: 'Lists, stacks, queues, trees, hash tables, and graphs, with analysis of algorithm efficiency.'
  },
  {
    id: 'CS310', code: 'CS 310', title: 'Accessible Web Development', dept: 'CS', level: 300, credits: 3,
    instructor: 'Dr. Priya Nair', days: ['Mon', 'Wed'], start: '13:00', end: '14:15',
    seats: 30, enrolled: 18,
    description: 'Build inclusive, standards-based web applications using HTML, CSS, JavaScript, and WCAG guidelines.'
  },
  {
    id: 'CS420', code: 'CS 420', title: 'Machine Learning', dept: 'CS', level: 400, credits: 4,
    instructor: 'Prof. Elena Rossi', days: ['Tue', 'Thu'], start: '14:00', end: '15:50',
    seats: 25, enrolled: 21,
    description: 'Supervised and unsupervised learning, model evaluation, and the ethics of data-driven systems.'
  },
  {
    id: 'MATH120', code: 'MATH 120', title: 'Calculus I', dept: 'MATH', level: 100, credits: 4,
    instructor: 'Dr. Samuel Mensah', days: ['Mon', 'Wed', 'Fri'], start: '10:00', end: '10:50',
    seats: 60, enrolled: 44,
    description: 'Limits, derivatives, and integrals of single-variable functions with real-world applications.'
  },
  {
    id: 'MATH220', code: 'MATH 220', title: 'Linear Algebra', dept: 'MATH', level: 200, credits: 3,
    instructor: 'Prof. Hana Sato', days: ['Tue', 'Thu'], start: '09:00', end: '10:15',
    seats: 40, enrolled: 29,
    description: 'Vectors, matrices, linear transformations, eigenvalues, and their applications.'
  },
  {
    id: 'MATH330', code: 'MATH 330', title: 'Probability and Statistics', dept: 'MATH', level: 300, credits: 3,
    instructor: 'Dr. Lucas Moreau', days: ['Mon', 'Wed'], start: '14:30', end: '15:45',
    seats: 35, enrolled: 33,
    description: 'Random variables, distributions, estimation, and hypothesis testing.'
  },
  {
    id: 'BIO110', code: 'BIO 110', title: 'Cell Biology', dept: 'BIO', level: 100, credits: 4,
    instructor: 'Dr. Fatima Haddad', days: ['Tue', 'Thu'], start: '08:00', end: '09:50',
    seats: 48, enrolled: 40,
    description: 'Structure and function of cells, including a weekly hands-on laboratory component.'
  },
  {
    id: 'BIO240', code: 'BIO 240', title: 'Genetics', dept: 'BIO', level: 200, credits: 3,
    instructor: 'Prof. Marcus Lee', days: ['Mon', 'Wed', 'Fri'], start: '11:00', end: '11:50',
    seats: 36, enrolled: 22,
    description: 'Principles of heredity, gene expression, and modern genomic techniques.'
  },
  {
    id: 'BIO350', code: 'BIO 350', title: 'Ecology and Conservation', dept: 'BIO', level: 300, credits: 3,
    instructor: 'Dr. Ana Souza', days: ['Fri'], start: '13:00', end: '15:50',
    seats: 24, enrolled: 12,
    description: 'Population dynamics, ecosystems, and strategies for protecting biodiversity, with field trips.'
  },
  {
    id: 'HIST105', code: 'HIST 105', title: 'World History Since 1500', dept: 'HIST', level: 100, credits: 3,
    instructor: 'Prof. Grace Adeyemi', days: ['Tue', 'Thu'], start: '12:30', end: '13:45',
    seats: 80, enrolled: 52,
    description: 'Global connections, empires, revolutions, and the making of the modern world.'
  },
  {
    id: 'HIST230', code: 'HIST 230', title: 'Modern Europe', dept: 'HIST', level: 200, credits: 3,
    instructor: 'Dr. Tomas Novak', days: ['Mon', 'Wed'], start: '09:00', end: '10:15',
    seats: 40, enrolled: 26,
    description: 'European politics, society, and culture from the French Revolution to the present.'
  },
  {
    id: 'HIST410', code: 'HIST 410', title: 'History of Science', dept: 'HIST', level: 400, credits: 3,
    instructor: 'Prof. Leila Karimi', days: ['Thu'], start: '15:00', end: '17:50',
    seats: 18, enrolled: 18,
    description: 'A research seminar on how scientific ideas and institutions have shaped society.'
  },
  {
    id: 'ENGL101', code: 'ENGL 101', title: 'Academic Writing', dept: 'ENGL', level: 100, credits: 3,
    instructor: 'Dr. Rachel Green', days: ['Mon', 'Wed', 'Fri'], start: '12:00', end: '12:50',
    seats: 25, enrolled: 19,
    description: 'Develop clear, persuasive writing and research skills for university-level work.'
  },
  {
    id: 'ENGL260', code: 'ENGL 260', title: 'Creative Writing Workshop', dept: 'ENGL', level: 200, credits: 3,
    instructor: 'Prof. Omar Farouk', days: ['Tue'], start: '16:00', end: '18:50',
    seats: 15, enrolled: 11,
    description: 'Write and workshop fiction and poetry in a supportive small-group setting.'
  },
  {
    id: 'ENGL340', code: 'ENGL 340', title: 'Shakespeare', dept: 'ENGL', level: 300, credits: 3,
    instructor: 'Dr. Helen Brooks', days: ['Mon', 'Wed'], start: '15:00', end: '16:15',
    seats: 30, enrolled: 14,
    description: 'Close reading of the major comedies, histories, and tragedies in performance context.'
  },
  {
    id: 'PHYS150', code: 'PHYS 150', title: 'Mechanics', dept: 'PHYS', level: 100, credits: 4,
    instructor: 'Dr. Ivan Petrov', days: ['Mon', 'Wed', 'Fri'], start: '08:00', end: '08:50',
    seats: 50, enrolled: 38,
    description: 'Motion, forces, energy, and momentum, with a weekly laboratory session.'
  },
  {
    id: 'PHYS250', code: 'PHYS 250', title: 'Electricity and Magnetism', dept: 'PHYS', level: 200, credits: 4,
    instructor: 'Prof. Mei Chen', days: ['Tue', 'Thu'], start: '10:30', end: '11:45',
    seats: 40, enrolled: 27,
    description: 'Electric fields, circuits, magnetism, and electromagnetic waves.'
  }
];
