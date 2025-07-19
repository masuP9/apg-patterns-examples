import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { usePluginData } from "@docusaurus/useGlobalData";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { codeCache } from "./cache";
import type { PatternCodeData } from "../../types/code-loader";

interface CodeViewerProps {
  frameworks: string[];
  codeData?: Record<
    string,
    {
      component: string;
      styles?: string;
      usage?: string;
    }
  >;
  // Props for loading from plugin data
  pattern?: string;
  subPattern?: string;
  defaultFramework?: string;
}

interface CodeLoaderPluginData {
  metadata: {
    patterns: string[];
    version: number;
  };
}

const FRAMEWORK_INFO = {
  react: { name: "react", label: "React", extension: "tsx" },
  svelte: { name: "svelte", label: "Svelte", extension: "svelte" },
  vue: { name: "vue", label: "Vue", extension: "vue" },
};

export default function CodeViewer({
  frameworks,
  codeData,
  pattern,
  subPattern,
  defaultFramework = frameworks[0],
}: CodeViewerProps): JSX.Element {
  const [activeFramework, setActiveFramework] = useState(defaultFramework);
  const [activeTab, setActiveTab] = useState<"component" | "styles" | "usage">(
    "component"
  );
  const [loadedCodeData, setLoadedCodeData] = useState<PatternCodeData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get plugin metadata and Docusaurus context
  const pluginData = usePluginData(
    "code-loader-plugin"
  ) as CodeLoaderPluginData;
  const { siteConfig } = useDocusaurusContext();

  // Dynamic code loading function with cache
  const loadPatternCode = async (
    patternName: string
  ): Promise<PatternCodeData | null> => {
    // Check cache first
    const cacheKey = `pattern-${patternName}`;
    const cached = codeCache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for pattern: ${patternName}`);
      return cached;
    }

    try {
      setLoading(true);
      setError(null);

      // Use Docusaurus baseUrl for correct path resolution
      const baseUrl = siteConfig.baseUrl || '/';
      const fetchUrl = `${baseUrl}code/${patternName}.json`;
      console.log(`Fetching pattern from: ${fetchUrl}`);

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response received:', responseText.substring(0, 200));
        throw new Error(`Expected JSON but received ${contentType}: ${responseText.substring(0, 100)}...`);
      }

      const data = await response.json();

      // Cache the result
      codeCache.set(cacheKey, data);
      console.log(`Cached pattern: ${patternName}`);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`Failed to load pattern ${patternName}:`, errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load pattern data when pattern prop changes
  useEffect(() => {
    if (pattern) {
      const patternKey = subPattern
        ? `${pattern}${
            subPattern.charAt(0).toUpperCase() + subPattern.slice(1)
          }`
        : pattern;

      loadPatternCode(patternKey).then(setLoadedCodeData);
    }
  }, [pattern, subPattern, pluginData?.metadata?.version]);

  // Use loaded data if pattern is provided, otherwise use static codeData
  const resolvedCodeData = useMemo(() => {
    if (pattern && loadedCodeData) {
      return loadedCodeData;
    }
    return codeData || {};
  }, [pattern, loadedCodeData, codeData]);

  const currentFramework = FRAMEWORK_INFO[activeFramework];
  const currentCode = resolvedCodeData[activeFramework];

  // Loading state
  if (pattern && loading) {
    return (
      <div className={styles.codeContainer}>
        <div className={styles.loadingState}>
          <p>Loading code...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.codeContainer}>
        <div className={styles.errorState}>
          <p>Failed to load code: {error}</p>
          {pattern && (
            <p className={styles.errorDetails}>
              Pattern: {pattern}
              {subPattern && ` (${subPattern})`}
            </p>
          )}
        </div>
      </div>
    );
  }

  // No code data available
  if (!currentCode) {
    return (
      <div className={styles.codeContainer}>
        <div className={styles.errorState}>
          <p>
            Code not available for {currentFramework?.label || activeFramework}
          </p>
          {pattern && (
            <p className={styles.errorDetails}>
              Pattern: {pattern}
              {subPattern && ` (${subPattern})`}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.codeContainer}>
      {/* Framework Selection */}
      <div className={styles.frameworkTabs}>
        {frameworks.map((framework) => {
          const info = FRAMEWORK_INFO[framework];
          return (
            <button
              key={framework}
              className={clsx(styles.frameworkTab, {
                [styles.active]: framework === activeFramework,
              })}
              onClick={() => setActiveFramework(framework)}
            >
              {info.label}
            </button>
          );
        })}
      </div>

      {/* Code Type Tabs */}
      <div className={styles.codeTabs}>
        <button
          className={clsx(styles.codeTab, {
            [styles.active]: activeTab === "component",
          })}
          onClick={() => setActiveTab("component")}
        >
          Component ({currentFramework.extension})
        </button>
        {currentCode.styles && (
          <button
            className={clsx(styles.codeTab, {
              [styles.active]: activeTab === "styles",
            })}
            onClick={() => setActiveTab("styles")}
          >
            Styles (CSS)
          </button>
        )}
        {currentCode.usage && (
          <button
            className={clsx(styles.codeTab, {
              [styles.active]: activeTab === "usage",
            })}
            onClick={() => setActiveTab("usage")}
          >
            Usage
          </button>
        )}
      </div>

      {/* Code Display */}
      <div className={styles.codeContent}>
        <pre className={styles.codeBlock}>
          <code
            className={`language-${getLanguage(
              activeTab,
              currentFramework.extension
            )}`}
          >
            {currentCode[activeTab]}
          </code>
        </pre>
      </div>

      {/* Copy Button */}
      <button
        className={styles.copyButton}
        onClick={() =>
          navigator.clipboard.writeText(currentCode[activeTab] || "")
        }
        title="Copy code"
      >
        📋 Copy
      </button>
    </div>
  );
}

function getLanguage(tab: string, extension: string): string {
  switch (tab) {
    case "component":
      return extension === "tsx" ? "typescript" : extension;
    case "styles":
      return "css";
    case "usage":
      return "typescript";
    default:
      return "text";
  }
}
