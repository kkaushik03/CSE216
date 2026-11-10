/* Sample course data. There is no backend; everything lives in this file. */
window.UCR_DATA = {
  university: 'Northbridge University',
  terms: ['Fall 2026', 'Spring 2027'],
  departments: [
    { id: 'cs', name: 'Computer Science' },
    { id: 'math', name: 'Mathematics' },
    { id: 'bio', name: 'Biology' },
    { id: 'hist', name: 'History' },
    { id: 'psy', name: 'Psychology' },
    { id: 'art', name: 'Art and Design' }
  ],
  courses: [
    {
      code: 'CSE 110', title: 'Introduction to Programming', dept: 'cs', level: 100, credits: 4,
      instructor: 'Dr. Amara Okafor', days: 'Mon, Wed, Fri', time: '9:00–9:50 AM', room: 'Hall B 101',
      capacity: 120, enrolled: 98,
      description: 'Learn to write clear programs in JavaScript: variables, functions, loops and simple data structures.'
    },
    {
      code: 'CSE 216', title: 'Data Structures', dept: 'cs', level: 200, credits: 4,
      instructor: 'Prof. Daniel Kim', days: 'Tue, Thu', time: '10:30–11:50 AM', room: 'Hall B 204',
      capacity: 80, enrolled: 77,
      description: 'Lists, trees, hash tables and graphs, and how to choose the right one for a problem.'
    },
    {
      code: 'CSE 340', title: 'Web Accessibility and Design', dept: 'cs', level: 300, credits: 3,
      instructor: 'Dr. Lucía Ferreira', days: 'Mon, Wed', time: '1:00–2:20 PM', room: 'Lab C 12',
      capacity: 40, enrolled: 40,
      description: 'Build inclusive websites that follow WCAG 2.2 and work with screen readers and keyboards.'
    },
    {
      code: 'CSE 452', title: 'Machine Learning', dept: 'cs', level: 400, credits: 4,
      instructor: 'Prof. Wei Zhang', days: 'Tue, Thu', time: '2:00–3:20 PM', room: 'Hall B 310',
      capacity: 60, enrolled: 41,
      description: 'Supervised and unsupervised learning, model evaluation and the ethics of automated decisions.'
    },
    {
      code: 'MATH 121', title: 'Calculus I', dept: 'math', level: 100, credits: 4,
      instructor: 'Dr. Priya Raman', days: 'Mon, Wed, Fri', time: '11:00–11:50 AM', room: 'Science 120',
      capacity: 150, enrolled: 132,
      description: 'Limits, derivatives and integrals with applications in science and engineering.'
    },
    {
      code: 'MATH 233', title: 'Linear Algebra', dept: 'math', level: 200, credits: 3,
      instructor: 'Prof. Henrik Larsen', days: 'Tue, Thu', time: '9:00–10:20 AM', room: 'Science 215',
      capacity: 70, enrolled: 70,
      description: 'Vectors, matrices, linear transformations, eigenvalues and their uses in data science.'
    },
    {
      code: 'MATH 310', title: 'Probability and Statistics', dept: 'math', level: 300, credits: 3,
      instructor: 'Dr. Grace Mensah', days: 'Mon, Wed', time: '3:00–4:20 PM', room: 'Science 302',
      capacity: 50, enrolled: 33,
      description: 'Random variables, distributions, estimation and hypothesis testing with real data sets.'
    },
    {
      code: 'BIO 101', title: 'Principles of Biology', dept: 'bio', level: 100, credits: 4,
      instructor: 'Dr. Samuel Ortiz', days: 'Tue, Thu', time: '8:00–9:20 AM', room: 'Life Sciences 1',
      capacity: 200, enrolled: 154,
      description: 'Cells, genetics, evolution and ecosystems, with a weekly hands-on lab session.'
    },
    {
      code: 'BIO 245', title: 'Genetics', dept: 'bio', level: 200, credits: 3,
      instructor: 'Prof. Hana Suzuki', days: 'Mon, Wed', time: '10:00–11:20 AM', room: 'Life Sciences 210',
      capacity: 60, enrolled: 57,
      description: 'Inheritance, DNA, gene expression and modern tools such as CRISPR.'
    },
    {
      code: 'BIO 380', title: 'Marine Ecology', dept: 'bio', level: 300, credits: 4,
      instructor: 'Dr. Noah Bennett', days: 'Fri', time: '1:00–4:50 PM', room: 'Field Station',
      capacity: 24, enrolled: 24,
      description: 'Coastal and ocean ecosystems, including field trips to the university research station.'
    },
    {
      code: 'HIST 140', title: 'World History since 1500', dept: 'hist', level: 100, credits: 3,
      instructor: 'Prof. Fatima Haddad', days: 'Mon, Wed, Fri', time: '2:00–2:50 PM', room: 'Humanities 105',
      capacity: 100, enrolled: 61,
      description: 'Global connections, empires, revolutions and the making of the modern world.'
    },
    {
      code: 'HIST 362', title: 'History of Science and Technology', dept: 'hist', level: 300, credits: 3,
      instructor: 'Dr. Oliver Grant', days: 'Tue, Thu', time: '12:30–1:50 PM', room: 'Humanities 220',
      capacity: 45, enrolled: 19,
      description: 'How inventions and ideas changed societies, from the printing press to the internet.'
    },
    {
      code: 'PSY 100', title: 'Introduction to Psychology', dept: 'psy', level: 100, credits: 3,
      instructor: 'Dr. Maya Patel', days: 'Tue, Thu', time: '3:30–4:50 PM', room: 'Social Sciences 1',
      capacity: 180, enrolled: 176,
      description: 'Perception, memory, learning, emotion and behaviour, and how psychologists study them.'
    },
    {
      code: 'PSY 420', title: 'Cognitive Neuroscience', dept: 'psy', level: 400, credits: 4,
      instructor: 'Prof. Jonas Weber', days: 'Mon, Wed', time: '9:00–10:20 AM', room: 'Social Sciences 330',
      capacity: 35, enrolled: 22,
      description: 'The brain systems behind attention, language and decision making, with lab demonstrations.'
    },
    {
      code: 'ART 150', title: 'Foundations of Visual Design', dept: 'art', level: 100, credits: 3,
      instructor: 'Prof. Isabel Moreno', days: 'Mon, Wed', time: '4:30–5:50 PM', room: 'Studio A',
      capacity: 30, enrolled: 26,
      description: 'Colour, typography, layout and composition through weekly studio projects.'
    },
    {
      code: 'ART 275', title: 'Digital Illustration', dept: 'art', level: 200, credits: 3,
      instructor: 'Dr. Kofi Asante', days: 'Fri', time: '9:00–11:50 AM', room: 'Studio D',
      capacity: 20, enrolled: 20,
      description: 'Create illustrations with digital tools, from sketch to finished, portfolio-ready piece.'
    }
  ]
};
