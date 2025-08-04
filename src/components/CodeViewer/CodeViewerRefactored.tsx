import React, { useId, useMemo, useState } from "react";
import clsx from "clsx";
import { Highlight, themes } from "prism-react-renderer";
import { useColorMode } from "@docusaurus/theme-common";
import { type FrameworkType, getFrameworkInfo } from "../../types/framework";
import { type CodeTab, type FrameworkCode, getCodeForTab, getFrameworkCode } from "../../types/code-loader";
import { useCodeLoader } from "../../hooks/useCodeLoader";
import { useClipboard } from "../../hooks/useClipboard";
import { FrameworkTabs } from "./FrameworkTabs";
import { CodeTabs } from "./CodeTabs";
import styles from "./styles.module.css";

interface CodeViewerProps {
  frameworks: FrameworkType[];
  codeData?: Record<string, FrameworkCode>;
  pattern?: string;
  subPattern?: string;
  defaultFramework?: FrameworkType;
}

export function CodeViewerRefactored({
  frameworks,
  codeData,
  pattern,
  subPattern,
  defaultFramework = frameworks[0],
}: CodeViewerProps): JSX.Element {
  const [activeFramework, setActiveFramework] = useState(defaultFramework);
  const [activeTab, setActiveTab] = useState<CodeTab>("component");

  const { loadedCodeData, loading, error } = useCodeLoader(pattern, subPattern);
  const { copyStatus, copyMessage, copyToClipboard } = useClipboard();
  const { colorMode } = useColorMode();

  const copyFeedbackId = useId();
  const currentFramework = getFrameworkInfo(activeFramework);

  // Resolve data source (loaded vs static)
  const resolvedCodeData = useMemo(() => {
    if (pattern && loadedCodeData) {
      return loadedCodeData;
    }
    return codeData || {};
  }, [pattern, loadedCodeData, codeData]);

  const currentCode = getFrameworkCode(resolvedCodeData, activeFramework);
  
  const availableTabs = useMemo(() => ({
    component: Boolean(currentCode?.component),
    styles: Boolean(currentCode?.styles),
    usage: Boolean(currentCode?.usage),
  }), [currentCode]);

  // Auto-select first available tab if current is not available
  React.useEffect(() => {
    if (!availableTabs[activeTab]) {
      if (availableTabs.component) setActiveTab("component");
      else if (availableTabs.styles) setActiveTab("styles");
      else if (availableTabs.usage) setActiveTab("usage");
    }
  }, [activeFramework, availableTabs, activeTab]);

  const getLanguage = (tab: string, extension: string): string => {
    if (tab === "styles") return "css";
    if (tab === "usage") return extension === ".tsx" ? "tsx" : "javascript";
    return extension === ".tsx" ? "tsx" : extension === ".vue" ? "vue" : "javascript";
  };

  const handleCopyCode = () => {
    const code = getCodeForTab(currentCode, activeTab);
    void copyToClipboard(code);
  };

  if (loading) {
    return <div className={styles.loading}>Loading code...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading code: {error}</div>;
  }

  if (!currentCode?.component) {
    return <div className={styles.noCode}>No code available for {currentFramework.label}</div>;
  }

  return (
    <div className={styles.codeContainer}>
      <FrameworkTabs
        frameworks={frameworks}
        activeFramework={activeFramework}
        onFrameworkChange={setActiveFramework}
      />

      <CodeTabs
        activeTab={activeTab}
        activeFramework={activeFramework}
        availableTabs={availableTabs}
        onTabChange={setActiveTab}
      />

      <div className={styles.codeDisplay}>
        <div className={styles.codeHeader}>
          <span className={styles.codeType}>
            {activeTab === "component" && `${currentFramework.label} Component`}
            {activeTab === "styles" && "CSS Styles"}
            {activeTab === "usage" && "Usage Example"}
          </span>
          <button
            className={clsx(styles.copyButton, {
              [styles.copySuccess]: copyStatus === "success",
              [styles.copyError]: copyStatus === "error",
            })}
            onClick={handleCopyCode}
            title="Copy code to clipboard"
            aria-describedby={copyMessage ? copyFeedbackId : undefined}
          >
            📋 Copy
          </button>
        </div>

        <Highlight
          theme={colorMode === "dark" ? themes.dracula : themes.github}
          code={getCodeForTab(currentCode, activeTab)}
          language={getLanguage(activeTab, currentFramework.extension)}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>

        {/* Copy feedback for screen readers */}
        <div
          id={copyFeedbackId}
          className={styles.copyFeedback}
          role="status"
          aria-live="polite"
        >
          {copyMessage}
        </div>
      </div>
    </div>
  );
}