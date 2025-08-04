import React, { useState, useCallback, useRef, useEffect, useId } from "react";
import clsx from "clsx";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  /** Array of tab items */
  tabs: TabItem[];
  /** Initially selected tab ID */
  defaultSelectedId?: string;
  /** Orientation of the tabs */
  orientation?: "horizontal" | "vertical";
  /** Activation mode */
  activation?: "automatic" | "manual";
  /** Whether tabs can be deleted */
  deletable?: boolean;
  /** Callback when tab selection changes */
  onSelectionChange?: (tabId: string) => void;
  /** Callback when tab is deleted */
  onTabDelete?: (tabId: string) => void;
  /** Additional CSS class */
  className?: string;
}

const Tabs = React.memo(function Tabs({
  tabs,
  defaultSelectedId,
  orientation = "horizontal",
  activation = "automatic",
  deletable = false,
  onSelectionChange,
  onTabDelete,
  className,
}: TabsProps): JSX.Element {
  // Find initial tab or use first available tab
  const initialTab = defaultSelectedId 
    ? tabs.find(tab => tab.id === defaultSelectedId && !tab.disabled)
    : tabs.find(tab => !tab.disabled);
  
  const [selectedId, setSelectedId] = useState(initialTab?.id || tabs[0]?.id);
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  
  // Generate unique IDs for accessibility
  const tablistId = useId();
  
  // Get available (non-disabled) tabs
  const availableTabs = tabs.filter(tab => !tab.disabled);

  const handleTabSelection = useCallback((tabId: string) => {
    setSelectedId(tabId);
    onSelectionChange?.(tabId);
  }, [onSelectionChange]);

  const handleTabFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    const tab = availableTabs[index];
    if (tab && tabRefs.current[tab.id]) {
      tabRefs.current[tab.id]?.focus();
    }
  }, [availableTabs]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { key } = event;
    
    // Only handle keyboard events if focus is on a tab
    if (!tablistRef.current?.contains(event.target as Node)) {
      return;
    }

    let newIndex = focusedIndex;
    let shouldPreventDefault = false;

    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
        newIndex = orientation === "horizontal" 
          ? (focusedIndex + 1) % availableTabs.length
          : (focusedIndex + 1) % availableTabs.length;
        shouldPreventDefault = true;
        break;
        
      case "ArrowLeft":
      case "ArrowUp":
        newIndex = orientation === "horizontal"
          ? (focusedIndex - 1 + availableTabs.length) % availableTabs.length
          : (focusedIndex - 1 + availableTabs.length) % availableTabs.length;
        shouldPreventDefault = true;
        break;
        
      case "Home":
        newIndex = 0;
        shouldPreventDefault = true;
        break;
        
      case "End":
        newIndex = availableTabs.length - 1;
        shouldPreventDefault = true;
        break;
        
      case "Enter":
      case " ":
        if (activation === "manual") {
          const focusedTab = availableTabs[focusedIndex];
          if (focusedTab) {
            handleTabSelection(focusedTab.id);
          }
        }
        shouldPreventDefault = true;
        break;
        
      case "Delete":
        if (deletable) {
          const focusedTab = availableTabs[focusedIndex];
          if (focusedTab) {
            onTabDelete?.(focusedTab.id);
          }
        }
        shouldPreventDefault = true;
        break;
    }

    if (shouldPreventDefault) {
      event.preventDefault();
      
      if (newIndex !== focusedIndex) {
        handleTabFocus(newIndex);
        
        // Automatic activation: select tab when focus moves
        if (activation === "automatic") {
          const newTab = availableTabs[newIndex];
          if (newTab) {
            handleTabSelection(newTab.id);
          }
        }
      }
    }
  }, [
    focusedIndex,
    availableTabs,
    orientation,
    activation,
    deletable,
    handleTabSelection,
    handleTabFocus,
    onTabDelete
  ]);

  // Update focused index when selected tab changes
  useEffect(() => {
    const selectedIndex = availableTabs.findIndex(tab => tab.id === selectedId);
    if (selectedIndex >= 0) {
      setFocusedIndex(selectedIndex);
    }
  }, [selectedId, availableTabs]);

  return (
    <div className={clsx(styles.tabsContainer, className, {
      [styles.vertical]: orientation === "vertical"
    })}>
      {/* Tablist */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-orientation={orientation}
        className={styles.tablist}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === selectedId;
          const tabIndex = tab.disabled ? -1 : (isSelected ? 0 : -1);
          const tabPanelId = `${tablistId}-panel-${tab.id}`;
          
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              type="button"
              id={`${tablistId}-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={isSelected ? tabPanelId : undefined}
              tabIndex={tabIndex}
              disabled={tab.disabled}
              className={clsx(styles.tab, {
                [styles.selected]: isSelected,
                [styles.disabled]: tab.disabled
              })}
              onClick={() => !tab.disabled && handleTabSelection(tab.id)}
            >
              <span className={styles.tabLabel}>{tab.label}</span>
              {deletable && !tab.disabled && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  aria-label={`Delete ${tab.label} tab`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabDelete?.(tab.id);
                  }}
                >
                  ×
                </button>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className={styles.tabpanels}>
        {tabs.map((tab) => {
          const isSelected = tab.id === selectedId;
          const tabPanelId = `${tablistId}-panel-${tab.id}`;
          
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={tabPanelId}
              aria-labelledby={`${tablistId}-tab-${tab.id}`}
              hidden={!isSelected}
              className={clsx(styles.tabpanel, {
                [styles.active]: isSelected
              })}
              tabIndex={isSelected ? 0 : -1}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Tabs;