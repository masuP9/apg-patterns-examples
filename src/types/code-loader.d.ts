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
  cacheTTL?: number;
  staticPath?: string;
}

export interface CacheEntry {
  data: PatternCodeData;
  timestamp: number;
  ttl: number;
}

export interface CodeCache {
  set(key: string, data: PatternCodeData, ttl?: number): void;
  get(key: string): PatternCodeData | null;
  has(key: string): boolean;
  clear(): void;
  getSize(): number;
  cleanup(): void;
}