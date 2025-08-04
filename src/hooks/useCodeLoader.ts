import { useCallback, useEffect, useState } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import type { PatternCodeData } from "../types/code-loader";
import { createCodeLoader } from "../services/codeLoader";

interface CodeLoaderPluginData {
  metadata: {
    patterns: string[];
    version: number;
  };
}

export function useCodeLoader(pattern?: string, subPattern?: string) {
  const [loadedCodeData, setLoadedCodeData] = useState<PatternCodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pluginData = usePluginData("code-loader-plugin") as CodeLoaderPluginData;
  const { siteConfig } = useDocusaurusContext();

  const loadPatternCode = useCallback(async (patternName: string): Promise<PatternCodeData | null> => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = siteConfig.baseUrl || "/";
      const codeLoader = createCodeLoader(baseUrl);
      const data = await codeLoader.loadPatternCode(patternName);
      
      setLoadedCodeData(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [siteConfig.baseUrl]);

  // Auto-load pattern data
  useEffect(() => {
    if (pattern) {
      const patternKey = subPattern
        ? `${pattern}${subPattern.charAt(0).toUpperCase() + subPattern.slice(1)}`
        : pattern;

      void loadPatternCode(patternKey);
    }
  }, [pattern, subPattern, pluginData?.metadata?.version, loadPatternCode]);

  return {
    loadedCodeData,
    loading,
    error,
    loadPatternCode,
  };
}