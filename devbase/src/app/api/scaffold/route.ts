import { NextRequest, NextResponse } from "next/server";
import { getModelRouter } from "@/lib/ai/router";
import { nextjsTemplate } from "@/features/scaffold/templates/nextjs";
import { reactTemplate } from "@/features/scaffold/templates/react";
import { expoTemplate } from "@/features/scaffold/templates/expo";
import { nodejsTemplate } from "@/features/scaffold/templates/nodejs";
import type { ScaffoldRequest, AIMessage } from "@/types/ai";
import type { ProjectFile } from "@/types/project";

export const runtime = "nodejs";

function getBaseTemplate(template: string, projectName: string): ProjectFile[] {
  switch (template) {
    case "nextjs": return nextjsTemplate(projectName);
    case "react": return reactTemplate(projectName);
    case "expo": return expoTemplate(projectName);
    case "nodejs": return nodejsTemplate(projectName);
    default: return nextjsTemplate(projectName);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ScaffoldRequest = await req.json();
    const { projectName, template, prompt, aiAssisted = false } = body;

    if (!projectName || !template) {
      return NextResponse.json({ error: "projectName and template required" }, { status: 400 });
    }

    const baseFiles = getBaseTemplate(template, projectName);

    if (!aiAssisted || !prompt) {
      return NextResponse.json({ files: baseFiles, template, projectName });
    }

    const router = getModelRouter();
    const available = router.getAvailableProviders();

    if (available.length === 0) {
      return NextResponse.json({ files: baseFiles, template, projectName });
    }

    const systemPrompt = `You are a project scaffolding assistant. Given a project description, 
generate a customized ${template} project. Return a JSON array of files with this structure:
[{"path": "filename.ext", "language": "lang", "content": "file content"}]
Only return valid JSON, no other text.`;

    const userMessage: AIMessage = {
      id: "scaffold-1",
      role: "user",
      content: `Project name: ${projectName}
Template: ${template}
Description: ${prompt}

Generate the main application files for this project.`,
      timestamp: Date.now(),
    };

    try {
      const response = await router.completeChat(
        [userMessage],
        available[0],
        "",
        systemPrompt
      );

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const aiFiles: ProjectFile[] = JSON.parse(jsonMatch[0]);
        const mergedFiles = [...baseFiles];
        for (const aiFile of aiFiles) {
          const idx = mergedFiles.findIndex((f) => f.path === aiFile.path);
          if (idx >= 0) {
            mergedFiles[idx] = aiFile;
          } else {
            mergedFiles.push(aiFile);
          }
        }
        return NextResponse.json({ files: mergedFiles, template, projectName, aiAssisted: true });
      }
    } catch {
      // fallback to base template
    }

    return NextResponse.json({ files: baseFiles, template, projectName });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scaffold failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
