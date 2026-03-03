import type { ProjectFile } from "@/types/project";

export function reactTemplate(projectName: string): ProjectFile[] {
  return [
    {
      path: "package.json",
      language: "json",
      content: JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, "-"),
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
        },
        devDependencies: {
          "@vitejs/plugin-react": "^4.2.0",
          typescript: "^5.2.2",
          vite: "^5.0.8",
          "@types/react": "^18.2.43",
          "@types/react-dom": "^18.2.17",
        },
      }, null, 2),
    },
    {
      path: "src/App.tsx",
      language: "tsx",
      content: `import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>${projectName}</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default App;`,
    },
    {
      path: "src/main.tsx",
      language: "tsx",
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
    },
    {
      path: "index.html",
      language: "html",
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
  ];
}
