export interface CodeBlock {
  lang: string;
  code: string;
  filename?: string;
}

export interface LinkCard {
  label: string;
  url: string;
  icon: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  codeBlocks?: CodeBlock[];
  links?: LinkCard[];
}

export interface Phase {
  id: number;
  num: string;
  title: string;
  duration: string;
  steps: Step[];
}
