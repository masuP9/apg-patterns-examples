import React from "react";
import clsx from "clsx";
import { type FrameworkType, getFrameworkInfo } from "../../types/framework";
import styles from "./styles.module.css";

interface FrameworkTabsProps {
  frameworks: FrameworkType[];
  activeFramework: FrameworkType;
  onFrameworkChange: (framework: FrameworkType) => void;
}

export function FrameworkTabs({
  frameworks,
  activeFramework,
  onFrameworkChange,
}: FrameworkTabsProps): JSX.Element {
  return (
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
            onClick={() => onFrameworkChange(framework)}
          >
            {info.label}
          </button>
        );
      })}
    </div>
  );
}