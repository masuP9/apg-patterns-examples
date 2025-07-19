import React, { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface DemoTabsProps {
  demoPath: string;
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
  demoPath,
  frameworks,
  defaultFramework = frameworks[0],
}: DemoTabsProps): JSX.Element {
  const [activeFramework, setActiveFramework] = useState(defaultFramework);
  const [isLoading, setIsLoading] = useState(true);

  const currentFramework = FRAMEWORK_INFO[activeFramework];
  
  // Use environment-aware URLs
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://masup9.github.io/apg-patterns-examples'
    : 'http://localhost';
  
  const demoUrls = {
    react: process.env.NODE_ENV === 'production' 
      ? `${baseUrl}/demos/react` 
      : "http://localhost:3001",
    svelte: process.env.NODE_ENV === 'production' 
      ? `${baseUrl}/demos/svelte` 
      : "http://localhost:3002",
    vue: process.env.NODE_ENV === 'production' 
      ? `${baseUrl}/demos/vue` 
      : "http://localhost:3003",
  };
  const demoUrl = demoUrls[activeFramework as keyof typeof demoUrls];

  const handleFrameworkChange = (framework: string) => {
    setIsLoading(true);
    setActiveFramework(framework);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [activeFramework]);

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoTabs}>
        {frameworks.map((framework) => {
          const info = FRAMEWORK_INFO[framework];
          return (
            <button
              key={framework}
              className={clsx(styles.demoTab, {
                [styles.active]: framework === activeFramework,
              })}
              onClick={() => handleFrameworkChange(framework)}
              style={{ "--framework-color": info.color } as React.CSSProperties}
            >
              <span
                className={styles.tabIcon}
                style={{ backgroundColor: info.color }}
              />
              {info.label}
            </button>
          );
        })}
      </div>

      <div className={styles.demoContent}>
        {isLoading && (
          <div className={styles.loadingState}>
            <span>Loading {currentFramework.label} demo...</span>
          </div>
        )}

        <iframe
          src={demoUrl}
          className={clsx(styles.demoIframe, {
            [styles.hidden]: isLoading,
          })}
          title={`${currentFramework.label} Demo`}
          onLoad={handleIframeLoad}
          sandbox="allow-scripts allow-same-origin"
        />
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
