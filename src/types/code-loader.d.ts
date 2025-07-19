/**
 * Type definitions for code-loader plugin
 */

declare module '@docusaurus/useGlobalData' {
  interface GlobalData {
    'code-loader-plugin': {
      metadata: {
        patterns: string[];
        version: number;
      };
    };
  }
}

export interface PatternCodeData {
  [framework: string]: {
    component: string;
    styles?: string;
    usage?: string;
  };
}

export interface CodeLoaderConfig {
  patterns: string[];
  staticPath?: string;
}