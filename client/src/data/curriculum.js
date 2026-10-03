export const curriculumModules = [
  {
    id: 'frontend',
    category: 'Frontend Engineering',
    iconName: 'Layout',
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    summary: 'Master client-side application architecture, dynamic state, component design, and responsive design systems.',
    skills: [
      'HTML5 Semantic Architecture & Accessibility (a11y)',
      'CSS3 Modern Flexbox, Grid & Custom Properties',
      'JavaScript ES6+ (Async/Await, Closures, DOM, Fetch API)',
      'React.js (Component Lifecycle, Custom Hooks, State Management)',
      'Tailwind CSS Utility-First Responsive Styling',
      'Mobile-First Responsive Web Design & Cross-Device UI'
    ],
    tools: ['React.js', 'Vite', 'Tailwind CSS', 'ESLint', 'Chrome DevTools']
  },
  {
    id: 'backend',
    category: 'Backend Architecture',
    iconName: 'Server',
    color: 'from-blue-600 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    summary: 'Build robust, secure, and production-ready server applications with industry-standard REST architectures.',
    skills: [
      'Node.js Runtime & Asynchronous Event Loop',
      'Express.js Framework & Middleware Chains',
      'RESTful API Architecture & Standard HTTP Verbs',
      'JWT Authentication & Password Security (bcrypt)',
      'Role-Based Access Control (RBAC) & Authorization',
      'Input Validation, Error Handling & API Security (CORS, Rate Limiting)'
    ],
    tools: ['Node.js', 'Express.js', 'Postman', 'JWT', 'Helmet']
  },
  {
    id: 'database',
    category: 'Database & Data Modeling',
    iconName: 'Database',
    color: 'from-cyan-600 to-teal-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    summary: 'Design relational database schemas, write optimized SQL queries, and implement complete ACID-compliant CRUD operations.',
    skills: [
      'Relational Database Modeling & Normalization (1NF, 2NF, 3NF)',
      'PostgreSQL & MySQL Relational Engines',
      'Complete CRUD Operations & Parameterized Prepared Statements',
      'Foreign Key Constraints, Cascades & Data Integrity',
      'Complex Relational Joins, Aggregations & Grouping',
      'Indexing Strategies & Query Performance Optimization'
    ],
    tools: ['PostgreSQL', 'MySQL', 'pgAdmin', 'DBeaver', 'SQL CLI']
  },
  {
    id: 'development',
    category: 'Development, Git & DevOps',
    iconName: 'Terminal',
    color: 'from-slate-700 to-slate-900',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-800',
    summary: 'Work like professional software engineering squads using industry Git workflows, full stack deployments, and CI/CD pipelines.',
    skills: [
      'Git Version Control (Branches, Commits, Merges, Rebase)',
      'GitHub Workflows, Pull Requests, Code Reviews & Issues',
      'External API Integration & Payment Gateway Setup (Cashfree)',
      'Unit & Integration Testing Principles & Debugging Workflows',
      'Environment Variable Management & Production Security',
      'Full Stack Deployment (Vercel, Render, Railway) & Live URL Verification'
    ],
    tools: ['Git', 'GitHub', 'Cashfree PG', 'Vercel', 'Render', 'CI/CD']
  }
];
