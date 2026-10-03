export const projectCategories = [
  { id: 'all', label: 'All Projects (50)' },
  { id: 'month1', label: 'Month 1: Foundation (01–15)' },
  { id: 'month2', label: 'Month 2: Full Stack (16–35)' },
  { id: 'month3', label: 'Month 3: Advanced Full Stack (36–50)' },
  { id: 'capstone', label: 'Project 50: Capstone' }
];

export const coreStackCategories = [
  { area: 'Frontend', stack: 'HTML5, CSS3, JavaScript (ES6+), React, Vite, React Router, Tailwind CSS, responsive UI' },
  { area: 'Backend', stack: 'Node.js, Express.js, REST APIs, middleware, validation, error handling' },
  { area: 'Databases', stack: 'SQL fundamentals, MySQL, PostgreSQL, MongoDB, Prisma/Mongoose' },
  { area: 'Authentication', stack: 'bcrypt, JWT, cookies/session concepts, RBAC, protected routes' },
  { area: 'API & Testing', stack: 'Postman/Thunder Client, REST conventions, basic unit/integration testing' },
  { area: 'Deployment', stack: 'Vercel, Render/Railway-style deployment, environment variables, custom domains' },
  { area: 'Full Stack Deployment', stack: 'Vercel, Render, Railway, PostgreSQL, AWS S3, CloudFront' },
  { area: 'DevOps', stack: 'Git/GitHub, GitHub Actions, Docker, Docker Compose, Nginx' },
  { area: 'Advanced', stack: 'Redis, Socket.IO, Prometheus, Grafana, AI API/Ollama, payment sandbox' },
  { area: 'Engineering', stack: 'Clean folder structure, reusable components, security basics, documentation, debugging' }
];

export const standardProjectFolderStructure = `project-root/
  frontend/        → React UI, components, pages, hooks, services
  backend/         → routes, controllers, middleware, models, services
  database/        → schema, migrations, seed data
  tests/           → unit/API/integration tests
  docs/            → API notes, architecture and screenshots
  .env.example     → variable names only; no secrets
  README.md        → setup, features, stack and deployment
  .gitignore       → node_modules, .env, build files`;

export const allProjects = [
  // ==========================================
  // MONTH 1: FOUNDATION (PROJECTS 01 - 15)
  // ==========================================
  {
    id: 'proj-01',
    num: '01',
    title: 'Personal Portfolio Website',
    difficulty: 'Beginner',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'GitHub', 'Vercel'],
    whatToLearn: 'Semantic HTML, Flexbox/Grid, responsive design, DOM basics',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Responsive portfolio with About, Skills, Projects and Contact sections.',
    dueDate: 'Week 1'
  },
  {
    id: 'proj-02',
    num: '02',
    title: 'Responsive Landing Page',
    difficulty: 'Beginner',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'GitHub', 'Vercel'],
    whatToLearn: 'UI layout, responsive breakpoints, reusable sections, CTA design',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Modern responsive landing page deployed online.',
    dueDate: 'Week 1'
  },
  {
    id: 'proj-03',
    num: '03',
    title: 'To-Do List Application',
    difficulty: 'Beginner',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage', 'GitHub', 'Vercel'],
    whatToLearn: 'DOM manipulation, events, CRUD logic, browser storage',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Persistent task manager with add/edit/delete/filter.',
    dueDate: 'Week 1'
  },
  {
    id: 'proj-04',
    num: '04',
    title: 'Calculator Web App',
    difficulty: 'Beginner',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'GitHub', 'Vercel'],
    whatToLearn: 'Functions, operators, event handling, validation',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Functional calculator with keyboard support and error handling.',
    dueDate: 'Week 2'
  },
  {
    id: 'proj-05',
    num: '05',
    title: 'Weather Dashboard',
    difficulty: 'Beginner+',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Fetch API', 'Weather API', 'Vercel'],
    whatToLearn: 'REST API calls, async/await, JSON, loading/error states',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Searchable weather dashboard using live API data.',
    dueDate: 'Week 2'
  },
  {
    id: 'proj-06',
    num: '06',
    title: 'Expense Tracker',
    difficulty: 'Beginner+',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage', 'Chart.js', 'Vercel'],
    whatToLearn: 'Forms, arrays/objects, totals, charts, persistence',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Expense/income tracker with category summaries and charts.',
    dueDate: 'Week 2'
  },
  {
    id: 'proj-07',
    num: '07',
    title: 'Quiz Application',
    difficulty: 'Beginner+',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'JSON', 'LocalStorage'],
    whatToLearn: 'Timers, state logic, scoring, question rendering',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Timed quiz with score and result screen.',
    dueDate: 'Week 2'
  },
  {
    id: 'proj-08',
    num: '08',
    title: 'Notes Management App',
    difficulty: 'Beginner+',
    month: 'Month 1',
    category: 'month1',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage', 'Vercel'],
    whatToLearn: 'CRUD, search, tags, reusable UI patterns',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Searchable notes application with persistent storage.',
    dueDate: 'Week 3'
  },
  {
    id: 'proj-09',
    num: '09',
    title: 'Recipe Finder',
    difficulty: 'Intermediate Frontend',
    month: 'Month 1',
    category: 'month1',
    tech: ['React', 'JavaScript', 'REST API', 'CSS', 'Vercel'],
    whatToLearn: 'Components, props/state, API integration, filtering',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Recipe search app with details and favorites.',
    dueDate: 'Week 3'
  },
  {
    id: 'proj-10',
    num: '10',
    title: 'Movie Explorer',
    difficulty: 'Intermediate Frontend',
    month: 'Month 1',
    category: 'month1',
    tech: ['React', 'REST API', 'JavaScript', 'CSS', 'Vercel'],
    whatToLearn: 'Reusable components, pagination, routing, API states',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Movie discovery application with search and details.',
    dueDate: 'Week 3'
  },
  {
    id: 'proj-11',
    num: '11',
    title: 'React To-Do App',
    difficulty: 'Intermediate',
    month: 'Month 1',
    category: 'month1',
    tech: ['React', 'Vite', 'JavaScript', 'CSS', 'GitHub', 'Vercel'],
    whatToLearn: 'Components, props, state, hooks, controlled forms',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Component-based task manager.',
    dueDate: 'Week 4'
  },
  {
    id: 'proj-12',
    num: '12',
    title: 'React Expense Dashboard',
    difficulty: 'Intermediate',
    month: 'Month 1',
    category: 'month1',
    tech: ['React', 'Vite', 'Chart.js/Recharts', 'JavaScript', 'CSS'],
    whatToLearn: 'Hooks, derived state, charts, filtering',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Responsive financial dashboard.',
    dueDate: 'Week 4'
  },
  {
    id: 'proj-13',
    num: '13',
    title: 'React E-Commerce UI',
    difficulty: 'Intermediate',
    month: 'Month 1',
    category: 'month1',
    tech: ['React', 'Vite', 'React Router', 'CSS/Tailwind', 'Fake Store API'],
    whatToLearn: 'Product components, cart state, routing, filtering',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Complete e-commerce frontend ready for backend integration.',
    dueDate: 'Week 4'
  },
  {
    id: 'proj-14',
    num: '14',
    title: 'React Authentication UI',
    difficulty: 'Intermediate',
    month: 'Month 1',
    category: 'month1',
    tech: ['React', 'React Router', 'JavaScript', 'CSS/Tailwind'],
    whatToLearn: 'Form validation, protected routes, auth UI states',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Production-style login, registration and reset screens.',
    dueDate: 'Week 4'
  },
  {
    id: 'proj-15',
    num: '15',
    title: 'React Admin Dashboard',
    difficulty: 'Intermediate',
    month: 'Month 1',
    category: 'month1',
    tech: ['React', 'Vite', 'React Router', 'Recharts', 'Tailwind CSS'],
    whatToLearn: 'Dashboard architecture, tables, charts, responsive sidebar',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Reusable admin dashboard UI.',
    dueDate: 'Week 4'
  },

  // ==========================================
  // MONTH 2: FULL STACK (PROJECTS 16 - 35)
  // ==========================================
  {
    id: 'proj-16',
    num: '16',
    title: 'Node.js REST API',
    difficulty: 'Intermediate Backend',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'JavaScript', 'Postman', 'GitHub'],
    whatToLearn: 'HTTP, routing, controllers, middleware, status codes',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Structured REST API tested with Postman.',
    dueDate: 'Week 5'
  },
  {
    id: 'proj-17',
    num: '17',
    title: 'User Management API',
    difficulty: 'Intermediate Backend',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Postman'],
    whatToLearn: 'CRUD, validation, pagination, error middleware',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Documented user CRUD API.',
    dueDate: 'Week 5'
  },
  {
    id: 'proj-18',
    num: '18',
    title: 'Authentication API',
    difficulty: 'Intermediate Backend',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'bcrypt', 'JWT'],
    whatToLearn: 'Password hashing, JWT, middleware, authorization',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Secure login/register API with protected routes.',
    dueDate: 'Week 6'
  },
  {
    id: 'proj-19',
    num: '19',
    title: 'File Upload API',
    difficulty: 'Intermediate Backend',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'Multer', 'MongoDB', 'Cloudinary/S3-compatible storage'],
    whatToLearn: 'Multipart uploads, file validation, metadata',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'File upload/download management API.',
    dueDate: 'Week 6'
  },
  {
    id: 'proj-20',
    num: '20',
    title: 'Contact Management API',
    difficulty: 'Intermediate Backend',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Postman'],
    whatToLearn: 'Search, pagination, validation, REST conventions',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Reusable contact-management backend.',
    dueDate: 'Week 6'
  },
  {
    id: 'proj-21',
    num: '21',
    title: 'MySQL User Database',
    difficulty: 'Full Stack Foundations',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'MySQL', 'mysql2', 'Postman'],
    whatToLearn: 'Relational schema, SQL CRUD, joins, indexes, connection pooling',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Database-backed user API.',
    dueDate: 'Week 7'
  },
  {
    id: 'proj-22',
    num: '22',
    title: 'PostgreSQL Task Manager',
    difficulty: 'Full Stack Foundations',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'Postman'],
    whatToLearn: 'Relations, migrations, transactions, ORM workflows',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Task API with relational database.',
    dueDate: 'Week 7'
  },
  {
    id: 'proj-23',
    num: '23',
    title: 'MongoDB Product API',
    difficulty: 'Full Stack Foundations',
    month: 'Month 2',
    category: 'month2',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    whatToLearn: 'NoSQL modeling, queries, indexes, validation',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Production-style product service.',
    dueDate: 'Week 7'
  },
  {
    id: 'proj-24',
    num: '24',
    title: 'Full-Stack Blog',
    difficulty: 'Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Vite', 'Node.js', 'Express.js', 'PostgreSQL/Prisma', 'JWT', 'Vercel/Render'],
    whatToLearn: 'Frontend/backend integration, CRUD, authentication, deployment',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Multi-user blog with admin/editor workflow.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-25',
    num: '25',
    title: 'Full-Stack Notes App',
    difficulty: 'Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Tailwind', 'Vercel/Render'],
    whatToLearn: 'Authenticated CRUD, search, ownership, API integration',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Secure multi-user full stack notes platform.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-26',
    num: '26',
    title: 'Student Management System',
    difficulty: 'Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'MySQL', 'Prisma/SQL', 'JWT'],
    whatToLearn: 'CRUD, search/filter, admin workflows, relational modeling',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Database-driven student management system.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-27',
    num: '27',
    title: 'Employee Management System',
    difficulty: 'Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT'],
    whatToLearn: 'Roles, departments, CRUD, dashboard design',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Employee administration platform.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-28',
    num: '28',
    title: 'Inventory Management System',
    difficulty: 'Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL/MySQL', 'Prisma', 'Recharts'],
    whatToLearn: 'Stock transactions, alerts, reports, validation',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Business-oriented inventory platform.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-29',
    num: '29',
    title: 'E-Commerce Store',
    difficulty: 'Advanced Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'Cloudinary', 'Payment Sandbox'],
    whatToLearn: 'Cart, orders, authentication, product/admin workflows',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'End-to-end e-commerce application.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-30',
    num: '30',
    title: 'Job Portal',
    difficulty: 'Advanced Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'Cloudinary'],
    whatToLearn: 'Multi-role auth, job search, applications, profiles',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Candidate/recruiter job platform.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-31',
    num: '31',
    title: 'Learning Management System',
    difficulty: 'Advanced Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'Cloudinary'],
    whatToLearn: 'Courses, lessons, enrollment, progress tracking, roles',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Online learning management platform.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-32',
    num: '32',
    title: 'Internship Management Portal',
    difficulty: 'Advanced Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'Cloudinary'],
    whatToLearn: 'Applications, tasks, mentor/admin roles, certificates',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Realistic internship-management platform.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-33',
    num: '33',
    title: 'Hospital Appointment System',
    difficulty: 'Advanced Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT'],
    whatToLearn: 'Doctor schedules, appointments, role-based access, validation',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Appointment and administration system.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-34',
    num: '34',
    title: 'Restaurant Ordering System',
    difficulty: 'Advanced Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT'],
    whatToLearn: 'Menu, cart, orders, status workflow, admin panel',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Online ordering platform.',
    dueDate: 'Week 8'
  },
  {
    id: 'proj-35',
    num: '35',
    title: 'Event Management Platform',
    difficulty: 'Advanced Full Stack',
    month: 'Month 2',
    category: 'month2',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'QR Code Library'],
    whatToLearn: 'Events, registration, attendee management, QR check-in',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Event registration and management platform.',
    dueDate: 'Week 8'
  },

  // ==========================================
  // MONTH 3: ADVANCED & PRODUCTION (PROJECTS 36 - 50)
  // ==========================================
  {
    id: 'proj-36',
    num: '36',
    title: 'Real-Time Chat Application',
    difficulty: 'Advanced',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'Socket.IO', 'MongoDB/PostgreSQL', 'JWT'],
    whatToLearn: 'WebSockets, rooms, presence, message persistence',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Real-time multi-user chat system.',
    dueDate: 'Week 9'
  },
  {
    id: 'proj-37',
    num: '37',
    title: 'Real-Time Collaboration Board',
    difficulty: 'Advanced',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'Socket.IO', 'PostgreSQL', 'Prisma'],
    whatToLearn: 'Drag/drop, real-time synchronization, teams, activity logs',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Collaborative Kanban/workspace application.',
    dueDate: 'Week 9'
  },
  {
    id: 'proj-38',
    num: '38',
    title: 'Payment-Enabled E-Commerce',
    difficulty: 'Advanced',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'Cashfree/Razorpay sandbox'],
    whatToLearn: 'Checkout, payment order creation, webhook verification, order state',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Secure sandbox payment workflow.',
    dueDate: 'Week 10'
  },
  {
    id: 'proj-39',
    num: '39',
    title: 'Full Stack File Storage App',
    difficulty: 'Advanced Full Stack',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'S3-compatible storage', 'JWT'],
    whatToLearn: 'File upload, metadata, access control, signed URLs, monitoring',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Working full stack storage application with documented deployment.',
    dueDate: 'Week 10'
  },
  {
    id: 'proj-40',
    num: '40',
    title: 'SaaS Subscription Dashboard',
    difficulty: 'Advanced SaaS',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'Payment Sandbox'],
    whatToLearn: 'Plans, subscriptions, billing status, role-based dashboards',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Subscription-management SaaS prototype.',
    dueDate: 'Week 10'
  },
  {
    id: 'proj-41',
    num: '41',
    title: 'Microservices E-Commerce Platform',
    difficulty: 'Expert',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'API Gateway'],
    whatToLearn: 'Service boundaries, inter-service communication, caching, failure handling',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Multi-service e-commerce architecture.',
    dueDate: 'Week 11'
  },
  {
    id: 'proj-42',
    num: '42',
    title: 'Advanced RBAC Admin System',
    difficulty: 'Expert',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'JWT', 'Redis'],
    whatToLearn: 'Fine-grained permissions, policy middleware, audit logs',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Enterprise-style authorization system.',
    dueDate: 'Week 11'
  },
  {
    id: 'proj-43',
    num: '43',
    title: 'DevOps CI/CD Full-Stack App',
    difficulty: 'Expert DevOps',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions', 'Vercel/Render/AWS'],
    whatToLearn: 'Automated test/build/deploy pipelines, secrets, environments',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'CI/CD-enabled full-stack application.',
    dueDate: 'Week 11'
  },
  {
    id: 'proj-44',
    num: '44',
    title: 'Full Stack Production Deployment',
    difficulty: 'Expert Full Stack',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'AWS EC2/S3/RDS', 'CloudFront', 'Route 53'],
    whatToLearn: 'Production architecture, HTTPS, environment variables, scaling basics',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Production full stack deployment with architecture documentation.',
    dueDate: 'Week 11'
  },
  {
    id: 'proj-45',
    num: '45',
    title: 'Dockerized Full-Stack Application',
    difficulty: 'Expert DevOps',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'Docker Compose', 'Nginx'],
    whatToLearn: 'Containers, networks, volumes, reverse proxy',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Containerized full-stack application.',
    dueDate: 'Week 12'
  },
  {
    id: 'proj-46',
    num: '46',
    title: 'Monitoring & Logging Platform',
    difficulty: 'Expert DevOps',
    month: 'Month 3',
    category: 'month3',
    tech: ['Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'Prometheus', 'Grafana', 'Structured Logging'],
    whatToLearn: 'Health checks, metrics, logs, alert concepts',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Observable application with monitoring dashboard.',
    dueDate: 'Week 12'
  },
  {
    id: 'proj-47',
    num: '47',
    title: 'AI-Powered Full-Stack Assistant',
    difficulty: 'Expert AI Full Stack',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'AI API/Ollama', 'JWT'],
    whatToLearn: 'Prompt handling, chat history, streaming concept, rate limiting',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'AI-assisted web product with persistent conversations.',
    dueDate: 'Week 12'
  },
  {
    id: 'proj-48',
    num: '48',
    title: 'Scalable Social Media Platform',
    difficulty: 'Expert',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Socket.IO', 'Cloudinary', 'JWT'],
    whatToLearn: 'Feeds, relationships, notifications, caching, media uploads',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Feature-rich social platform with scalable patterns.',
    dueDate: 'Week 12'
  },
  {
    id: 'proj-49',
    num: '49',
    title: 'Full-Stack Project Management SaaS',
    difficulty: 'Expert SaaS',
    month: 'Month 3',
    category: 'month3',
    tech: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'Redis', 'Socket.IO', 'Docker', 'JWT'],
    whatToLearn: 'Workspaces, teams, RBAC, real-time updates, audit history',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Multi-user project-management SaaS.',
    dueDate: 'Week 12'
  },
  {
    id: 'proj-50',
    num: '50',
    title: 'Capstone: Production-Ready Full-Stack Platform',
    difficulty: 'Expert Capstone',
    month: 'Month 3',
    category: 'capstone',
    tech: ['React/Next.js', 'Node.js/NestJS/Express', 'PostgreSQL', 'Redis', 'Docker', 'GitHub Actions', 'AWS/Vercel', 'S3', 'JWT', 'AI/Payment'],
    whatToLearn: 'Architecture, security, testing, CI/CD, full stack deployment, monitoring, documentation',
    projectRequirements: [
      'Create a clean responsive UI and meaningful component/file structure.',
      'Use Git and GitHub with clear commits and a project README.',
      'Validate user input and handle loading, empty and error states.',
      'Use environment variables for secrets/API keys; never commit credentials.',
      'Test the important user flows with Postman and/or browser testing.',
      'Deploy the project when the stack supports deployment and record the live URL.'
    ],
    expectedOutcome: 'Production-style capstone with live URL, GitHub, architecture, API docs, tests and final presentation.',
    dueDate: 'Final Week'
  }
];
