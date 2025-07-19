import React, { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface DemoTabsProps {
  frameworks: string[];
  defaultFramework?: string;
}

interface FrameworkInfo {
  name: string;
  label: string;
  color: string;
}

const FRAMEWORK_INFO: Record<string, FrameworkInfo> = {
  react: { name: "react", label: "React", color: "#61dafb" },
  svelte: { name: "svelte", label: "Svelte", color: "#ff3e00" },
  vue: { name: "vue", label: "Vue", color: "#4fc08d" },
};

export default function DemoTabs({
  frameworks,
  defaultFramework = frameworks[0],
}: DemoTabsProps): JSX.Element {
  const [activeFramework, setActiveFramework] = useState(defaultFramework);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    () =>
      frameworks.reduce((acc, framework) => ({ ...acc, [framework]: true }), {})
  );
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});

  const currentFramework = FRAMEWORK_INFO[activeFramework];

  // Use environment-aware URLs
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://masup9.github.io/apg-patterns-examples"
      : "http://localhost";

  const demoUrls = {
    react:
      process.env.NODE_ENV === "production"
        ? `${baseUrl}/demos/react`
        : "http://localhost:3001",
    svelte:
      process.env.NODE_ENV === "production"
        ? `${baseUrl}/demos/svelte`
        : "http://localhost:3002",
    vue:
      process.env.NODE_ENV === "production"
        ? `${baseUrl}/demos/vue`
        : "http://localhost:3003",
  };
  const demoUrl = demoUrls[activeFramework as keyof typeof demoUrls];

  const handleFrameworkChange = (framework: string) => {
    setActiveFramework(framework);
    // If this framework hasn't been loaded yet, show loading
    if (loadingStates[framework]) {
      setLoadingStates((prev) => ({ ...prev, [framework]: true }));
    }
  };

  const handleIframeLoad = (framework: string) => {
    setLoadingStates((prev) => ({ ...prev, [framework]: false }));
    setErrorStates((prev) => ({ ...prev, [framework]: false }));
  };

  const handleIframeError = (framework: string) => {
    setLoadingStates((prev) => ({ ...prev, [framework]: false }));
    setErrorStates((prev) => ({ ...prev, [framework]: true }));
  };

  const isCurrentlyLoading = loadingStates[activeFramework];
  const hasCurrentError = errorStates[activeFramework];

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoTabs} role="tablist">
        {frameworks.map((framework) => {
          const { color, label } = FRAMEWORK_INFO[framework];
          const isActive = framework === activeFramework;

          return (
            <button
              key={framework}
              className={clsx(styles.demoTab, { [styles.active]: isActive })}
              onClick={() => handleFrameworkChange(framework)}
              style={{ "--framework-color": color } as React.CSSProperties}
              role="tab"
              aria-selected={isActive}
            >
              <span
                className={styles.tabIcon}
                style={{ backgroundColor: color }}
              />
              {label}
            </button>
          );
        })}
      </div>

      <div className={styles.demoContent} role="tabpanel">
        {isCurrentlyLoading && (
          <div className={styles.loadingState}>
            <span>Loading {currentFramework.label} demo...</span>
          </div>
        )}

        {hasCurrentError && (
          <div className={styles.errorState}>
            <span>Failed to load {currentFramework.label} demo</span>
            <button
              onClick={() => {
                setErrorStates((prev) => ({
                  ...prev,
                  [activeFramework]: false,
                }));
                setLoadingStates((prev) => ({
                  ...prev,
                  [activeFramework]: true,
                }));
                // Force iframe reload by changing key
                window.location.reload();
              }}
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {frameworks.map((framework) => (
          <iframe
            key={framework}
            src={demoUrl}
            className={clsx(styles.demoIframe, {
              [styles.hidden]:
                framework !== activeFramework ||
                isCurrentlyLoading ||
                hasCurrentError,
              [styles.active]:
                framework === activeFramework &&
                !isCurrentlyLoading &&
                !hasCurrentError,
            })}
            title={`${FRAMEWORK_INFO[framework].label} Demo`}
            onLoad={() => handleIframeLoad(framework)}
            onError={() => handleIframeError(framework)}
            sandbox="allow-scripts allow-same-origin"
          />
        ))}
      </div>

      <div className={styles.demoInfo}>
        <p>
          Interactive demo showing the {currentFramework.label} implementation.
          The demo runs in an isolated environment with full accessibility
          support.
        </p>
      </div>
    </div>
  );
}
