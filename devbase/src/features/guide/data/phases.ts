import type { Phase } from "@/types/guide";

export const PHASES: Phase[] = [
  {
    id: 1,
    num: "01",
    title: "Install Termux — Your Linux Core",
    duration: "~5 min",
    steps: [
      {
        id: "1-1",
        title: "Install F-Droid (App Store)",
        description: "F-Droid has the real Termux. Play Store version is outdated and broken.",
        links: [{ label: "f-droid.org", url: "https://f-droid.org", icon: "⬇️" }],
      },
      {
        id: "1-2",
        title: "Install Termux from F-Droid",
        description: "Search \"Termux\" inside F-Droid and install it. This is your Linux terminal.",
      },
      {
        id: "1-3",
        title: "Bootstrap your environment",
        description: "Open Termux and run this command — it installs everything you need.",
        codeBlocks: [
          {
            lang: "bash",
            code: `# Update & install core tools
pkg update && pkg upgrade -y && pkg install git nodejs python curl wget unzip micro -y`,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    num: "02",
    title: "VS Code in Your Browser",
    duration: "~3 min",
    steps: [
      {
        id: "2-1",
        title: "Install code-server",
        description: "This runs VS Code right in your phone's browser. Real editor, real extensions.",
        codeBlocks: [
          {
            lang: "bash",
            code: "npm install -g code-server",
          },
        ],
      },
      {
        id: "2-2",
        title: "Launch VS Code",
        description: "Run this, then open http://localhost:8080 in your browser.",
        codeBlocks: [
          {
            lang: "bash",
            code: "code-server --bind-addr 127.0.0.1:8080 --auth none",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    num: "03",
    title: "Build Web Apps — React / Next.js",
    duration: "~5 min",
    steps: [
      {
        id: "3-1",
        title: "Create your first React app",
        description: "Creates a full React project. Run unlimited times with different names.",
        codeBlocks: [
          {
            lang: "bash",
            code: `# Create a new web app
npx create-react-app my-app
cd my-app && npm start
# Opens at http://localhost:3000`,
          },
        ],
      },
      {
        id: "3-2",
        title: "Or use Next.js (recommended)",
        description: "Next.js is more powerful — handles routing, APIs, SEO, and deployment automatically.",
        codeBlocks: [
          {
            lang: "bash",
            code: `npx create-next-app@latest my-app --js --tailwind --no-eslint
cd my-app && npm run dev`,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    num: "04",
    title: "Build Android Apps — Expo",
    duration: "~5 min",
    steps: [
      {
        id: "4-1",
        title: "Install Expo Go on your phone",
        description: "Get it from Play Store — this lets you preview any app instantly on your real device.",
        links: [
          {
            label: "Expo Go",
            url: "https://play.google.com/store/apps/details?id=host.exp.exponent",
            icon: "📱",
          },
        ],
      },
      {
        id: "4-2",
        title: "Create your first Android app",
        description: "Scan the QR code it generates with Expo Go to see your app live on your phone.",
        codeBlocks: [
          {
            lang: "bash",
            code: `npx create-expo-app@latest MyApp
cd MyApp && npx expo start
# Scan QR code with Expo Go app`,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    num: "05",
    title: "Backend + Database",
    duration: "~5 min",
    steps: [
      {
        id: "5-1",
        title: "Create a Node.js API server",
        description: "Express is the #1 backend framework. Powers your app's data, auth, and logic.",
        codeBlocks: [
          {
            lang: "bash",
            code: `mkdir my-api && cd my-api
npm init -y
npm install express cors dotenv
# Then create server.js in VS Code`,
          },
          {
            lang: "javascript",
            filename: "server.js",
            code: `const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'API running 🚀' })
})

app.listen(3001, () => console.log('Server on :3001'))`,
          },
        ],
      },
      {
        id: "5-2",
        title: "Free cloud database — MongoDB Atlas",
        description: "512MB free forever. Stores your app data in the cloud, no setup needed.",
        links: [
          { label: "MongoDB Atlas", url: "https://mongodb.com/atlas", icon: "🍃" },
          { label: "Supabase (SQL)", url: "https://supabase.com", icon: "⚡" },
        ],
      },
    ],
  },
  {
    id: 6,
    num: "06",
    title: "Git, GitHub & Free Hosting",
    duration: "~5 min",
    steps: [
      {
        id: "6-1",
        title: "Set up Git (version control)",
        description: "Never lose your code. Git tracks every change you make across all projects.",
        codeBlocks: [
          {
            lang: "bash",
            code: `git config --global user.name "Your Name"
git config --global user.email "you@email.com"
# Inside any project folder:
git init && git add . && git commit -m "first commit"`,
          },
        ],
      },
      {
        id: "6-2",
        title: "Sign up for free accounts",
        description: "GitHub stores your code. Vercel deploys your web apps to the internet — instantly free.",
        links: [
          { label: "GitHub", url: "https://github.com", icon: "🐙" },
          { label: "Vercel", url: "https://vercel.com", icon: "▲" },
          { label: "Netlify", url: "https://netlify.com", icon: "🌐" },
          { label: "Railway", url: "https://railway.app", icon: "🚂" },
        ],
      },
    ],
  },
];

export const TOTAL_STEPS = PHASES.reduce((acc, phase) => acc + phase.steps.length, 0);

export const STACK_REFERENCE = [
  { layer: "Terminal", tool: "Termux", purpose: "Linux on Android" },
  { layer: "Editor", tool: "code-server", purpose: "VS Code in browser" },
  { layer: "Web", tool: "Next.js", purpose: "Web apps & sites" },
  { layer: "Mobile", tool: "Expo", purpose: "Android apps" },
  { layer: "Backend", tool: "Node + Express", purpose: "APIs & servers" },
  { layer: "Database", tool: "MongoDB Atlas", purpose: "Cloud data storage" },
  { layer: "Auth", tool: "Clerk / Supabase", purpose: "Login & users" },
  { layer: "Hosting", tool: "Vercel / Netlify", purpose: "Deploy to internet" },
  { layer: "Version Control", tool: "Git + GitHub", purpose: "Save & backup code" },
];
