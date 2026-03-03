export interface ProjectFile {
  path: string;
  content: string;
  language?: string;
}

export type ProjectTemplate = "nextjs" | "react" | "expo" | "nodejs";

export interface Project {
  id: string;
  name: string;
  template: ProjectTemplate;
  files: ProjectFile[];
  createdAt: number;
  description?: string;
}
