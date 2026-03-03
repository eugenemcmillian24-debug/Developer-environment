import type { ProjectFile } from "@/types/project";

export function nodejsTemplate(projectName: string): ProjectFile[] {
  return [
    {
      path: "package.json",
      language: "json",
      content: JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, "-"),
        version: "0.1.0",
        description: `${projectName} API`,
        main: "server.js",
        scripts: {
          start: "node server.js",
          dev: "nodemon server.js",
        },
        dependencies: {
          express: "^4.18.2",
          cors: "^2.8.5",
          dotenv: "^16.3.1",
        },
        devDependencies: {
          nodemon: "^3.0.2",
        },
      }, null, 2),
    },
    {
      path: "server.js",
      language: "javascript",
      content: `require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '${projectName} API running 🚀' });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    },
    {
      path: ".env.example",
      language: "env",
      content: `PORT=3001
NODE_ENV=development
DATABASE_URL=`,
    },
    {
      path: ".gitignore",
      language: "text",
      content: `node_modules/
.env
*.log`,
    },
  ];
}
