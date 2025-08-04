import React from "react";
import clsx from "clsx";
import { type FrameworkType, getFrameworkInfo } from "../../types/framework";
import { type CodeTab } from "../../types/code-loader";
import styles from "./styles.module.css";

interface CodeTabsProps {
  activeTab: CodeTab;
  activeFramework: FrameworkType;
  availableTabs: {
    component: boolean;
    styles: boolean;
    usage: boolean;
  };
  onTabChange: (tab: CodeTab) => void;
}

export function CodeTabs({
  activeTab,
  activeFramework,
  availableTabs,
  onTabChange,
}: CodeTabsProps): JSX.Element {
  const currentFramework = getFrameworkInfo(activeFramework);

  return (
    <div className={styles.codeTabs}>
      {availableTabs.component && (
        <button
          className={clsx(styles.codeTab, {
            [styles.active]: activeTab === "component",
          })}
          onClick={() => onTabChange("component")}
        >
          Component ({currentFramework.extension})
        </button>
      )}
      
      {availableTabs.styles && (
        <button
          className={clsx(styles.codeTab, {
            [styles.active]: activeTab === "styles",
          })}
          onClick={() => onTabChange("styles")}
        >
          Styles (CSS)
        </button>
      )}
      
      {availableTabs.usage && (
        <button
          className={clsx(styles.codeTab, {
            [styles.active]: activeTab === "usage",
          })}
          onClick={() => onTabChange("usage")}
        >
          Usage
        </button>
      )}
    </div>
  );
}