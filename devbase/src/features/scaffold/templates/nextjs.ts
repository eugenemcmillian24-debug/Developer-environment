import type { ProjectFile } from "@/types/project";

export function nextjsTemplate(projectName: string): ProjectFile[] {
  return [
    {
      path: "package.json",
      language: "json",
      content: JSON.stringify({
        name: projectName.toLowerCase().replace(/\s+/g, "-"),
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          next: "14.2.30",
          react: "^18",
          "react-dom": "^18",
        },
        devDependencies: {
          typescript: "^5",
          "@types/node": "^20",
          "@types/react": "^18",
          "@types/react-dom": "^18",
          tailwindcss: "^3.4",
          postcss: "^8",
          autoprefixer: "^10",
        },
      }, null, 2),
    },
    {
      path: "src/app/page.tsx",
      language: "tsx",
      content: `export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${projectName}</h1>
        <p className="text-gray-500">Get started by editing src/app/page.tsx</p>
      </div>
    </main>
  );
}`,
    },
    {
      path: "src/app/layout.tsx",
      language: "tsx",
      content: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    },
    {
      path: "src/app/globals.css",
      language: "css",
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
    {
      path: "tailwind.config.ts",
      language: "ts",
      content: `import type { Config } from "tailwindcss";
export default { content: ["./src/**/*.{ts,tsx}"], theme: { extend: {} }, plugins: [] } satisfies Config;`,
    },
    {
      path: "tsconfig.json",
      language: "json",
      content: JSON.stringify({
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          paths: { "@/*": ["./src/*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
        exclude: ["node_modules"],
      }, null, 2),
    },
  ];
}
