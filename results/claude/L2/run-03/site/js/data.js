/*
 * Static catalog data for the Northbridge University registration demo.
 * In a real deployment this would come from the registrar's API.
 */
window.UR_DATA = {
  terms: [
    { id: 'spring-2027', name: 'Spring 2027' },
    { id: 'summer-2027', name: 'Summer 2027' }
  ],

  departments: [
    { id: 'cs', name: 'Computer Science', color: '#4338ca' },
    { id: 'math', name: 'Mathematics', color: '#0f766e' },
    { id: 'bio', name: 'Biology', color: '#15803d' },
    { id: 'psy', name: 'Psychology', color: '#be185d' },
    { id: 'art', name: 'Art & Design', color: '#c2410c' },
    { id: 'hist', name: 'History', color: '#7e22ce' },
    { id: 'phys', name: 'Physics', color: '#1d4ed8' },
    { id: 'bus', name: 'Business', color: '#92400e' }
  ],

  // pattern: MWF | TTh | Online. Times are 24h "HH:MM".
  courses: [
    {
      id: 'CS101', dept: 'cs', number: 101, title: 'Introduction to Programming', credits: 4,
      instructor: 'Dr. Priya Natarajan', pattern: 'MWF', start: '09:00', end: '09:50',
      room: 'Turing Hall 101', capacity: 40, enrolled: 31, featured: true,
      description: 'Learn to think like a programmer. Variables, control flow, functions and problem solving with Python.'
    },
    {
      id: 'CS210', dept: 'cs', number: 210, title: 'Data Structures', credits: 4,
      instructor: 'Dr. Marcus Feld', pattern: 'TTh', start: '11:00', end: '12:15',
      room: 'Turing Hall 204', capacity: 35, enrolled: 30,
      description: 'Lists, trees, hash tables and graphs, with an emphasis on choosing the right structure for the job.'
    },
    {
      id: 'CS340', dept: 'cs', number: 340, title: 'Accessible Web Development', credits: 3,
      instructor: 'Prof. Lena Okafor', pattern: 'MWF', start: '13:00', end: '13:50',
      room: 'Turing Hall 310', capacity: 30, enrolled: 18, featured: true,
      description: 'Build inclusive, standards-based websites with HTML, CSS and JavaScript, tested with real assistive technology.'
    },
    {
      id: 'CS420', dept: 'cs', number: 420, title: 'Machine Learning', credits: 3,
      instructor: 'Dr. Marcus Feld', pattern: 'TTh', start: '16:00', end: '17:15',
      room: 'Turing Hall 120', capacity: 30, enrolled: 30,
      description: 'Supervised and unsupervised learning, model evaluation and the ethics of automated decision making.'
    },
    {
      id: 'MATH120', dept: 'math', number: 120, title: 'Calculus I', credits: 4,
      instructor: 'Dr. Hannah Cho', pattern: 'MWF', start: '10:00', end: '10:50',
      room: 'Noether Building 12', capacity: 60, enrolled: 44,
      description: 'Limits, derivatives and integrals, with applications to motion, growth and optimization.'
    },
    {
      id: 'MATH220', dept: 'math', number: 220, title: 'Linear Algebra', credits: 3,
      instructor: 'Prof. Samuel Adeyemi', pattern: 'MWF', start: '09:00', end: '09:50',
      room: 'Noether Building 30', capacity: 40, enrolled: 22,
      description: 'Vectors, matrices, eigenvalues and the geometry behind them. Essential for data science and physics.'
    },
    {
      id: 'MATH310', dept: 'math', number: 310, title: 'Probability & Statistics', credits: 3,
      instructor: 'Dr. Hannah Cho', pattern: 'TTh', start: '11:00', end: '12:15',
      room: 'Noether Building 18', capacity: 35, enrolled: 33,
      description: 'Random variables, distributions, estimation and hypothesis testing using real data sets.'
    },
    {
      id: 'BIO110', dept: 'bio', number: 110, title: 'Principles of Biology', credits: 4,
      instructor: 'Dr. Rosa Delgado', pattern: 'TTh', start: '09:30', end: '10:45',
      room: 'Carson Science 100', capacity: 80, enrolled: 52, featured: true,
      description: 'Cells, evolution, genetics and ecosystems. Includes a weekly hands-on laboratory section.'
    },
    {
      id: 'BIO305', dept: 'bio', number: 305, title: 'Genetics', credits: 3,
      instructor: 'Dr. Tomás Ibarra', pattern: 'MWF', start: '10:00', end: '10:50',
      room: 'Carson Science 215', capacity: 30, enrolled: 27,
      description: 'Mendelian and molecular genetics, gene regulation and modern genomic tools such as CRISPR.'
    },
    {
      id: 'PSY101', dept: 'psy', number: 101, title: 'Introduction to Psychology', credits: 3,
      instructor: 'Prof. Aiko Tanaka', pattern: 'MWF', start: '11:00', end: '11:50',
      room: 'James Hall 1', capacity: 120, enrolled: 98,
      description: 'A tour of the science of mind and behavior: perception, memory, development and mental health.'
    },
    {
      id: 'PSY250', dept: 'psy', number: 250, title: 'Cognitive Psychology', credits: 3,
      instructor: 'Dr. Felix Brandt', pattern: 'TTh', start: '14:30', end: '15:45',
      room: 'James Hall 22', capacity: 40, enrolled: 25,
      description: 'How people attend, remember, decide and use language, explored through classic experiments.'
    },
    {
      id: 'ART140', dept: 'art', number: 140, title: 'Foundations of Digital Design', credits: 3,
      instructor: 'Prof. Mia Kowalski', pattern: 'TTh', start: '13:00', end: '14:15',
      room: 'Kahlo Studio A', capacity: 24, enrolled: 20, featured: true,
      description: 'Color theory, layout and visual hierarchy, applied to posters, interfaces and motion graphics.'
    },
    {
      id: 'ART330', dept: 'art', number: 330, title: 'Typography', credits: 3,
      instructor: 'Prof. Mia Kowalski', pattern: 'MWF', start: '15:00', end: '15:50',
      room: 'Kahlo Studio B', capacity: 20, enrolled: 20,
      description: 'The anatomy, history and expressive use of type, from metal letterpress to variable fonts.'
    },
    {
      id: 'HIST105', dept: 'hist', number: 105, title: 'World History Since 1500', credits: 3,
      instructor: 'Dr. Kwame Mensah', pattern: 'Online', start: null, end: null,
      room: 'Online (asynchronous)', capacity: 150, enrolled: 87,
      description: 'Global connections, empires and revolutions that shaped the modern world. Fully online.'
    },
    {
      id: 'HIST280', dept: 'hist', number: 280, title: 'History of Science', credits: 3,
      instructor: 'Dr. Eleanor Whitfield', pattern: 'TTh', start: '13:00', end: '14:15',
      room: 'Bancroft Hall 9', capacity: 35, enrolled: 14,
      description: 'From astrolabes to algorithms: how scientific ideas emerged, spread and changed society.'
    },
    {
      id: 'PHYS150', dept: 'phys', number: 150, title: 'Physics I: Mechanics', credits: 4,
      instructor: 'Dr. Ivan Petrov', pattern: 'TTh', start: '09:30', end: '10:45',
      room: 'Meitner Lab 1', capacity: 60, enrolled: 41, featured: true,
      description: 'Motion, forces, energy and momentum, with weekly labs that put the equations to the test.'
    },
    {
      id: 'BUS200', dept: 'bus', number: 200, title: 'Principles of Marketing', credits: 3,
      instructor: 'Prof. Grace Lin', pattern: 'MWF', start: '14:00', end: '14:50',
      room: 'Commerce Center 140', capacity: 70, enrolled: 66,
      description: 'Customers, brands and markets. Build a full marketing plan for a real local business.'
    },
    {
      id: 'BUS360', dept: 'bus', number: 360, title: 'Entrepreneurship', credits: 3,
      instructor: 'Prof. Daniel Osei', pattern: 'Online', start: null, end: null,
      room: 'Online (asynchronous)', capacity: 50, enrolled: 29, featured: true,
      description: 'Take an idea from napkin sketch to pitch deck: customer discovery, business models and funding.'
    }
  ]
};
