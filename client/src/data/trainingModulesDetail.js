/**
 * Detailed Step-by-Step Practical Curriculum & Execution Guides
 * for Stage 2: Training & Learning Modules (1 to 5)
 */

export const TRAINING_MODULES_DETAIL = {
  1: {
    module_num: 1,
    title: 'AI Tools & Development Workflow',
    category: 'Developer Environment & AI Engineering',
    est_duration: '3 - 5 Days',
    level: 'Foundational',
    badgeColor: 'sky',
    techStack: ['Node.js 18+', 'Git & GitHub', 'Cursor / VS Code', 'GitHub Copilot', 'Gemini CLI', 'ESLint & Prettier'],
    overview: 'Establish an enterprise-grade local engineering environment. Master prompt-assisted component design, automated test scaffolding, and professional Git branch-and-PR workflows.',
    steps: [
      {
        stepNumber: 1,
        title: 'Workstation Runtime & Editor Setup',
        summary: 'Install Node.js LTS, Git CLI, and configure VS Code or Cursor IDE with essential software engineering extensions.',
        details: 'Verify Node.js version 18 or higher is installed. Configure your global Git username and email matching your GitHub profile. Install ESLint, Prettier, and GitLens extensions.',
        command: 'node -v\ngit config --global user.name "Your Name"\ngit config --global user.email "your.email@example.com"',
        deliverable: 'Verified terminal environment with Node.js 18+ and Git global config.',
        proTip: 'Always use LTS (Long Term Support) versions of Node.js for production stability.'
      },
      {
        stepNumber: 2,
        title: 'AI Coding Assistant Integration',
        summary: 'Configure an AI coding assistant (Cursor, GitHub Copilot, Claude Code, or Gemini CLI) with workspace context rules.',
        details: 'Create a `.cursorrules` or `.github/copilot-instructions.md` file in your repository specifying coding standards: functional React components, TypeScript or modern ES6+, Tailwind CSS utility classes, and JSDoc annotations.',
        command: '# Sample .cursorrules or prompt configuration\n# Prefer functional React components with Tailwind CSS\n# Always handle async try/catch and loading/error states',
        deliverable: 'Workspace instruction file directing the AI assistant to follow strict project patterns.',
        proTip: 'Providing AI with contextual constraints produces significantly cleaner, bug-free code.'
      },
      {
        stepNumber: 3,
        title: 'Structured Prompt Engineering Practice',
        summary: 'Scaffold a responsive, production-ready UI card component using multi-turn prompt engineering.',
        details: 'Draft a structured system and user prompt requesting a responsive user profile card with avatar, badges, status indicators, and hover animations. Refine the generated code to adhere to accessibility (ARIA) and responsive grid rules.',
        command: 'npx create-vite@latest ai-workflow-starter --template react\ncd ai-workflow-starter\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p',
        deliverable: 'A clean, modular React component generated and refined via prompt-assisted development.',
        proTip: 'Ask the AI to explain edge cases and add prop validation or TypeScript interfaces.'
      },
      {
        stepNumber: 4,
        title: 'Disciplined Git Branch & Conventional Commits',
        summary: 'Initialize a Git repository, create a feature branch, and submit atomic commits using Conventional Commits.',
        details: 'Do not commit directly to main. Branch off into `feature/ai-workflow-setup`. Structure commits into atomic logical units with types: `feat:`, `fix:`, `docs:`, `chore:`, and `refactor:`.',
        command: 'git init\ngit checkout -b feature/ai-workflow-setup\ngit add .\ngit commit -m "feat(ui): scaffold responsive user profile card component"\ngit commit -m "docs: add prompt engineering log and reflection notes"',
        deliverable: 'Git log displaying at least 3 clean, atomic conventional commits.',
        proTip: 'Conventional commits enable automated semantic versioning and instant change log generation.'
      },
      {
        stepNumber: 5,
        title: 'GitHub Remote, Pull Request & Submission',
        summary: 'Push your branch to GitHub, open a descriptive Pull Request with screenshots, and merge to main.',
        details: 'Publish your repository to public GitHub. Open a Pull Request detailing the changes, including screenshots of the generated component and a log of prompts used. Merge the PR into main and verify the README.',
        command: 'git remote add origin https://github.com/your-username/ai-workflow-starter.git\ngit push -u origin feature/ai-workflow-setup',
        deliverable: 'Public GitHub repository URL with closed/merged PR and clear README documentation.',
        proTip: 'Include a "Prompt Journal" in your README showing before/after prompt iterations.'
      }
    ],
    checklist: [
      'Node.js 18+ LTS and Git installed and verified',
      'AI coding assistant configured with custom workspace prompt instructions',
      'Component scaffolded using structured prompt engineering',
      'Feature branch created with at least 3 Conventional Commits',
      'Public GitHub repository with informative README and prompt notes'
    ]
  },

  2: {
    module_num: 2,
    title: 'Database & Project Development',
    category: 'Relational Schema Design & SQL Engineering',
    est_duration: '4 - 6 Days',
    level: 'Intermediate',
    badgeColor: 'cyan',
    techStack: ['PostgreSQL / SQLite', 'DBeaver / TablePlus', 'SQL DDL / DML', 'dbdiagram.io', '3NF Normalization'],
    overview: 'Design robust, ACID-compliant relational schemas from scratch. Learn Third Normal Form (3NF) data modeling, foreign key constraints, migration scripting, and complex JOIN query optimization.',
    steps: [
      {
        stepNumber: 1,
        title: 'Domain Analysis & Entity-Relationship Modeling (ERD)',
        summary: 'Map real-world business entities and cardinality into a normalized Entity-Relationship Diagram.',
        details: 'Identify primary entities: `users`, `roles`, `courses`, `batches`, `student_tasks`, and `submissions`. Establish 1:1, 1:N, and N:M relationships using junction tables. Normalize all entities to Third Normal Form (3NF) to eliminate transitive dependencies.',
        command: '// Sample dbdiagram.io markup\nTable users {\n  id varchar [pk]\n  email varchar [unique, not null]\n  full_name varchar [not null]\n  created_at timestamp\n}',
        deliverable: 'Visual ERD diagram link (dbdiagram.io, Figma, or PNG export in repository).',
        proTip: 'Always define clear foreign key cascade behaviors (`ON DELETE CASCADE` vs `ON DELETE RESTRICT`).'
      },
      {
        stepNumber: 2,
        title: 'DDL Schema Migration Scripting',
        summary: 'Write declarative SQL DDL statements creating normalized tables with strict constraints and indexes.',
        details: 'Create a `schema.sql` file. Use appropriate column types (UUID/VARCHAR, TEXT, INTEGER, BOOLEAN, TIMESTAMP). Add `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `CHECK`, and create indexes on high-traffic filter/search columns.',
        command: 'CREATE TABLE IF NOT EXISTS student_tasks (\n  id VARCHAR(64) PRIMARY KEY,\n  student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n  task_num INTEGER NOT NULL,\n  status VARCHAR(32) DEFAULT \'PENDING\',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\nCREATE INDEX idx_student_tasks_student ON student_tasks(student_id);',
        deliverable: 'A clean, re-runnable `schema.sql` migration file.',
        proTip: 'Indexes speed up read operations but add overhead to writes. Only index columns used in WHERE or JOIN clauses.'
      },
      {
        stepNumber: 3,
        title: 'Synthetic Seed Data Generation',
        summary: 'Write automated seed scripts inserting realistic, multi-tenant sample data across all tables.',
        details: 'Create a `seed.sql` script with 15–20 interrelated records. Ensure foreign keys match existing primary keys to maintain relational integrity.',
        command: 'INSERT INTO users (id, email, full_name) VALUES \n  (\'usr_1\', \'alex@example.com\', \'Alex Rivera\'),\n  (\'usr_2\', \'sam@example.com\', \'Samira Khan\');\n\nINSERT INTO student_tasks (id, student_id, task_num, status) VALUES\n  (\'tsk_1\', \'usr_1\', 1, \'COMPLETED\'),\n  (\'tsk_2\', \'usr_1\', 2, \'IN_PROGRESS\');',
        deliverable: 'A `seed.sql` script that populates the entire database with one command.',
        proTip: 'Order your INSERT statements carefully: parent tables must always be populated before child tables.'
      },
      {
        stepNumber: 4,
        title: 'Complex Multi-Table SQL Query Suite',
        summary: 'Write advanced analytical queries demonstrating INNER JOIN, LEFT JOIN, GROUP BY, and aggregations.',
        details: 'Write 5 distinct SQL queries in a `queries.sql` file: 1) Student progress overview using `LEFT JOIN` and `COUNT`, 2) High-performing students via `GROUP BY` and `HAVING`, 3) Filter by date ranges, 4) Subquery calculation, and 5) Status breakdown.',
        command: 'SELECT u.full_name, COUNT(t.id) as total_tasks, \n       SUM(CASE WHEN t.status = \'COMPLETED\' THEN 1 ELSE 0 END) as completed\nFROM users u\nLEFT JOIN student_tasks t ON u.id = t.student_id\nGROUP BY u.id, u.full_name;',
        deliverable: 'A `queries.sql` file with documented explanations and formatted query outputs.',
        proTip: 'Use `EXPLAIN QUERY PLAN` to verify that your indexes are actually being utilized by the query planner.'
      },
      {
        stepNumber: 5,
        title: 'Repository Structure & README Documentation',
        summary: 'Package your schema, migrations, seed data, and query tests into a well-documented GitHub repository.',
        details: 'Structure the project with `/migrations`, `/seeds`, `/queries`, and `/diagrams`. In your README, explain schema decisions, database engine chosen (SQLite/Postgres), and step-by-step instructions to run the migrations.',
        command: '# Run migrations in SQLite or Postgres\nsqlite3 project.db < schema.sql\nsqlite3 project.db < seed.sql\nsqlite3 project.db < queries.sql',
        deliverable: 'Public GitHub repository URL containing the complete database project.',
        proTip: 'Add screenshots of query results executed in DB Browser or DBeaver to your README.'
      }
    ],
    checklist: [
      'Visual ERD diagram link showing 3NF normalization',
      'Clean `schema.sql` with Primary Keys, Foreign Keys, and Indexes',
      'Seed script (`seed.sql`) with at least 15–20 interrelated rows',
      '5 complex analytical queries using JOINs and aggregations',
      'README explaining schema choices and execution instructions'
    ]
  },

  3: {
    module_num: 3,
    title: 'Database + Backend Practical Work',
    category: 'Node.js & Express RESTful API Engineering',
    est_duration: '5 - 7 Days',
    level: 'Advanced Backend',
    badgeColor: 'blue',
    techStack: ['Node.js', 'Express.js', 'JWT (jsonwebtoken)', 'bcryptjs', 'Postman / Bruno', 'CORS & Helmet'],
    overview: 'Build robust, production-ready server applications with industry-standard REST architectures. Implement secure JWT authentication, password hashing, role-based authorization, and parameterized database queries.',
    steps: [
      {
        stepNumber: 1,
        title: 'Layered Express.js Server Architecture',
        summary: 'Initialize a modular Express application separating routes, controllers, middleware, and database access.',
        details: 'Set up directory structure: `/routes`, `/controllers`, `/middleware`, `/config`, and `/models`. Configure middleware for JSON body parsing, CORS origin whitelisting, Helmet security headers, and structured console request logging.',
        command: 'npm init -y\nnpm install express cors helmet dotenv bcryptjs jsonwebtoken express-rate-limit\nnpm install -D nodemon',
        deliverable: 'Modular Express server with error handler and health check endpoint (`GET /api/health`).',
        proTip: 'Never put database queries directly in route definitions. Keep controllers focused on HTTP handling.'
      },
      {
        stepNumber: 2,
        title: 'Database Adapter & Parameterized Queries',
        summary: 'Create a centralized database connection module that executes safe, injection-proof parameterized SQL.',
        details: 'Create `db.js` with promisified query helpers (`dbGet`, `dbAll`, `dbRun`). Ensure all user-supplied parameters are passed as array arguments rather than interpolated template strings.',
        command: '// Safe parameterized query\nconst user = await dbGet(\'SELECT * FROM users WHERE email = ?\', [email]);',
        deliverable: 'Database connector module with connection pooling and error catching.',
        proTip: 'SQL injection is the #1 database vulnerability. Always use placeholders (`?` or `$1`), never string concatenation.'
      },
      {
        stepNumber: 3,
        title: 'User Authentication & JWT Lifecycle',
        summary: 'Implement `/api/auth/register` and `/api/auth/login` endpoints with bcrypt password hashing and signed JWTs.',
        details: 'Hash passwords with `bcryptjs` using 10 salt rounds before storing. Upon login, verify password hash and generate a signed JSON Web Token containing the user ID and role with an expiration (e.g., 24h).',
        command: '// Hash password\nconst passwordHash = await bcrypt.hash(password, 10);\n\n// Generate JWT\nconst token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: \'24h\' });',
        deliverable: 'Working registration and login endpoints returning JWT tokens.',
        proTip: 'Store JWT secret keys in `.env` and add `.env` to `.gitignore`. Never hardcode secrets in source code.'
      },
      {
        stepNumber: 4,
        title: 'Role-Based Access Control (RBAC) Middleware',
        summary: 'Write reusable middleware to protect private endpoints and restrict actions based on user roles.',
        details: 'Create `authenticateToken` middleware that parses the `Authorization: Bearer <token>` header, verifies the signature, and attaches `req.user`. Create `requireRole(\'ADMIN\')` middleware that returns `403 Forbidden` if unauthorized.',
        command: 'export const authenticateToken = (req, res, next) => {\n  const token = req.headers.authorization?.split(\' \')[1];\n  if (!token) return res.status(401).json({ error: \'Token required\' });\n  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {\n    if (err) return res.status(403).json({ error: \'Invalid token\' });\n    req.user = user;\n    next();\n  });\n};',
        deliverable: 'Protected route chains enforcing token and role verification.',
        proTip: 'Differentiate between 401 Unauthorized (not logged in) and 403 Forbidden (logged in, but lacking permission).'
      },
      {
        stepNumber: 5,
        title: 'CRUD Resource Endpoints & Postman Test Collection',
        summary: 'Build complete REST endpoints for an assigned resource and document with an exported Postman/Bruno collection.',
        details: 'Implement full CRUD for tasks or modules: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, and `DELETE /api/tasks/:id`. Test all success (200, 201) and error (400, 401, 403, 404, 500) cases in Postman. Export collection JSON.',
        command: '# Export Postman collection or provide public Postman Documentation URL',
        deliverable: 'GitHub repository with complete backend code and exported Postman collection.',
        proTip: 'Include sample cURL commands in your README for instant developer testing.'
      }
    ],
    checklist: [
      'Layered Express architecture (routes, controllers, middleware)',
      'Secure password hashing with bcrypt (10 rounds)',
      'Stateless JWT authentication and verification middleware',
      'Role-based access control protecting admin endpoints',
      'Exported Postman/Bruno collection or documented API tests'
    ]
  },

  4: {
    module_num: 4,
    title: 'Project Implementation',
    category: 'Full Stack Frontend Integration & State Management',
    est_duration: '5 - 7 Days',
    level: 'Full Stack Integration',
    badgeColor: 'indigo',
    techStack: ['React 18/19', 'Vite', 'Tailwind CSS', 'Lucide Icons', 'Fetch API / Axios', 'LocalStorage Auth'],
    overview: 'Integrate client-side React Single Page Applications with your authenticated backend APIs. Implement responsive user dashboards, persistent auth sessions, modal dialogs, and real-time toast feedback.',
    steps: [
      {
        stepNumber: 1,
        title: 'Frontend Scaffolding & Design System Tokens',
        summary: 'Initialize a modern React application with Vite, Tailwind CSS, and Lucide React icons.',
        details: 'Set up Vite with React. Configure Tailwind CSS with standard branding colors (`#07284a` navy, sky accents, neutral slates). Establish responsive typography and layout container utilities.',
        command: 'npm create vite@latest fullstack-client -- --template react\ncd fullstack-client\nnpm install lucide-react canvas-confetti\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p',
        deliverable: 'Clean Vite React project with configured Tailwind styles.',
        proTip: 'Use CSS utility variables for colors so dark/light themes can be toggled effortlessly.'
      },
      {
        stepNumber: 2,
        title: 'Authentication State & Session Persistence',
        summary: 'Implement user login/signup forms, store JWT tokens in localStorage, and build protected route guards.',
        details: 'Create an Auth Context or hook managing `user`, `token`, and `isAuthenticated`. When user logs in, store token in `localStorage`. Redirect unauthenticated users away from protected views back to the login screen.',
        command: '// Save token and state\nlocalStorage.setItem(\'skyrovix_token\', data.token);\nsetUser(data.user);',
        deliverable: 'Working login, registration, and logout flows with persistent session state.',
        proTip: 'Always clear tokens on HTTP 401/403 responses to prevent stale token errors.'
      },
      {
        stepNumber: 3,
        title: 'API Client Layer & Custom Fetch Hooks',
        summary: 'Create an authenticated API client utility that automatically attaches the Bearer token to requests.',
        details: 'Build an `apiClient.js` helper wrapping `fetch`. Automatically include `Authorization: Bearer <token>` and `Content-Type: application/json`. Handle JSON response parsing and standardized error catching.',
        command: 'export const apiFetch = async (endpoint, options = {}) => {\n  const token = localStorage.getItem(\'skyrovix_token\');\n  const res = await fetch(endpoint, {\n    ...options,\n    headers: {\n      \'Content-Type\': \'application/json\',\n      ...(token ? { Authorization: `Bearer ${token}` } : {}),\n      ...options.headers\n    }\n  });\n  return res.json();\n};',
        deliverable: 'Reusable API client handling authorization headers and errors.',
        proTip: 'Centralizing your fetch wrapper means if your backend base URL changes, you only update one file.'
      },
      {
        stepNumber: 4,
        title: 'Responsive Dashboard, Modals & Toast Alerts',
        summary: 'Construct an interactive user dashboard with data tables, submission modals, and animated toasts.',
        details: 'Build dashboard cards displaying fetched resources with filter tabs. Implement modal dialogs for creating and editing records. Add toast notifications upon successful actions and clear banner alerts on failures.',
        command: '// Animated toast notifications & responsive cards\n{toast && (\n  <div className="fixed top-5 right-5 bg-slate-900 text-white p-4 rounded-xl shadow-2xl">\n    {toast.message}\n  </div>\n)}',
        deliverable: 'Interactive dashboard with modal inputs, empty states, and toast feedback.',
        proTip: 'Always provide skeleton loaders or spinners while data is fetching so the UI never appears broken.'
      },
      {
        stepNumber: 5,
        title: 'End-to-End User Flow & Cross-Device QA',
        summary: 'Test the full user journey from registration to resource creation and update across mobile and desktop.',
        details: 'Verify that forms validate inputs (email format, password length), mobile viewport menus collapse correctly, and errors display helpful messages. Capture screenshots or record a short demo video for your portfolio.',
        command: 'npm run build\nnpm run preview',
        deliverable: 'Fully functional full-stack application connecting frontend and backend seamlessly.',
        proTip: 'Test your application with throttled network in DevTools to ensure slow connections handle loading states gracefully.'
      }
    ],
    checklist: [
      'Vite + React frontend with Tailwind CSS design system',
      'Persistent authentication state with localStorage tokens',
      'Protected routes redirecting unauthenticated visitors',
      'Authenticated CRUD operations connecting to Module 3 API',
      'Responsive design tested on both mobile and desktop screens'
    ]
  },

  5: {
    module_num: 5,
    title: 'Deployment & Hosting',
    category: 'Production DevOps & Cloud Infrastructure',
    est_duration: '3 - 5 Days',
    level: 'Production Grade',
    badgeColor: 'emerald',
    techStack: ['Vercel / Netlify', 'Render / Railway', 'GitHub Actions', 'SSL / HTTPS', 'CORS Security', 'Environment Variables'],
    overview: 'Deploy full-stack applications to modern cloud platforms. Configure production environment variables, enforce cross-origin security, verify HTTPS certificates, and set up automated GitHub Actions CI/CD pipelines.',
    steps: [
      {
        stepNumber: 1,
        title: 'Production Build Optimization & Audit',
        summary: 'Generate optimized static assets using `npm run build` and resolve all lint and bundling warnings.',
        details: 'Run `npm run build` in both client and server projects. Check bundle sizes, remove debug `console.log` statements, and ensure environment variables use `import.meta.env` (Vite) or `process.env` (Node).',
        command: 'npm run lint\nnpm run build\nnpx vite preview',
        deliverable: 'Clean production build output with zero errors or warnings.',
        proTip: 'Never bundle secret API keys in the client-side build; client code is publicly inspectable in the browser.'
      },
      {
        stepNumber: 2,
        title: 'Backend Cloud Deployment (Render / Railway)',
        summary: 'Deploy the Node.js Express server to a cloud container platform with production environment variables.',
        details: 'Connect your GitHub repository to Render or Railway. Configure Build Command (`npm install`) and Start Command (`node server.js`). Add environment variables: `PORT=5000`, `NODE_ENV=production`, `JWT_SECRET`, and database connection strings.',
        command: '# Verify server starts with production env\nNODE_ENV=production node server.js',
        deliverable: 'Live backend server URL with a functional `/api/health` status endpoint.',
        proTip: 'Configure a health check endpoint so your cloud provider can automatically restart unhealthy instances.'
      },
      {
        stepNumber: 3,
        title: 'Frontend Cloud Deployment (Vercel / Netlify)',
        summary: 'Deploy the React client to a global CDN network and configure SPA rewrite rules for routing.',
        details: 'Connect client repository to Vercel. Set the output directory to `dist`. Add a `vercel.json` file with rewrite rules redirecting all routes (`/*`) to `/index.html` so client-side routing does not return 404 on page refresh.',
        command: '{\n  "rewrites": [\n    { "source": "/(.*)", "destination": "/index.html" }\n  ]\n}',
        deliverable: 'Live frontend website accessible via custom or `.vercel.app` URL with valid SSL/HTTPS.',
        proTip: 'SPA rewrite configuration is mandatory on static hosts; otherwise refreshing `/dashboard` returns 404.'
      },
      {
        stepNumber: 4,
        title: 'Production CORS & Origin Restriction',
        summary: 'Harden your live backend by restricting CORS requests strictly to your deployed frontend domain.',
        details: 'Update backend CORS configuration. In development, allow localhost; in production, only accept requests originating from your live Vercel domain.',
        command: 'const allowedOrigins = [process.env.CLIENT_URL, \'https://my-app.vercel.app\'];\napp.use(cors({\n  origin: (origin, callback) => {\n    if (!origin || allowedOrigins.includes(origin)) callback(null, true);\n    else callback(new Error(\'Not allowed by CORS\'));\n  },\n  credentials: true\n}));',
        deliverable: 'Secure API rejecting unauthorized third-party cross-origin requests.',
        proTip: 'Wildcard CORS (`origin: "*"`) in production with authentication credentials is an OWASP security risk.'
      },
      {
        stepNumber: 5,
        title: 'Automated CI/CD Pipeline with GitHub Actions',
        summary: 'Create a GitHub Actions workflow that automatically runs linting and build checks on every push to main.',
        details: 'Create `.github/workflows/deploy.yml`. Define jobs to check out code, set up Node.js, install dependencies, run linter, and build the project on every push and pull request.',
        command: 'name: CI/CD Pipeline\non:\n  push:\n    branches: [ main ]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - name: Use Node.js\n      uses: actions/setup-node@v3\n      with:\n        node-version: 18\n    - run: npm ci\n    - run: npm run build',
        deliverable: 'Green passing GitHub Actions badge in your repository README.',
        proTip: 'Automated CI guarantees that broken code can never be merged into your production branch undetected.'
      }
    ],
    checklist: [
      'Clean `npm run build` executed without errors',
      'Backend deployed to cloud with production environment variables',
      'Frontend deployed to Vercel/Netlify with SPA routing rewrites',
      'CORS origin restricted to live production frontend domain',
      'GitHub Actions CI/CD workflow running automated checks'
    ]
  }
};
