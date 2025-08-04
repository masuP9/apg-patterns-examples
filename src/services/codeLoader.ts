import type { PatternCodeData } from "../types/code-loader";
import { isPatternCodeData } from "../types/code-loader";

export class CodeLoaderService {
  private baseUrl: string;

  constructor(baseUrl: string = "/") {
    this.baseUrl = baseUrl;
  }

  async loadPatternCode(patternName: string): Promise<PatternCodeData | null> {
    try {
      const fetchUrl = `${this.baseUrl}code/${patternName}.json`;
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        throw new Error(
          `Expected JSON but received ${contentType}: ${responseText.substring(0, 100)}...`
        );
      }

      const data: unknown = await response.json();
      
      // Runtime type validation
      if (!isPatternCodeData(data)) {
        throw new Error("Invalid pattern code data format");
      }

      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load pattern code:", err);
      throw err;
    }
  }
}

// Factory function for React hooks
export const createCodeLoader = (baseUrl: string) => new CodeLoaderService(baseUrl);