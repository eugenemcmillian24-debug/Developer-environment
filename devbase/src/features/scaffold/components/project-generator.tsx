"use client";

import { useState } from "react";
import { FolderOpen, Wand2, Download, Loader2, FileCode, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { nextjsTemplate } from "../templates/nextjs";
import { reactTemplate } from "../templates/react";
import { expoTemplate } from "../templates/expo";
import { nodejsTemplate } from "../templates/nodejs";
import type { ProjectTemplate, ProjectFile } from "@/types/project";

interface ProjectGeneratorProps {
  onToast?: (msg: string) => void;
}

const TEMPLATES: { id: ProjectTemplate; label: string; icon: string; desc: string }[] = [
  { id: "nextjs", label: "Next.js", icon: "▲", desc: "Full-stack web app with TypeScript + Tailwind" },
  { id: "react", label: "React + Vite", icon: "⚛️", desc: "Frontend SPA with TypeScript" },
  { id: "expo", label: "Expo", icon: "📱", desc: "Android/iOS mobile app" },
  { id: "nodejs", label: "Node.js API", icon: "🚂", desc: "Express REST API backend" },
];

export function ProjectGenerator({ onToast }: ProjectGeneratorProps) {
  const [projectName, setProjectName] = useState("");
  const [template, setTemplate] = useState<ProjectTemplate>("nextjs");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const generateTemplate = () => {
    const name = projectName.trim() || "my-app";
    switch (template) {
      case "nextjs": return nextjsTemplate(name);
      case "react": return reactTemplate(name);
      case "expo": return expoTemplate(name);
      case "nodejs": return nodejsTemplate(name);
    }
  };

  const handleGenerate = async () => {
    const name = projectName.trim() || "my-app";
    setIsGenerating(true);

    try {
      if (prompt.trim()) {
        const response = await fetch("/api/scaffold", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectName: name, template, prompt, aiAssisted: true }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.files?.length) {
            setFiles(data.files);
            setSelectedFile(data.files[0].path);
            onToast?.("AI-generated project ready!");
            return;
          }
        }
      }

      const templateFiles = generateTemplate();
      setFiles(templateFiles);
      setSelectedFile(templateFiles[0].path);
      onToast?.("Project template generated!");
    } catch {
      const templateFiles = generateTemplate();
      setFiles(templateFiles);
      setSelectedFile(templateFiles[0].path);
      onToast?.("Template generated (AI unavailable)");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedFileContent = files.find((f) => f.path === selectedFile);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="font-mono text-xs text-muted mb-1">// PROJECT SCAFFOLD</div>
        <div className="text-white font-bold">Generate a new project</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={cn(
              "p-3 rounded-lg border text-left transition-all duration-200",
              template === t.id
                ? "bg-accent/5 border-accent text-white"
                : "bg-panel border-border text-muted hover:border-accent2 hover:text-text"
            )}
          >
            <div className="text-lg mb-1">{t.icon}</div>
            <div className="font-bold text-xs">{t.label}</div>
            <div className="text-[10px] font-mono mt-0.5 opacity-70">{t.desc}</div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="project-name"
          className="w-full bg-bg border border-border rounded px-3 py-2 font-mono text-sm text-text placeholder-muted outline-none focus:border-accent2 transition-colors"
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Optional: describe what your app should do (AI will customize the code)..."
          className="w-full bg-bg border border-border rounded px-3 py-2 font-mono text-xs text-text placeholder-muted outline-none focus:border-accent2 transition-colors resize-none"
          rows={3}
        />
        <Button variant="glow" size="md" onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <><Loader2 size={14} className="animate-spin" /> Generating...</>
          ) : (
            <><Wand2 size={14} /> Generate Project</>
          )}
        </Button>
      </div>

      {files.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-b border-border">
            <div className="flex items-center gap-2 text-accent font-mono text-xs">
              <FolderOpen size={13} />
              {projectName || "my-app"}
            </div>
            <span className="text-muted text-[10px] font-mono">{files.length} files</span>
          </div>
          <div className="flex">
            <div className="w-40 border-r border-border flex-shrink-0">
              {files.map((f) => (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f.path)}
                  className={cn(
                    "w-full flex items-center gap-1.5 px-2 py-2 text-left font-mono text-[10px] border-b border-white/[0.04] last:border-0 transition-colors truncate",
                    selectedFile === f.path
                      ? "bg-accent/5 text-accent"
                      : "text-muted hover:text-text hover:bg-white/5"
                  )}
                >
                  <FileCode size={10} className="flex-shrink-0" />
                  <span className="truncate">{f.path.split("/").pop()}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              {selectedFileContent && (
                <CodeBlock
                  code={selectedFileContent.content}
                  lang={selectedFileContent.language || "text"}
                  filename={selectedFileContent.path}
                  onCopy={() => onToast?.("File content copied!")}
                  className="border-0 rounded-none"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
