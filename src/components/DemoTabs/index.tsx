import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { FRAMEWORK_INFO, type FrameworkType, getFrameworkInfo } from "../../types/framework";
import { type DemoPath, getDemoUrl } from "../../types/demo";

export interface DemoTabsProps {
  frameworks: FrameworkType[];
  defaultFramework?: FrameworkType;
  demoPath?: DemoPath;
}


const DemoTabs = React.memo(function DemoTabs({
  frameworks,
  defaultFramework = frameworks[0],
  demoPath = "toggle-button",
}: DemoTabsProps): JSX.Element {
  const [activeFramework, setActiveFramework] = useState(defaultFramework);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    () =>
      frameworks.reduce((acc, framework) => ({ ...acc, [framework]: true }), {})
  );
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});

  const currentFramework = getFrameworkInfo(activeFramework)!;

  // Use environment-aware URLs
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://masup9.github.io/apg-patterns-examples"
      : "http://localhost";

  // 型安全なURL生成
  const getDemoUrlForFramework = (framework: FrameworkType): string => {
    const baseUrls = {
      react: process.env.NODE_ENV === "production" ? `${baseUrl}/demos/react` : "http://localhost:3001/demos/react",
      svelte: process.env.NODE_ENV === "production" ? `${baseUrl}/demos/svelte` : "http://localhost:3002/demos/svelte", 
      vue: process.env.NODE_ENV === "production" ? `${baseUrl}/demos/vue` : "http://localhost:3003/demos/vue",
    };
    
    // Svelteはハッシュベースルーティング
    const urlPath = getDemoUrl(demoPath);
    if (framework === 'svelte') {
      return `${baseUrls[framework]}/#${urlPath}`;
    }
    
    return `${baseUrls[framework]}${urlPath}`;
  };

  const demoUrls = {
    react: getDemoUrlForFramework('react'),
    svelte: getDemoUrlForFramework('svelte'),
    vue: getDemoUrlForFramework('vue'),
  };
  const demoUrl = demoUrls[activeFramework];

  const handleFrameworkChange = useCallback((framework: FrameworkType) => {
    setActiveFramework(framework);
    // If this framework hasn't been loaded yet, show loading
    if (loadingStates[framework]) {
      setLoadingStates((prev) => ({ ...prev, [framework]: true }));
    }
  }, [loadingStates]);

  const handleIframeLoad = useCallback((framework: FrameworkType) => {
    setLoadingStates((prev) => ({ ...prev, [framework]: false }));
    setErrorStates((prev) => ({ ...prev, [framework]: false }));
  }, []);

  const handleIframeError = useCallback((framework: FrameworkType) => {
    setLoadingStates((prev) => ({ ...prev, [framework]: false }));
    setErrorStates((prev) => ({ ...prev, [framework]: true }));
  }, []);

  const isCurrentlyLoading = loadingStates[activeFramework];
  const hasCurrentError = errorStates[activeFramework];

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoTabs} role="tablist">
        {frameworks.map((framework) => {
          const frameworkInfo = getFrameworkInfo(framework);
          if (!frameworkInfo) return null;
          const { color, label } = frameworkInfo;
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

        {frameworks.map((framework) => {
          const info = getFrameworkInfo(framework);
          if (!info) return null;
          
          return (
            <iframe
              key={framework}
              src={demoUrls[framework]}
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
              title={`${info.label} Demo`}
              onLoad={() => handleIframeLoad(framework)}
              onError={() => handleIframeError(framework)}
              sandbox="allow-scripts allow-same-origin"
            />
          );
        })}
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
});

export default DemoTabs;
