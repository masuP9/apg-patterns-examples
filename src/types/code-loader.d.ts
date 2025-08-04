/**
 * Type definitions for code-loader plugin
 */

declare module "@docusaurus/useGlobalData" {
  interface GlobalData {
    "code-loader-plugin": {
      metadata: {
        patterns: string[];
        version: number;
      };
    };
  }
}

export interface FrameworkCode {
  component: string;
  styles?: string;
  usage?: string;
}

export interface PatternCodeData {
  [framework: string]: FrameworkCode;
}

export type CodeTab = "component" | "styles" | "usage";

// Type guard functions
export function isPatternCodeData(data: unknown): data is PatternCodeData {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  return Object.values(obj).every(framework => 
    typeof framework === "object" && 
    framework !== null &&
    typeof (framework as Record<string, unknown>).component === "string"
  );
}

// Safe access helper
export function getFrameworkCode(data: PatternCodeData, framework: string): FrameworkCode | null {
  const code = data[framework];
  return code || null;
}

// Safe code extraction
export function getCodeForTab(code: FrameworkCode | null, tab: CodeTab): string {
  if (!code) return "";
  return code[tab] || "";
}

export interface CodeLoaderConfig {
  patterns: string[];
  staticPath?: string;
}