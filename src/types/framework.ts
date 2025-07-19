/**
 * Framework information and utilities
 */

export type FrameworkType = "react" | "svelte" | "vue";

export interface FrameworkInfo {
  name: FrameworkType;
  label: string;
  color: string;
  extension?: string;
}

export const FRAMEWORK_INFO: Record<FrameworkType, FrameworkInfo> = {
  react: { 
    name: "react", 
    label: "React", 
    color: "var(--apg-react-color)",
    extension: "tsx" 
  },
  svelte: { 
    name: "svelte", 
    label: "Svelte", 
    color: "var(--apg-svelte-color)",
    extension: "svelte" 
  },
  vue: { 
    name: "vue", 
    label: "Vue", 
    color: "var(--apg-vue-color)",
    extension: "vue" 
  },
} as const;

/**
 * Get framework information by name
 */
export function getFrameworkInfo(framework: string): FrameworkInfo | undefined {
  return FRAMEWORK_INFO[framework as FrameworkType];
}

/**
 * Check if a string is a valid framework type
 */
export function isValidFramework(framework: string): framework is FrameworkType {
  return framework in FRAMEWORK_INFO;
}

/**
 * Get all available frameworks
 */
export function getAvailableFrameworks(): FrameworkType[] {
  return Object.keys(FRAMEWORK_INFO) as FrameworkType[];
}