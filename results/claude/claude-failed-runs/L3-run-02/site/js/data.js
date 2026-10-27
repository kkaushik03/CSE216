/* Static course data for the Northbrook University registration demo. */
window.UCR_DATA = (function () {
  'use strict';

  // Department colours are dark enough for white text (all ≥ 4.5:1).
  const DEPARTMENTS = {
    CS: { name: 'Computer Science', color: '#1d4ed8' },
    MATH: { name: 'Mathematics', color: '#7e22ce' },
    BIO: { name: 'Biology', color: '#047857' },
    ENG: { name: 'English', color: '#b91c1c' },
    ART: { name: 'Art & Design', color: '#be185d' },
    PHYS: { name: 'Physics', color: '#0e7490' },
    HIST: { name: 'History', color: '#92400e' },
    PSY: { name: 'Psychology', color: '#6d28d9' }
  };

  const COURSES = [
    { id: 'CS101', dept: 'CS', level: 100, credits: 3, title: 'Introduction to Programming', instructor: 'Dr. Maya Chen', days: ['Mon', 'Wed', 'Fri'], start: '09:00', end: '09:50', room: 'Tech Hall 101', seats: 40, enrolled: 31, description: 'Learn the fundamentals of programming with Python: variables, control flow, functions and basic data structures.' },
    { id: 'CS210', dept: 'CS', level: 200, credits: 4, title: 'Data Structures and Algorithms', instructor: 'Prof. Samuel Okafor', days: ['Tue', 'Thu'], start: '10:30', end: '12:15', room: 'Tech Hall 204', seats: 35, enrolled: 35, description: 'Lists, trees, graphs and hash tables, with analysis of algorithm efficiency and hands-on problem solving.' },
    { id: 'CS340', dept: 'CS', level: 300, credits: 3, title: 'Accessible Web Development', instructor: 'Dr. Priya Raman', days: ['Mon', 'Wed'], start: '13:00', end: '14:15', room: 'Tech Hall 310', seats: 30, enrolled: 18, description: 'Build inclusive, standards-based websites with HTML, CSS and JavaScript following WCAG guidelines.' },
    { id: 'MATH151', dept: 'MATH', level: 100, credits: 4, title: 'Calculus I', instructor: 'Dr. Elena Petrova', days: ['Mon', 'Wed', 'Fri'], start: '10:00', end: '10:50', room: 'Science Center 120', seats: 50, enrolled: 44, description: 'Limits, derivatives and integrals of single-variable functions with applications in science and engineering.' },
    { id: 'MATH220', dept: 'MATH', level: 200, credits: 3, title: 'Linear Algebra', instructor: 'Prof. David Kim', days: ['Tue', 'Thu'], start: '09:00', end: '10:15', room: 'Science Center 215', seats: 40, enrolled: 22, description: 'Vectors, matrices, linear transformations, eigenvalues and their applications to data and geometry.' },
    { id: 'BIO110', dept: 'BIO', level: 100, credits: 4, title: 'Principles of Biology', instructor: 'Dr. Aisha Bello', days: ['Tue', 'Thu'], start: '13:30', end: '15:15', room: 'Life Sciences 101', seats: 60, enrolled: 52, description: 'An introduction to cells, genetics, evolution and ecosystems, including weekly laboratory sessions.' },
    { id: 'BIO330', dept: 'BIO', level: 300, credits: 3, title: 'Marine Ecology', instructor: 'Prof. Lucas Moreau', days: ['Fri'], start: '13:00', end: '15:30', room: 'Life Sciences 230', seats: 24, enrolled: 9, description: 'Explore coastal and ocean ecosystems through field trips, data collection and research projects.' },
    { id: 'ENG110', dept: 'ENG', level: 100, credits: 3, title: 'College Writing', instructor: 'Dr. Grace Thompson', days: ['Mon', 'Wed'], start: '11:00', end: '12:15', room: 'Humanities 105', seats: 25, enrolled: 20, description: 'Develop clear, persuasive academic writing through drafting, peer review and revision.' },
    { id: 'ENG305', dept: 'ENG', level: 300, credits: 3, title: 'Contemporary World Literature', instructor: 'Prof. Hiroshi Tanaka', days: ['Tue', 'Thu'], start: '15:30', end: '16:45', room: 'Humanities 220', seats: 30, enrolled: 14, description: 'Read and discuss novels, poetry and drama from around the globe published since 1990.' },
    { id: 'ART120', dept: 'ART', level: 100, credits: 3, title: 'Foundations of Color and Design', instructor: 'Prof. Sofia Alvarez', days: ['Mon', 'Wed'], start: '14:30', end: '16:20', room: 'Arts Building 12', seats: 20, enrolled: 20, description: 'Studio course covering color theory, composition and visual communication across media.' },
    { id: 'ART250', dept: 'ART', level: 200, credits: 3, title: 'Digital Illustration', instructor: 'Prof. Noah Williams', days: ['Fri'], start: '09:00', end: '11:30', room: 'Arts Building 40', seats: 18, enrolled: 11, description: 'Create illustrations with industry-standard digital tools while building a professional portfolio.' },
    { id: 'PHYS201', dept: 'PHYS', level: 200, credits: 4, title: 'Physics I: Mechanics', instructor: 'Dr. Omar Haddad', days: ['Mon', 'Wed', 'Fri'], start: '08:00', end: '08:50', room: 'Science Center 300', seats: 45, enrolled: 30, description: 'Motion, forces, energy and momentum, with calculus-based problem solving and lab work.' },
    { id: 'HIST140', dept: 'HIST', level: 100, credits: 3, title: 'World History Since 1500', instructor: 'Dr. Rachel Adler', days: ['Tue', 'Thu'], start: '11:00', end: '12:15', room: 'Humanities 310', seats: 50, enrolled: 27, description: 'A survey of global connections, empires, revolutions and globalization over five centuries.' },
    { id: 'HIST420', dept: 'HIST', level: 400, credits: 3, title: 'Senior Seminar in Public History', instructor: 'Prof. Daniel Osei', days: ['Wed'], start: '17:00', end: '19:30', room: 'Library Seminar Room B', seats: 15, enrolled: 6, description: 'Capstone seminar on museums, archives and community history projects.' },
    { id: 'PSY100', dept: 'PSY', level: 100, credits: 3, title: 'Introduction to Psychology', instructor: 'Dr. Hannah Fischer', days: ['Mon', 'Wed', 'Fri'], start: '12:00', end: '12:50', room: 'Social Sciences 140', seats: 80, enrolled: 61, description: 'Survey of human behavior and mental processes, including learning, memory, emotion and development.' },
    { id: 'PSY410', dept: 'PSY', level: 400, credits: 3, title: 'Cognitive Neuroscience', instructor: 'Prof. Carlos Mendes', days: ['Tue', 'Thu'], start: '14:00', end: '15:15', room: 'Social Sciences 260', seats: 25, enrolled: 21, description: 'How brain systems support perception, attention, memory and decision making.' }
  ];

  return {
    DEPARTMENTS,
    COURSES,
    TERM: 'Spring 2027',
    MAX_CREDITS: 18
  };
})();
