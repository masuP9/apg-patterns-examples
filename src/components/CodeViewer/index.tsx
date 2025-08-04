import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { usePluginData } from "@docusaurus/useGlobalData";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Highlight, themes } from "prism-react-renderer";
import { useColorMode } from "@docusaurus/theme-common";
import type { PatternCodeData } from "../../types/code-loader";
import { type FrameworkType, getFrameworkInfo } from "../../types/framework";

interface CodeViewerProps {
  frameworks: FrameworkType[];
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
  defaultFramework?: FrameworkType;
}

interface CodeLoaderPluginData {
  metadata: {
    patterns: string[];
    version: number;
  };
}


const CodeViewer = React.memo(function CodeViewer({
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
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [copyMessage, setCopyMessage] = useState<string>("");
  
  // Generate unique ID for accessibility
  const copyFeedbackId = useId();

  // Get plugin metadata and Docusaurus context
  const pluginData = usePluginData(
    "code-loader-plugin"
  ) as CodeLoaderPluginData;
  const { siteConfig } = useDocusaurusContext();

  // Simple code loading function
  const loadPatternCode = useCallback(async (
    patternName: string
  ): Promise<PatternCodeData | null> => {
    try {
      setLoading(true);
      setError(null);

      // Use Docusaurus baseUrl for correct path resolution
      const baseUrl = siteConfig.baseUrl || "/";
      const fetchUrl = `${baseUrl}code/${patternName}.json`;

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        throw new Error(
          `Expected JSON but received ${contentType}: ${responseText.substring(
            0,
            100
          )}...`
        );
      }

      const data: unknown = await response.json();
      
      // Runtime type validation would go here
      // For now, we trust the JSON structure matches PatternCodeData
      return data as PatternCodeData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [siteConfig.baseUrl]);

  // Load pattern data when pattern prop changes
  useEffect(() => {
    if (pattern) {
      const patternKey = subPattern
        ? `${pattern}${
            subPattern.charAt(0).toUpperCase() + subPattern.slice(1)
          }`
        : pattern;

      void loadPatternCode(patternKey).then(setLoadedCodeData);
    }
  }, [pattern, subPattern, pluginData?.metadata?.version, loadPatternCode]);

  // Use loaded data if pattern is provided, otherwise use static codeData
  const resolvedCodeData = useMemo(() => {
    if (pattern && loadedCodeData) {
      return loadedCodeData;
    }
    return codeData || {};
  }, [pattern, loadedCodeData, codeData]);

  const currentFramework = getFrameworkInfo(activeFramework);
  const currentCode = resolvedCodeData[activeFramework];
  const { colorMode } = useColorMode();

  const handleCopyCode = useCallback(async () => {
    try {
      setCopyStatus("idle");
      setCopyMessage("");
      await navigator.clipboard.writeText(currentCode[activeTab] || "");
      setCopyStatus("success");
      setCopyMessage("✅ Code copied to clipboard successfully!");
      setTimeout(() => {
        setCopyStatus("idle");
        setCopyMessage("");
      }, 3000);
    } catch (err) {
      setCopyStatus("error");
      setCopyMessage(
        "❌ Failed to copy code to clipboard. Please try again."
      );
      setTimeout(() => {
        setCopyStatus("idle");
        setCopyMessage("");
      }, 3000);
    }
  }, [currentCode, activeTab]);

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
          const info = getFrameworkInfo(framework);
          if (!info) return null;
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
        <Highlight
          theme={colorMode === "dark" ? themes.dracula : themes.github}
          code={currentCode[activeTab] || ""}
          language={getLanguage(activeTab, currentFramework.extension)}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={clsx(className, styles.codeBlock)} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className={styles.lineNumber}>{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>

        {/* Copy Button */}
        <button
          className={clsx(styles.copyButton, {
            [styles.copySuccess]: copyStatus === "success",
            [styles.copyError]: copyStatus === "error",
          })}
          onClick={() => void handleCopyCode()}
          title="Copy code to clipboard"
          aria-describedby={copyMessage ? copyFeedbackId : undefined}
        >
          📋 Copy
        </button>

        {/* Copy Feedback Message - Always present for screen readers */}
        <p
          id={copyFeedbackId}
          className={clsx(styles.copyFeedback, {
            [styles.copyFeedbackVisible]: !!copyMessage,
            [styles.copyFeedbackSuccess]: copyStatus === "success",
            [styles.copyFeedbackError]: copyStatus === "error",
          })}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {copyMessage && copyMessage}
        </p>
      </div>
    </div>
  );
});

export default CodeViewer;

function getLanguage(tab: string, extension: string): string {
  switch (tab) {
    case "component":
      switch (extension) {
        case "tsx":
          return "tsx";
        case "svelte":
          return "markup"; // Svelte uses HTML-like syntax
        case "vue":
          return "markup"; // Vue uses HTML-like syntax
        case "ts":
          return "typescript";
        case "js":
          return "javascript";
        default:
          return extension;
      }
    case "styles":
      return "css";
    case "usage":
      return "typescript";
    default:
      return "text";
  }
}
