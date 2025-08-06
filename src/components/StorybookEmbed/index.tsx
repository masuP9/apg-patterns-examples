import React, { useCallback, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { type FrameworkType, getFrameworkInfo } from "../../types/framework";

export interface StorybookEmbedProps {
  frameworks: FrameworkType[];
  story: string; // e.g., "togglebutton--default"
  defaultFramework?: FrameworkType;
}

const StorybookEmbed = React.memo(function StorybookEmbed({
  frameworks,
  story,
  defaultFramework = frameworks[0],
}: StorybookEmbedProps): JSX.Element {
  const [activeFramework, setActiveFramework] = useState(defaultFramework);

  const baseUrls = React.useMemo(
    () => ({
      react:
        process.env.NODE_ENV === "production"
          ? "https://masup9.github.io/apg-patterns-examples/storybooks/react"
          : "http://localhost:6006",
      vue:
        process.env.NODE_ENV === "production"
          ? "https://masup9.github.io/apg-patterns-examples/storybooks/vue"
          : "http://localhost:6007",
      svelte:
        process.env.NODE_ENV === "production"
          ? "https://masup9.github.io/apg-patterns-examples/storybooks/svelte"
          : "http://localhost:6008",
    }),
    []
  );

  const getStorybookUrl = useCallback(
    (framework: FrameworkType) => {
      return `${baseUrls[framework]}/iframe.html?id=${story}&viewMode=story`;
    },
    [story, baseUrls]
  );

  const handleFrameworkChange = useCallback((framework: FrameworkType) => {
    setActiveFramework(framework);
  }, []);

  const currentFramework = getFrameworkInfo(activeFramework);

  return (
    <div className={styles.storybookContainer}>
      <div className={styles.storybookTabs} role="tablist">
        {frameworks.map((framework) => {
          const frameworkInfo = getFrameworkInfo(framework);
          if (!frameworkInfo) return null;
          const { color, label } = frameworkInfo;
          const isActive = framework === activeFramework;

          return (
            <button
              key={framework}
              className={clsx(styles.storybookTab, {
                [styles.active]: isActive,
              })}
              onClick={() => handleFrameworkChange(framework)}
              style={{ "--framework-color": color } satisfies React.CSSProperties}
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

      <div className={styles.storybookContent} role="tabpanel">
        <iframe
          src={getStorybookUrl(activeFramework)}
          className={styles.storybookIframe}
          title={`${currentFramework.label} Storybook`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
});

export default StorybookEmbed;
