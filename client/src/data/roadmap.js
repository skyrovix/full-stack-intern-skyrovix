export const roadmapData = [
  {
    month: 1,
    title: 'Frontend Foundations, Responsive UI & React Engineering',
    tag: 'MONTH 1 • FOUNDATION (PROJECTS 01–15)',
    projectCount: '15 Projects',
    gradient: 'from-sky-500 to-blue-600',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-300',
    accentText: 'text-sky-700',
    weeks: [
      {
        weekNumber: 1,
        title: 'Semantic HTML5, Modern CSS3 & Vanilla JavaScript Logic',
        topics: [
          'Semantic HTML elements and document outline',
          'Flexbox, CSS Grid and responsive layout breakpoints',
          'JavaScript functions, operators, and DOM event handling',
          'Browser LocalStorage API for offline persistence'
        ],
        projects: [
          '01. Personal Portfolio Website',
          '02. Responsive Landing Page',
          '03. To-Do List Application',
          '04. Calculator Web App'
        ]
      },
      {
        weekNumber: 2,
        title: 'Asynchronous JavaScript, REST APIs & Data Visualization',
        topics: [
          'Fetch API, async/await, and JSON data parsing',
          'Error boundaries and network loading/empty states',
          'Chart.js data visualizers and state persistence',
          'Dynamic timers and score evaluation state machines'
        ],
        projects: [
          '05. Weather Dashboard',
          '06. Expense Tracker',
          '07. Quiz Application',
          '08. Notes Management App'
        ]
      },
      {
        weekNumber: 3,
        title: 'React Fundamentals, Component Architecture & Hooks',
        topics: [
          'Vite build tooling and React JSX fundamentals',
          'Props, state, and unidirectional data flow',
          'useState, useEffect, and controlled form inputs',
          'Derived state and real-time financial chart rendering'
        ],
        projects: [
          '09. Recipe Finder',
          '10. Movie Explorer',
          '11. React To-Do App',
          '12. React Expense Dashboard'
        ]
      },
      {
        weekNumber: 4,
        title: 'React Router, Modern Tailwind CSS & Enterprise Dashboards',
        topics: [
          'Client-side SPA routing with React Router DOM',
          'E-Commerce cart state orchestration and filtering',
          'Protected route guards and auth UI state machines',
          'Admin dashboard tables, responsive sidebars and KPIs'
        ],
        projects: [
          '13. React E-Commerce UI',
          '14. React Authentication UI',
          '15. React Admin Dashboard'
        ]
      }
    ],
    milestone: 'Deliver a functional frontend developer portfolio and 15 working web applications pushed to GitHub.'
  },
  {
    month: 2,
    title: 'Backend Architecture, SQL/NoSQL Databases & Full Stack Systems',
    tag: 'MONTH 2 • FULL STACK (PROJECTS 16–35)',
    projectCount: '20 Projects',
    gradient: 'from-blue-600 to-indigo-600',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-300',
    accentText: 'text-blue-700',
    weeks: [
      {
        weekNumber: 5,
        title: 'Node.js, Express.js REST APIs & Middleware',
        topics: [
          'Node.js HTTP runtime and Express controller architecture',
          'Middleware pipelines, status codes, and error handlers',
          'MongoDB & Mongoose schemas and data validation',
          'Multipart file uploads with Multer and secure file storage'
        ],
        projects: [
          '16. Node.js REST API',
          '17. User Management API',
          '18. Authentication API',
          '19. File Upload API',
          '20. Contact Management API'
        ]
      },
      {
        weekNumber: 6,
        title: 'Relational SQL, ORMs & Full-Stack Core Apps',
        topics: [
          'MySQL relational schema design, joins, and connection pooling',
          'PostgreSQL schema migrations with Prisma ORM',
          'NoSQL queries, indexes, and document aggregation',
          'React frontend integration with authenticated Node/Express APIs'
        ],
        projects: [
          '21. MySQL User Database',
          '22. PostgreSQL Task Manager',
          '23. MongoDB Product API',
          '24. Full-Stack Blog',
          '25. Full-Stack Notes App'
        ]
      },
      {
        weekNumber: 7,
        title: 'Enterprise Business Platforms & Relational Data Modeling',
        topics: [
          'Role-Based Access Control (RBAC) and department hierarchies',
          'Inventory transaction audit trails and reorder alerts',
          'Shopping cart, orders, and payment sandbox integration',
          'Multi-role job candidate and recruiter application workflows'
        ],
        projects: [
          '26. Student Management System',
          '27. Employee Management System',
          '28. Inventory Management System',
          '29. E-Commerce Store',
          '30. Job Portal'
        ]
      },
      {
        weekNumber: 8,
        title: 'Complex Full-Stack Portals, Schedules & Event Platforms',
        topics: [
          'Course lesson progress tracking and enrollment state',
          'Internship mentor evaluation boards and certificates',
          'Doctor appointment slot scheduling and booking locks',
          'Restaurant live order statuses and QR code check-ins'
        ],
        projects: [
          '31. Learning Management System',
          '32. Internship Management Portal',
          '33. Hospital Appointment System',
          '34. Restaurant Ordering System',
          '35. Event Management Platform'
        ]
      }
    ],
    milestone: 'Build and deploy 20 complete full-stack web applications with relational databases, REST APIs, and role-based security.'
  },
  {
    month: 3,
    title: 'Real-Time Systems, Full Stack DevOps, CI/CD & Production Capstone',
    tag: 'MONTH 3 • ADVANCED & PRODUCTION (PROJECTS 36–50)',
    projectCount: '15 Projects',
    gradient: 'from-cyan-600 to-slate-900',
    accentBg: 'bg-slate-50',
    accentBorder: 'border-slate-300',
    accentText: 'text-slate-800',
    weeks: [
      {
        weekNumber: 9,
        title: 'WebSockets, Real-Time Sync & Storage',
        topics: [
          'Socket.IO rooms, broadcast, presence, and chat persistence',
          'Real-time collaborative drag-and-drop Kanban workspace',
          'Payment gateway sandbox order creation & webhook verification',
          'AWS S3-compatible file uploads with signed private URLs',
          'SaaS subscription tiering and billing lifecycle models'
        ],
        projects: [
          '36. Real-Time Chat Application',
          '37. Real-Time Collaboration Board',
          '38. Payment-Enabled E-Commerce',
          '39. Full Stack File Storage App',
          '40. SaaS Subscription Dashboard'
        ]
      },
      {
        weekNumber: 10,
        title: 'Microservices, Advanced RBAC, CI/CD & Full Stack Architecture',
        topics: [
          'API Gateway pattern and inter-service messaging with Redis',
          'Fine-grained permissions policy middleware and audit logging',
          'GitHub Actions automated lint, test, build, and deploy pipelines',
          'Vercel, Render, Railway, PostgreSQL and CDN setup'
        ],
        projects: [
          '41. Microservices E-Commerce Platform',
          '42. Advanced RBAC Admin System',
          '43. DevOps CI/CD Full-Stack App',
          '44. Full Stack Production Deployment'
        ]
      },
      {
        weekNumber: 11,
        title: 'Docker Containers, Observability, AI & Social Media Scale',
        topics: [
          'Multi-container orchestration with Docker Compose & Nginx reverse proxy',
          'Prometheus metrics scraper and Grafana monitoring dashboards',
          'LLM prompt engineering, streaming responses, and token rate limits',
          'High-throughput social media feeds, relationships, and Redis caching'
        ],
        projects: [
          '45. Dockerized Full-Stack Application',
          '46. Monitoring & Logging Platform',
          '47. AI-Powered Full-Stack Assistant',
          '48. Scalable Social Media Platform'
        ]
      },
      {
        weekNumber: 12,
        title: 'Full-Stack Project Management SaaS & Final Production Capstone',
        topics: [
          'Multi-tenant workspace collaboration with audit logs',
          'Enterprise full-stack architecture and production security audits',
          'Automated CI/CD deployment to live domain with SSL',
          'Comprehensive GitHub README, API docs, Postman collections and final presentation'
        ],
        projects: [
          '49. Full-Stack Project Management SaaS',
          '50. Capstone: Production-Ready Full-Stack Platform'
        ]
      }
    ],
    milestone: 'Deliver 15 advanced production and full stack systems, culminating in Project 50: Capstone Production-Ready Platform.'
  }
];
