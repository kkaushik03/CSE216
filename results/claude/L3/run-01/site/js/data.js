/* Course catalog data for the Spring 2027 term. */
window.UCR_DATA = {
  term: 'Spring 2027',
  maxCredits: 18,
  departments: {
    CS: 'Computer Science',
    MATH: 'Mathematics',
    BIO: 'Biology',
    ART: 'Art & Design',
    HIST: 'History',
    PHYS: 'Physics',
    ENG: 'English',
    BUS: 'Business'
  },
  courses: [
    {
      id: 'CS101', dept: 'CS', number: '101', title: 'Introduction to Programming',
      credits: 4, level: 100, mode: 'In person', days: ['Mon', 'Wed', 'Fri'], start: '09:00', end: '09:50',
      instructor: 'Dr. Amara Okafor', room: 'Turing Hall 110', seats: 12, capacity: 40,
      description: 'Learn to think like a programmer using Python: variables, control flow, functions and problem solving.'
    },
    {
      id: 'CS220', dept: 'CS', number: '220', title: 'Data Structures',
      credits: 4, level: 200, mode: 'Hybrid', days: ['Tue', 'Thu'], start: '10:30', end: '11:45',
      instructor: 'Prof. Wei Chen', room: 'Turing Hall 204', seats: 5, capacity: 35,
      description: 'Lists, trees, graphs and hash tables, with an emphasis on choosing the right structure for the job.'
    },
    {
      id: 'CS340', dept: 'CS', number: '340', title: 'Human-Computer Interaction',
      credits: 3, level: 300, mode: 'In person', days: ['Mon', 'Wed'], start: '13:00', end: '14:15',
      instructor: 'Dr. Lena Fischer', room: 'Design Lab 2', seats: 0, capacity: 30,
      description: 'User research, prototyping, usability testing and inclusive, accessible interface design.'
    },
    {
      id: 'CS450', dept: 'CS', number: '450', title: 'Machine Learning',
      credits: 3, level: 400, mode: 'Online', days: ['Tue', 'Thu'], start: '15:00', end: '16:15',
      instructor: 'Dr. Rahul Mehta', room: 'Online', seats: 18, capacity: 45,
      description: 'Supervised and unsupervised learning, model evaluation and the ethics of automated decisions.'
    },
    {
      id: 'MATH120', dept: 'MATH', number: '120', title: 'Calculus I',
      credits: 4, level: 100, mode: 'In person', days: ['Mon', 'Tue', 'Wed', 'Thu'], start: '08:30', end: '09:20',
      instructor: 'Prof. Sofia Alvarez', room: 'Gauss Building 101', seats: 22, capacity: 50,
      description: 'Limits, derivatives and integrals with applications in science and engineering.'
    },
    {
      id: 'MATH210', dept: 'MATH', number: '210', title: 'Linear Algebra',
      credits: 3, level: 200, mode: 'In person', days: ['Tue', 'Thu'], start: '09:00', end: '10:15',
      instructor: 'Dr. Kwame Mensah', room: 'Gauss Building 215', seats: 9, capacity: 40,
      description: 'Vectors, matrices, linear transformations, eigenvalues and their real-world uses.'
    },
    {
      id: 'BIO110', dept: 'BIO', number: '110', title: 'Principles of Biology',
      credits: 4, level: 100, mode: 'In person', days: ['Mon', 'Wed'], start: '10:00', end: '11:15',
      instructor: 'Dr. Hannah Lee', room: 'Life Sciences 120', seats: 30, capacity: 60,
      description: 'Cells, genetics, evolution and ecosystems, with a weekly hands-on laboratory.'
    },
    {
      id: 'BIO305', dept: 'BIO', number: '305', title: 'Genetics',
      credits: 3, level: 300, mode: 'Hybrid', days: ['Wed', 'Fri'], start: '14:00', end: '15:15',
      instructor: 'Dr. Marcus Brown', room: 'Life Sciences 310', seats: 3, capacity: 28,
      description: 'Mendelian and molecular genetics, genomics and modern gene-editing techniques.'
    },
    {
      id: 'ART101', dept: 'ART', number: '101', title: 'Foundations of Drawing',
      credits: 3, level: 100, mode: 'In person', days: ['Tue', 'Thu'], start: '13:00', end: '14:15',
      instructor: 'Prof. Yuki Tanaka', room: 'Arts Studio A', seats: 6, capacity: 20,
      description: 'Observational drawing, line, value and composition using a range of traditional media.'
    },
    {
      id: 'ART250', dept: 'ART', number: '250', title: 'Digital Illustration',
      credits: 3, level: 200, mode: 'Online', days: ['Mon', 'Wed'], start: '15:30', end: '16:45',
      instructor: 'Prof. Diego Ramos', room: 'Online', seats: 11, capacity: 25,
      description: 'Create expressive illustrations with industry-standard digital tools and workflows.'
    },
    {
      id: 'HIST150', dept: 'HIST', number: '150', title: 'World History Since 1500',
      credits: 3, level: 100, mode: 'Online', days: ['Fri'], start: '10:00', end: '12:30',
      instructor: 'Dr. Grace Whitfield', room: 'Online', seats: 40, capacity: 80,
      description: 'Global connections, empires, revolutions and the making of the modern world.'
    },
    {
      id: 'HIST320', dept: 'HIST', number: '320', title: 'History of Science',
      credits: 3, level: 300, mode: 'In person', days: ['Mon', 'Wed'], start: '11:30', end: '12:45',
      instructor: 'Dr. Omar Haddad', room: 'Humanities 302', seats: 14, capacity: 30,
      description: 'How scientific ideas emerged, spread and changed societies from antiquity to today.'
    },
    {
      id: 'PHYS201', dept: 'PHYS', number: '201', title: 'Physics I: Mechanics',
      credits: 4, level: 200, mode: 'In person', days: ['Mon', 'Wed', 'Fri'], start: '11:00', end: '11:50',
      instructor: 'Dr. Ingrid Larsen', room: 'Newton Hall 140', seats: 7, capacity: 45,
      description: 'Motion, forces, energy and momentum, with calculus-based problem solving and labs.'
    },
    {
      id: 'ENG105', dept: 'ENG', number: '105', title: 'Academic Writing',
      credits: 3, level: 100, mode: 'Hybrid', days: ['Tue', 'Thu'], start: '08:00', end: '09:15',
      instructor: 'Prof. Maya Patel', room: 'Humanities 110', seats: 0, capacity: 24,
      description: 'Build clear, persuasive arguments and research-based writing for any discipline.'
    },
    {
      id: 'ENG330', dept: 'ENG', number: '330', title: 'Creative Writing Workshop',
      credits: 3, level: 300, mode: 'In person', days: ['Wed'], start: '17:00', end: '19:30',
      instructor: 'Prof. Samuel Ortiz', room: 'Humanities 220', seats: 8, capacity: 18,
      description: 'Write and workshop short fiction and poetry in a supportive, peer-review setting.'
    },
    {
      id: 'BUS200', dept: 'BUS', number: '200', title: 'Principles of Marketing',
      credits: 3, level: 200, mode: 'Online', days: ['Tue', 'Thu'], start: '12:00', end: '13:15',
      instructor: 'Dr. Chloe Martin', room: 'Online', seats: 25, capacity: 50,
      description: 'Customer insight, branding, pricing and digital campaigns for modern organizations.'
    }
  ]
};
