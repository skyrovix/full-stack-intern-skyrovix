/**
 * SKYROVIX - 3-Month Full Stack Development Internship
 * Detailed Student Guide Data: AI Tools → Code → Backend → Database → GitHub → Vercel → Domain
 * Learn • Build • Test • Deploy • Showcase
 */

export const STUDENT_GUIDE_METADATA = {
  title: 'SKYROVIX 3-Month Full Stack Development Internship',
  subtitle: 'Detailed Student Guide — AI Tools → Code → Backend → Database → GitHub → Vercel → Domain',
  motto: 'Learn • Build • Test • Deploy • Showcase',
  duration: '3 Months',
  mode: '100% Virtual / Batch-based',
  internshipFee: '₹0',
  registrationFee: '₹200 only',
  goldenRule: 'Students should be able to point to the frontend, backend, database, authentication, GitHub repository, deployment and domain for their project.',
  howToUse: 'Every module has four outcomes: understand the concept, perform a guided practical, submit evidence, and explain what you did. Students should not skip the testing and security steps.',
  journeyPillars: [
    { step: '01', name: 'IDEA', desc: 'Define problem, user personas & system requirements' },
    { step: '02', name: 'PLAN', desc: 'Architecture, schema modeling, API endpoints & milestones' },
    { step: '03', name: 'CODE', desc: 'Clean, modular UI & server logic in modern editors' },
    { step: '04', name: 'DATABASE', desc: 'Relational PostgreSQL / Supabase or NoSQL Firestore schema' },
    { step: '05', name: 'API', desc: 'RESTful routes, controllers, middleware & Postman testing' },
    { step: '06', name: 'TEST', desc: 'Manual QA, input edge cases, auth guards & error states' },
    { step: '07', name: 'GITHUB', desc: 'Disciplined commits, feature branches & public documentation' },
    { step: '08', name: 'DEPLOY', desc: 'Production deployment on Vercel with environment variables' },
    { step: '09', name: 'DOMAIN', desc: 'Custom domain purchase, DNS A/CNAME records & SSL' },
    { step: '10', name: 'LIVE APP', desc: 'Public live URL ready for employer & client showcase' },
  ]
};

export const CORE_EXAMPLE_PROJECT = {
  title: 'Student Internship Management Portal',
  summary: 'The reference full-stack system used throughout the 3 months to demonstrate complete end-to-end software engineering.',
  workflow: [
    'Student opens website and reviews program details.',
    'Student registers/logs in securely with email and password.',
    'Student fills out an internship application form with profile data.',
    'Frontend sends the data as a JSON payload to the backend API.',
    'Backend/API validates the request structure, auth tokens, and field constraints.',
    'Database stores the application with relational keys and audit timestamps.',
    'Student sees real-time application status and offer letter upon approval.',
    'Admin views applications, updates status, and issues certificates.',
    'Project source code is pushed to a structured GitHub repository.',
    'Project is deployed continuously on Vercel from Git.',
    'Custom domain points to the deployed website with automated HTTPS.'
  ]
};

export const AI_PROMPTING_FRAMEWORK = {
  formula: 'ROLE + CONTEXT + TASK + CONSTRAINTS + OUTPUT + TESTING',
  examplePrompt: {
    role: 'You are helping me as a senior full-stack mentor.',
    context: 'React + Vite + Tailwind project with Node.js Express backend.',
    task: 'Add a student registration form.',
    constraints: 'Do not change unrelated files. Keep the existing UI style. Validate required fields.',
    output: 'First give the plan, then list files to change, then implement after approval.',
    testing: 'Tell me how to test valid, invalid and duplicate submissions.'
  },
  assignment: {
    title: '5-Prompt Mastery Assignment',
    instructions: 'Students must submit 5 structured prompts: Explain, Plan, Implement, Debug, and Review. For each prompt, you must document what the AI changed and what you personally verified.',
    prompts: [
      {
        type: 'Explain',
        prompt: 'Explain this project structure. Do not change any files. Tell me the entry point, major components, API calls and database-related files.'
      },
      {
        type: 'Plan',
        prompt: 'Plan a student registration feature. Do not write code yet. List the files that need changes, data flow, validation and security considerations.'
      },
      {
        type: 'Implement',
        prompt: 'Implement only the approved registration feature. Keep the existing design. After editing, explain each changed file and run the project checks.'
      },
      {
        type: 'Debug',
        prompt: 'I am encountering an error where submitting the form returns status 400. Inspect the request payload and backend validation logic without altering unrelated routes.'
      },
      {
        type: 'Review',
        prompt: 'Review your changes for bugs, security issues, broken imports and mobile UI problems. Do not change anything until you show the issues.'
      }
    ]
  }
};

export const SUPABASE_VS_FIREBASE = [
  {
    record: 'Main database style',
    supabase: 'PostgreSQL / Relational tables, rows, foreign keys, 3NF',
    firebase: 'Firestore / Document-oriented collections and JSON objects',
    learningProject: 'Relational vs NoSQL architecture evaluation'
  },
  {
    record: 'Authentication',
    supabase: 'Supabase Auth (JWT, email/password, OAuth, magic links)',
    firebase: 'Firebase Authentication (Email/Password, Phone, Google)',
    learningProject: 'User session & token management'
  },
  {
    record: 'Access control',
    supabase: 'Postgres Row Level Security (RLS) & SQL policies',
    firebase: 'Firebase Security Rules (declarative rules syntax)',
    learningProject: 'Multi-tenant student isolation'
  },
  {
    record: 'Storage',
    supabase: 'Supabase Storage with bucket policies & public/signed URLs',
    firebase: 'Cloud Storage for Firebase with storage security rules',
    learningProject: 'Profile photo and certificate asset uploads'
  },
  {
    record: 'Student exercise',
    supabase: 'Student Management System with relational schemas',
    firebase: 'Task Management App with real-time Firestore listeners',
    learningProject: 'Capstone project backend decision'
  }
];

export const VERCEL_COMMON_ERRORS = [
  {
    error: 'Build Failed',
    location: 'Deployment build log in Vercel dashboard',
    fix: 'Find the first real error in the build output. Reproduce locally using `npm run build`, fix imports or TypeScript/ESLint errors, and git push again.'
  },
  {
    error: 'API works locally only',
    location: 'Production API URL / Environment Variables',
    fix: 'Configure production variables (e.g. `VITE_API_URL=https://api.yourdomain.com`) in Vercel Project Settings → Environment Variables, then trigger a redeploy.'
  },
  {
    error: 'Login redirect fails',
    location: 'Production URL / Auth redirect settings',
    fix: 'Add the exact production URL (including custom domain) in the Supabase or Firebase Auth authorized redirect URLs list.'
  },
  {
    error: 'CORS error',
    location: 'Backend allowed origins configuration',
    fix: 'Update backend CORS middleware to whitelist the production frontend domain (`https://yourproject.vercel.app` and `https://yourdomain.com`).'
  },
  {
    error: 'Blank page / 404 on refresh',
    location: 'Browser console + SPA routing configuration',
    fix: 'Check console for runtime errors. Add a `vercel.json` rewrites file routing `{"source": "/(.*)", "destination": "/index.html"}` for client-side routing.'
  }
];

export const DNS_RECORDS_GUIDE = [
  {
    type: 'A',
    description: 'Points a root domain name to an IPv4 address',
    example: 'example.com → 76.76.21.21 (Vercel IP)',
    purpose: 'Directs top-level apex domain traffic directly to your hosting server.'
  },
  {
    type: 'CNAME',
    description: 'Points an alias hostname to another domain name',
    example: 'www.example.com → cname.vercel-dns.com',
    purpose: 'Aliases subdomains (such as www or app) to the hosting provider hostname.'
  },
  {
    type: 'Nameserver (NS)',
    description: 'Defines which DNS provider manages the domain records',
    example: 'Registrar → Cloudflare / Vercel DNS nameservers',
    purpose: 'Delegates entire DNS resolution to an external authoritative provider.'
  }
];

export const WEEKLY_PRACTICAL_SCHEDULE = [
  {
    week: 1,
    focus: 'VS Code + AI tools + Prompting',
    output: 'AI-assisted Personal Developer Portfolio',
    evidence: 'Screenshots + GitHub Repository URL'
  },
  {
    week: 2,
    focus: 'Git/GitHub + Frontend Foundations',
    output: '2 Mini Projects (Responsive Landing Page + Calculator)',
    evidence: 'Git Commit History + README Documentation'
  },
  {
    week: 3,
    focus: 'JavaScript / React / API Basics',
    output: 'React API-driven Weather / Recipe Search Project',
    evidence: 'Live Demo URL + Local Component Code'
  },
  {
    week: 4,
    focus: 'Backend + Express + CRUD',
    output: 'Student REST API with Full CRUD Endpoints',
    evidence: 'Exported Postman Collection + Response Payloads'
  },
  {
    week: 5,
    focus: 'Database + Supabase + RLS',
    output: 'Student Management Application with Postgres RLS',
    evidence: 'DB Schema SQL + Row Level Security Policies'
  },
  {
    week: 6,
    focus: 'Firebase + Auth / Security Rules',
    output: 'Task Management App with Firestore & Rules',
    evidence: 'Firebase Security Rules File + Working Auth Demo'
  },
  {
    week: 7,
    focus: 'Full-Stack Integration',
    output: 'Connected React Frontend + Express / Supabase Backend',
    evidence: 'Public GitHub Repo + End-to-End Demo'
  },
  {
    week: 8,
    focus: 'Testing / Debugging / Security Basics',
    output: 'Bug-Fix Sprint on Edge Cases & Access Controls',
    evidence: 'Issue Resolution List + Atomic Git Commits'
  },
  {
    week: 9,
    focus: 'Vercel + Environment Variables',
    output: 'Preview & Production Cloud Deployment',
    evidence: 'Live `.vercel.app` Production URL'
  },
  {
    week: 10,
    focus: 'Domain + DNS + HTTPS',
    output: 'Custom Domain Setup with SSL Verification',
    evidence: 'DNS Zone Screenshot + Live Custom Domain URL'
  },
  {
    week: 11,
    focus: 'Final Capstone Project Build',
    output: 'Major Features of Internship Management Portal Complete',
    evidence: 'GitHub Milestone Commits + Staging Preview'
  },
  {
    week: 12,
    focus: 'Final Testing, Documentation & Showcase',
    output: 'Production-Ready Platform with Domain & Case Study',
    evidence: 'Live Domain URL + Comprehensive README + Video Presentation'
  }
];

export const DAILY_STUDENT_WORKFLOW = [
  { step: 'Learn', desc: 'Read the core concept, understand expected requirements and failure modes.' },
  { step: 'Plan', desc: 'Draft which files, API contracts, schema columns and UI states are needed.' },
  { step: 'Build', desc: 'Write clean code manually or with controlled, verified AI assistance.' },
  { step: 'Test', desc: 'Verify normal happy paths, invalid inputs, edge cases and auth rejections.' },
  { step: 'Debug', desc: 'Inspect browser console and server logs instead of blindly prompting AI to rewrite.' },
  { step: 'Commit', desc: 'Save a meaningful, atomic change using conventional commit messages.' },
  { step: 'Document', desc: 'Update README notes, API contracts, screenshots and submission records.' }
];

export const SUBMISSION_FORMAT_FIELDS = [
  'Project Name',
  'Problem Statement',
  'Features List',
  'Technology Stack',
  'AI Tools Used',
  'Important Prompts Used & Personal Verification',
  'Database Design (Schema / Tables / RLS)',
  'API Endpoints (with request/response samples)',
  'GitHub Repository URL',
  'Live Deployment URL',
  'Known Limitations & Future Improvements',
  'Screenshots & 2–5 Minute Walkthrough Video'
];

export const SECURITY_RULES_CHECKLIST = [
  'Never commit passwords, private keys, service-role keys or secret API tokens.',
  'Do not expose backend service-role or master keys in client-side code.',
  'Enforce database Row Level Security (RLS) / Firebase Security Rules instead of relying on hidden UI buttons.',
  'Sanitize and validate all user input on the server side using schemas (Zod/Joi).',
  'Protect admin routes with authenticated server middleware, not just client route guards.',
  'Always test unauthorized and expired token access scenarios.',
  'Never store or transmit unhashed passwords; use bcrypt with minimum 10 salt rounds.',
  'Audit and understand every line of AI-generated code before committing to your codebase.',
  'Use only software, assets, and data packages that you are legally licensed to utilize.'
];

export const FINAL_ASSESSMENT_CHECKPOINTS = [
  'Open the project and explain its directory architecture from root to frontend/backend.',
  'Explain precisely where frontend components, state hooks, and routing reside.',
  'Explain how the frontend communicates with the backend/database via HTTP and auth tokens.',
  'Show the database tables/collections, foreign keys, and constraint rules.',
  'Demonstrate authentication (login/logout) and authorization (role permissions).',
  'Show disciplined GitHub commit history, feature branches, and Pull Requests.',
  'Show the live cloud deployment running in production.',
  'Show environment variables configuration in hosting dashboard without exposing secrets.',
  'Explain custom domain DNS mapping (A and CNAME records) and SSL provisioning.',
  'Demonstrate a live real-world user flow: register → submit data → database persist → UI display.',
  'Identify and explain at least one real bug you encountered, diagnosed, and resolved.',
  'Explain which AI tools were used, how prompts were framed, and what you personally verified.'
];

export const OFFICIAL_DOCUMENTATION_RESOURCES = [
  { name: 'Google Antigravity', url: 'https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/', tag: 'Agentic AI Platform' },
  { name: 'Cursor Docs', url: 'https://cursor.com/docs', tag: 'AI Coding Agent' },
  { name: 'Google Cloud Code', url: 'https://docs.cloud.google.com/code/docs/vscode', tag: 'Cloud & Gemini IDE' },
  { name: 'Supabase Docs', url: 'https://supabase.com/docs/', tag: 'Postgres & Backend' },
  { name: 'Firebase Docs', url: 'https://firebase.google.com/docs', tag: 'Google App Platform' },
  { name: 'Vercel Docs', url: 'https://vercel.com/docs', tag: 'Frontend Deployment' }
];

export const GUIDE_MODULES_20 = [
  {
    moduleNumber: 1,
    part: 'PART B — AI TOOLS & CODE EDITORS',
    title: 'VS Code: The Basic Development Workspace',
    category: 'Editor & Workspace',
    whatIsIt: 'A general-purpose code editor that lets students create files, edit code, install extensions, open terminals, run commands, and debug web applications.',
    whyUseIt: 'Students need a solid standard editor first to master project directory hierarchies and CLI commands before leaning heavily on AI automation.',
    whenToUseIt: 'Manual coding, auditing AI-generated code, running terminal commands, local debugging, and understanding project file layouts.',
    setupPractice: [
      'Install Visual Studio Code on your workstation.',
      'Create a workspace folder named `skyrovix-student-portfolio`.',
      'Open the folder inside VS Code (`code .`).',
      'Create standard starter files: `index.html`, `style.css`, and `script.js`.',
      'Open the integrated terminal (`Ctrl + \`` or `Cmd + \``).',
      'Run the project locally using Live Server or `npx serve`.',
      'Use Chrome DevTools (Console, Elements, Network) to inspect DOM layout and check for console errors.'
    ],
    studentTask: 'Create a responsive personal portfolio without AI assistance for version 1.0. Include a sticky navigation bar, hero section, skills grid, projects cards, and contact form.',
    expectedLearning: 'Locate project files, edit markup/styles, operate the terminal, run local servers, and debug browser console errors.',
    badge: 'Foundational'
  },
  {
    moduleNumber: 2,
    part: 'PART B — AI TOOLS & CODE EDITORS',
    title: 'Cursor: AI Coding Agent Workflow',
    category: 'AI Coding Agent',
    whatIsIt: 'Cursor is an AI-focused coding environment. Its Agent can inspect a full codebase, plan multi-file changes, edit code, execute terminal commands, and review diffs.',
    whyUseIt: 'Teaches students how to work collaboratively with an existing codebase rather than generating fragile code from scratch.',
    correctWorkflow: 'Explain → Plan → Approve → Implement → Review diff → Test → Fix → Commit',
    promptExamples: [
      {
        title: 'Inspection Prompt',
        text: 'Explain this project structure. Do not change any files. Tell me the entry point, major components, API calls and database-related files.'
      },
      {
        title: 'Feature Planning Prompt',
        text: 'Plan a student registration feature. Do not write code yet. List the files that need changes, data flow, validation and security considerations.'
      },
      {
        title: 'Controlled Implementation Prompt',
        text: 'Implement only the approved registration feature. Keep the existing design. After editing, explain each changed file and run the project checks.'
      },
      {
        title: 'Rigorous Review Prompt',
        text: 'Review your changes for bugs, security issues, broken imports and mobile UI problems. Do not change anything until you show the issues.'
      }
    ],
    studentTask: 'Take the personal portfolio from Module 1. Ask Cursor to explain it first, then plan and improve one section (e.g. dynamic skills filter). Review the git diff, test locally, and commit.',
    importantNote: 'AI-generated code is not automatically correct. The student owns full responsibility for understanding, testing, and securing every line of code.',
    badge: 'AI Workflow'
  },
  {
    moduleNumber: 3,
    part: 'PART B — AI TOOLS & CODE EDITORS',
    title: 'Google Antigravity: Agentic Development Platform',
    category: 'Agentic Development',
    whatIsIt: 'Google describes Antigravity as an agentic development platform with an editor view and an agent-first interface where agents can plan, execute, and verify tasks across the editor, terminal, and browser.',
    whyUseIt: 'Students learn a task-oriented AI workflow for complex multi-step development, full verification, and browser test automation.',
    guidedPractical: [
      'Open a small full-stack web project in Antigravity.',
      'Ask the agent to inspect the project and explain its architecture without changing any files.',
      'Prompt the agent to formulate a detailed architectural feature plan.',
      'Review and explicitly approve a small, scoped feature.',
      'Allow the agent to implement the approved changes.',
      'Inspect changed files, git diffs, and generated artifacts/test evidence.',
      'Run the web application yourself in your own browser.',
      'Manually verify the feature, edge cases, and mobile responsive behavior.',
      'Commit to version control only after personal verification.'
    ],
    goldenPrompt: 'First inspect this project. Explain the architecture. Then create a plan for adding a contact form. Do not modify files until the plan is complete.',
    doNotTeach: 'Do not give an agent vague instructions such as "build everything" and submit unchecked outputs. Always demand plan approval, diff review, and local test validation.',
    badge: 'Agentic AI'
  },
  {
    moduleNumber: 4,
    part: 'PART B — AI TOOLS & CODE EDITORS',
    title: 'Google Cloud Code: Cloud-Oriented Development',
    category: 'Cloud Engineering',
    whatIsIt: 'Cloud Code provides IDE extensions for Google Cloud development, including Cloud Run and Kubernetes workflows, with integrated Gemini-assisted coding.',
    whyUseIt: 'Introduces students to cloud-oriented deployment paradigms, containerization, and enterprise cloud secret management.',
    whenToUseIt: 'Use after students understand local development, APIs, and deployment fundamentals. Not mandatory for static React projects, but invaluable for microservices.',
    guidedPractical: [
      'Install Google Cloud Code extension in VS Code.',
      'Sign in to the required Google Cloud account/project.',
      'Open a sample backend service or Express API.',
      'Run the service locally using Cloud Code emulator.',
      'Understand the generated launch configurations and container manifests.',
      'Differentiate between running a local Node process and a managed cloud container.',
      'Deploy a small Cloud Run service with custom environment variables.'
    ],
    referenceUrl: 'https://docs.cloud.google.com/code/docs/vscode',
    badge: 'Cloud & DevOps'
  },
  {
    moduleNumber: 5,
    part: 'PART B — AI TOOLS & CODE EDITORS',
    title: 'Lovable / AI App Builders: Rapid Prototyping',
    category: 'Rapid Prototyping',
    whatIsIt: 'Visual and prompt-driven app builders used for rapid prototyping, user interface exploration, and wireframe realization.',
    purpose: 'Rapidly explore UI layouts and interaction patterns, then inspect, export, refine, test, and version-control the resulting codebase.',
    correctLearningMethod: [
      'Start with a concise, clear product requirement specification.',
      'Generate a focused screen or feature layout.',
      'Inspect the generated component tree, tailwind utility classes, and state management.',
      'Identify which code is frontend UI, data layer, and build configuration.',
      'Export and integrate the code into your standard Git repository workflow.',
      'Test responsiveness, touch targets, and accessibility.',
      'Never treat generated applications as production-ready without code audit and security verification.'
    ],
    practicalTask: 'Generate a simple task dashboard, inspect its component tree, trace the state flow, make at least one manual code enhancement, and commit under Git version control.',
    badge: 'Prototyping'
  },
  {
    moduleNumber: 6,
    part: 'PART C — GIT & GITHUB',
    title: 'Git: Version Control Fundamentals',
    category: 'Version Control',
    whatIsIt: 'Git is a distributed version-control system that records atomic snapshots of project files over time.',
    whyUseIt: 'If an AI edit or experimental change breaks the codebase, Git allows you to inspect exact diffs and roll back safely to a known working state.',
    firstProjectWorkflow: [
      { cmd: 'git init', desc: 'Initialize Git version tracking in the project root folder.' },
      { cmd: 'git status', desc: 'Inspect changed, staged, and untracked files.' },
      { cmd: 'git add .', desc: 'Stage all modified files for the upcoming commit.' },
      { cmd: 'git commit -m "Initial portfolio commit"', desc: 'Record a version snapshot with a concise descriptive message.' },
      { cmd: 'git branch -M main', desc: 'Rename or confirm the default production branch as main.' },
      { cmd: 'git remote add origin <REPO_URL>', desc: 'Link your local repository to your remote GitHub repository.' },
      { cmd: 'git push -u origin main', desc: 'Upload local commits to GitHub and set upstream tracking.' }
    ],
    essentialCommands: [
      { cmd: 'git status', desc: 'See current branch and uncommitted modifications.' },
      { cmd: 'git pull', desc: 'Fetch and merge remote changes into the local working branch.' },
      { cmd: 'git clone <url>', desc: 'Clone an existing remote repository to a new directory.' },
      { cmd: 'git log --oneline -n 5', desc: 'Review the last 5 commit summaries in chronological order.' }
    ],
    badge: 'Core Git'
  },
  {
    moduleNumber: 7,
    part: 'PART C — GIT & GITHUB',
    title: 'GitHub Project Hygiene & Collaboration',
    category: 'GitHub Best Practices',
    whatIsIt: 'Professional engineering standards for organizing public repositories, writing documentation, and protecting security.',
    hygieneChecklist: [
      'Descriptive repository naming (e.g. `skyrovix-internship-portal`, not `test123`).',
      'README.md containing project purpose, features, tech stack, local setup steps, and live URL.',
      '.gitignore configured to exclude `node_modules`, `.env`, build outputs (`dist/`, `build/`), and OS files.',
      'Conventional Commit messages (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).',
      'ZERO SECRET LEAKS: Never commit passwords, private keys, service-role keys, or JWT secrets.',
      'Feature Branching: Create branches (`feature/user-auth`) for non-trivial additions.',
      'Pull Requests (PR): Open PRs with screenshots and review diffs before merging into `main`.'
    ],
    studentTask: 'Maintain a clean GitHub repository for each mini-project. For at least one project, create a feature branch, submit commits, open a Pull Request, and review before merging into `main`.',
    badge: 'Collaboration'
  },
  {
    moduleNumber: 8,
    part: 'PART D — FRONTEND',
    title: 'Frontend Foundations: HTML, CSS, JavaScript, React & Tailwind',
    category: 'Frontend Engineering',
    whatIsIt: 'Client-side technologies that build responsive, interactive user experiences in the browser.',
    coreConcepts: [
      'HTML: Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) and accessibility.',
      'CSS: Modern Flexbox, CSS Grid layouts, spacing scales, and responsive media queries.',
      'JavaScript: ES6+ syntax, closures, array methods (`map`, `filter`, `reduce`), async/await, DOM events.',
      'React: Component composition, props, `useState`, `useEffect`, controlled form inputs, and client routing.',
      'Tailwind CSS: Utility-first styling for high-velocity, consistent responsive design.',
      'Form Validation: Controlled inputs, touched states, regex validation, and error alert banners.',
      'Browser DevTools: Console logs, Network tab payloads, DOM Elements, and LocalStorage inspection.'
    ],
    practiceProgression: [
      '1. Responsive Developer Portfolio Landing Page',
      '2. Calculator Web Application with keyboard event listeners',
      '3. To-Do List Application with LocalStorage persistence',
      '4. Weather / Food Recipe Search App consuming public REST APIs',
      '5. React Interactive Dashboard with filter tabs and charts',
      '6. Full Student Registration Form with controlled inputs and validation'
    ],
    successCondition: 'The student can clearly identify which code defines structure (HTML/JSX), which handles logic/state (JS/React), and where network API calls execute.',
    badge: 'Frontend Core'
  },
  {
    moduleNumber: 9,
    part: 'PART E — BACKEND',
    title: 'What is Backend? Server Architecture & APIs',
    category: 'Backend Architecture',
    whatIsIt: 'Server-side application logic that receives client HTTP requests, validates incoming data, enforces business rules, interacts with databases, and returns JSON responses.',
    mentalModel: [
      'Frontend = User-facing interface running in the browser.',
      'Backend = Server-side engine handling business logic, validation, and security.',
      'Database = Persistent datastore retaining records permanently across sessions.',
      'API = Application Programming Interface; a standardized communication bridge.'
    ],
    realWorldFlow: 'Student clicks Apply → React makes POST request → Express route catches request → Body validation passes → Database inserts record → Server sends JSON response {success: true} → React displays success confirmation.',
    badge: 'Backend Core'
  },
  {
    moduleNumber: 10,
    part: 'PART E — BACKEND',
    title: 'Node.js + Express: Building RESTful APIs',
    category: 'REST API Engineering',
    whatIsIt: 'Constructing robust server applications using Node.js runtime and the lightweight Express.js framework.',
    topicsCovered: [
      'Node.js runtime, asynchronous event loop, and `package.json` scripts.',
      'Express app initialization, JSON body parsing middleware (`express.json()`).',
      'HTTP Methods & Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error.',
      'Route parameters (`req.params`), query strings (`req.query`), and request body (`req.body`).',
      'CORS middleware origin whitelisting and Helmet security headers.',
      'Environment variables with `dotenv`.'
    ],
    standardCrudRoutes: [
      { method: 'GET', path: '/api/students', desc: 'Retrieve list of all students (with optional query filters)' },
      { method: 'POST', path: '/api/students', desc: 'Create a new student application with validation' },
      { method: 'GET', path: '/api/students/:id', desc: 'Fetch a single student by unique identifier' },
      { method: 'PATCH', path: '/api/students/:id', desc: 'Update specific fields of an existing student' },
      { method: 'DELETE', path: '/api/students/:id', desc: 'Remove a student record from the system' }
    ],
    practicalTask: 'Build the Student API in Node.js/Express. Test every endpoint with Postman or Bruno. Must demonstrate 200/201 success responses and at least three distinct 4xx failure scenarios.',
    badge: 'Express API'
  },
  {
    moduleNumber: 11,
    part: 'PART E — BACKEND',
    title: 'Authentication vs Authorization',
    category: 'Security & Auth',
    whatIsIt: 'The critical architectural distinction between identifying a user and controlling what resources they can access.',
    definitions: {
      authentication: 'Authentication answers "Who are you?" (e.g. email/password verification, OTP, JWT issue).',
      authorization: 'Authorization answers "What are you allowed to do?" (e.g. Student can view own application; Admin can review and approve all applications).'
    },
    practicalImplementation: 'Implement signed JWTs with payload `{id, role}`. Use an `authenticateToken` middleware for authentication, and a `requireRole("ADMIN")` middleware for authorization.',
    badge: 'Security'
  },
  {
    moduleNumber: 12,
    part: 'PART F — DATABASE + SUPABASE',
    title: 'Database Fundamentals: Relational Modeling & SQL',
    category: 'Database Modeling',
    whatIsIt: 'Core principles of structured relational data storage, ACID compliance, and entity relationships.',
    keyTerms: [
      { term: 'Table', desc: 'Collection of related records (e.g. `students`, `applications`, `tasks`).' },
      { term: 'Row', desc: 'A single record or entity entry.' },
      { term: 'Column', desc: 'A specific typed field within the record (e.g. `email VARCHAR`, `created_at TIMESTAMP`).' },
      { term: 'Primary Key', desc: 'A unique identifier for each row (UUID or auto-incrementing ID).' },
      { term: 'Foreign Key', desc: 'A column that establishes a direct relational reference to a primary key in another table.' },
      { term: 'CRUD', desc: 'Create (`INSERT`), Read (`SELECT`), Update (`UPDATE`), and Delete (`DELETE`).' },
      { term: 'Constraint', desc: 'Rules that protect data integrity (`NOT NULL`, `UNIQUE`, `CHECK`, `REFERENCES`).' }
    ],
    exampleSchema: 'users (id, email) → profiles (user_id, full_name) → applications (id, user_id, status) → submissions (id, app_id, github_url).',
    badge: 'Relational DB'
  },
  {
    moduleNumber: 13,
    part: 'PART F — DATABASE + SUPABASE',
    title: 'Supabase: Open-Source Managed PostgreSQL Backend',
    category: 'Supabase & Postgres',
    whatIsIt: 'Supabase is a comprehensive backend platform built on PostgreSQL providing a full relational database, authentication, file storage, and real-time APIs.',
    whyUseIt: 'Allows developers to build full-stack web applications rapidly without hand-coding boilerplate infrastructure for every service.',
    whenToUseIt: 'When relational PostgreSQL data fits the business domain, and built-in Auth, Storage, and Row Level Security are needed.',
    stepByStepExercise: [
      'Create a free Supabase cloud project.',
      'Create relational tables: `profiles`, `applications`, and `tasks` in Table Editor.',
      'Add Primary Keys, Foreign Keys, and cascade rules.',
      'Create the Vite React frontend project.',
      'Install the official `@supabase/supabase-js` client SDK.',
      'Store project URL and publishable anon key in local `.env` variables.',
      'Initialize the client and implement sign-up and sign-in.',
      'Perform data inserts and queries from the frontend.',
      'Enable Row Level Security (RLS) on all exposed tables.',
      'Write RLS policies to restrict records to authenticated owners.',
      'Test signed-out, authenticated, and cross-student unauthorized access.',
      'Configure Supabase Storage bucket for controlled file uploads.'
    ],
    rlsWhyItMatters: 'Row Level Security controls which rows a user can read, insert, update, or delete directly from client queries. Supabase recommends securing all exposed tables with RLS policies.',
    criticalSecurityRule: 'NEVER put the Supabase service-role/secret key in frontend client code! Use the publishable anon key with strict RLS for browser access. Service-role keys bypass all RLS policies and must remain exclusively on protected backend servers.',
    badge: 'Supabase Postgres'
  },
  {
    moduleNumber: 14,
    part: 'PART F — DATABASE + SUPABASE',
    title: 'Supabase Auth: User Session & Route Protection',
    category: 'Supabase Auth',
    whatIsIt: 'Full authentication engine handling password hashing, email confirmation, magic links, OAuth providers, and JWT token sessions.',
    practiceFlow: [
      'Sign Up: Register new user with email and password via `supabase.auth.signUp()`.',
      'Sign In: Authenticate returning user with `supabase.auth.signInWithPassword()`.',
      'Get Current User: Retrieve active session via `supabase.auth.getUser()`.',
      'Profile Auto-Creation: Trigger or insert a corresponding row in the `profiles` table.',
      'Route Protection: Redirect unauthenticated visitors attempting to access `/dashboard`.',
      'Scoped Data Queries: Query only records where `user_id = auth.uid()`.',
      'Sign Out: Invalidate token and clear user session via `supabase.auth.signOut()`.',
      'Direct URL Attack Test: Test navigating to `/dashboard` while signed out to verify redirect.'
    ],
    badge: 'Supabase Auth'
  },
  {
    moduleNumber: 15,
    part: 'PART F — DATABASE + SUPABASE',
    title: 'Supabase Storage: Controlled File Uploads',
    category: 'Cloud Storage',
    whatIsIt: 'Scalable object storage for uploading and serving images, resume PDFs, submission archives, and certificate files.',
    bucketConfiguration: [
      'Create a dedicated storage bucket (e.g. `student-submissions`).',
      'Define upload policies (only authenticated users can upload to their own folder: `(bucket_id = "student-submissions" AND auth.uid()::text = (storage.foldername(name))[1])`).',
      'Define read policies (public access for certificates, authenticated-only for private submissions).',
      'Never assume hiding an upload button in UI constitutes security; enforce server/bucket policies.',
      'Test uploading as User A, and verify User B cannot delete or overwrite User A’s files.'
    ],
    badge: 'File Storage'
  },
  {
    moduleNumber: 16,
    part: 'PART G — FIREBASE',
    title: 'Firebase: Google Application Platform & Firestore',
    category: 'Firebase NoSQL',
    whatIsIt: 'Google’s application development platform offering NoSQL Cloud Firestore, Firebase Authentication, Cloud Storage, and static hosting.',
    whenToUseIt: 'When a document-oriented data model, real-time snapshot listeners, or Google cloud ecosystem integration is required.',
    studentWorkflow: [
      'Create a Firebase console project and register a web app.',
      'Enable Firebase Authentication (Email/Password provider).',
      'Create Cloud Firestore database in production mode.',
      'Initialize Firebase SDK in React project using environment variables.',
      'Implement CRUD operations using `collection()`, `doc()`, `getDocs()`, and `addDoc()`.',
      'Write granular Firestore Security Rules preventing unauthorized document reads/writes.',
      'Test authenticated vs unauthenticated access to protected collections.',
      'Configure Cloud Storage for Firebase for file uploads with storage rules.'
    ],
    securityRulesNote: 'Firebase requires pairing Authentication with Firestore Security Rules (e.g. `allow write: if request.auth != null && request.auth.uid == userId;`). Without rules, your database is publicly writable!',
    badge: 'Firebase NoSQL'
  },
  {
    moduleNumber: 17,
    part: 'PART H — API INTEGRATION',
    title: 'API Integration & Postman Testing Suite',
    category: 'API Testing',
    whatIsIt: 'Before integrating frontend components, developers must isolate and prove backend APIs using dedicated HTTP clients like Postman or Bruno.',
    requestAnatomy: {
      method: 'POST / GET / PUT / PATCH / DELETE',
      url: 'https://api.yourdomain.com/api/applications',
      headers: 'Content-Type: application/json, Authorization: Bearer <TOKEN>',
      body: '{ "name": "Hari", "email": "student@example.com", "track": "Full Stack" }'
    },
    httpVerbsSummary: [
      { verb: 'GET', purpose: 'Read data without modifying server state.' },
      { verb: 'POST', purpose: 'Create a new resource record.' },
      { verb: 'PUT / PATCH', purpose: 'Replace (PUT) or partially update (PATCH) existing records.' },
      { verb: 'DELETE', purpose: 'Remove an existing resource record.' }
    ],
    studentTask: 'Build the Student API, write a Postman test collection covering all routes, export the collection JSON, verify status codes (200, 201, 400, 401, 404), and connect the React client.',
    badge: 'API Testing'
  },
  {
    moduleNumber: 18,
    part: 'PART I — VERCEL',
    title: 'Vercel: Continuous Cloud Deployment from Git',
    category: 'Cloud Deployment',
    whatIsIt: 'A modern cloud deployment platform for frontend frameworks and serverless functions that connects to GitHub and automatically builds and deploys on every push.',
    environmentTiers: [
      { env: 'Local', desc: 'Runs on student workstation (`http://localhost:5173`).' },
      { env: 'Preview', desc: 'Automated unique preview deployment generated for pull requests and feature branches.' },
      { env: 'Production', desc: 'Live user-facing site built from the main branch and connected to custom domains.' }
    ],
    deploymentSteps: [
      'Verify project builds cleanly locally (`npm run build`).',
      'Push complete code to public GitHub repository.',
      'Log into Vercel and click "Add New... Project".',
      'Import the GitHub repository.',
      'Confirm framework preset (Vite / Next.js) and build settings.',
      'Add all required Environment Variables in Vercel Project Settings.',
      'Click Deploy and inspect the live build logs.',
      'Open the generated `.vercel.app` URL and test all routes.',
      'Push a new commit to GitHub to confirm automated redeployment.'
    ],
    envVariablesRule: 'Client variables must be prefixed with `VITE_` in Vite. Never commit `.env` to Git. When environment variables change in Vercel, trigger a redeploy for them to take effect.',
    badge: 'Vercel Deploy'
  },
  {
    moduleNumber: 19,
    part: 'PART J — DOMAIN + DNS',
    title: 'Domain, DNS & SSL Configuration',
    category: 'Domains & DNS',
    whatIsIt: 'Mapping a memorable human-friendly domain (e.g. `hariharan-dev.com`) to your cloud-deployed application with encrypted HTTPS.',
    coreDefinitions: [
      { term: 'Domain', desc: 'The human-readable address visitors type in the browser (e.g. `example.com`).' },
      { term: 'Hosting', desc: 'The server or CDN platform (Vercel) serving HTML/JS/CSS assets.' },
      { term: 'DNS', desc: 'Domain Name System; the internet phonebook translating hostnames into IP addresses.' },
      { term: 'SSL / HTTPS', desc: 'Secure cryptographic protocol encrypting communication between browser and server.' }
    ],
    connectionFlow: 'Purchase Domain → Deploy on Vercel → Vercel Project → Settings → Domains → Add Domain → Inspect Vercel DNS Records → Configure A & CNAME records at Registrar → Verify Status → Automated SSL Provisioning → Live HTTPS.',
    criticalWarning: 'Never delete or change existing MX or email records while configuring website DNS, unless instructed. Website DNS (A/CNAME) and email DNS (MX) can and should coexist peacefully.',
    troubleshootingChecklist: [
      'Confirm the domain was added to the correct Vercel project.',
      'Verify the exact DNS values requested by Vercel rather than copying generic tutorials.',
      'Check registrar DNS zone editor for conflicting duplicate A or CNAME records.',
      'Allow DNS propagation time (usually 5 to 60 minutes).',
      'Verify both apex (`example.com`) and subdomain (`www.example.com`).',
      'Confirm SSL padlock displays in the browser URL bar.',
      'Test API endpoints and OAuth redirect URLs with the new custom domain.'
    ],
    badge: 'Custom Domain'
  },
  {
    moduleNumber: 20,
    part: 'PART K — FULL-STACK PROJECT',
    title: 'Production Capstone: Student Internship Management Portal',
    category: 'Full-Stack Capstone',
    whatIsIt: 'Build, deploy, and showcase an enterprise-grade full-stack system connecting React, Express/Supabase, PostgreSQL, GitHub, Vercel, and a custom domain.',
    featureChecklist: [
      'Responsive Mobile-First Frontend (React + Tailwind)',
      'Secure User Authentication & Session Persistence',
      'Student Profile Management & Avatar Uploads',
      'Full CRUD Operations for Applications and Submissions',
      'ACID-Compliant Relational Database (PostgreSQL / Supabase)',
      'Server-Side Input Validation & Error Handling',
      'Role-Based Access Control (Student vs Admin)',
      'Protected File Storage for Offer Letters and Certificates',
      'Documented REST API Endpoints with JSON Payloads',
      'Loading Skeletons, Empty States & Animated Toast Feedback',
      'Atomic Git Commit History with Conventional Messages',
      'Comprehensive GitHub README with Architecture Diagrams',
      'Production Deployment on Vercel with Environment Variables',
      'Custom Domain Connection with Verified SSL/HTTPS',
      'Complete End-to-End Testing Across Devices'
    ],
    aiAssistedMilestones: [
      'Write system requirements in plain English.',
      'Ask AI coding assistant for architecture options and tradeoff analysis.',
      'Select technology stack with clear engineering justifications.',
      'Prompt AI to scaffold modular directory structure and file plan.',
      'Incrementally build UI components and state logic.',
      'Implement API endpoints and parameterized database queries.',
      'Establish database schema and RLS policies before complex writes.',
      'Test every user journey manually in Chrome DevTools.',
      'Commit to Git after every verified milestone.',
      'Deploy preview and production versions on Vercel.',
      'Map custom domain and record a 2–5 minute presentation demo.'
    ],
    badge: 'Capstone Final'
  }
];
