import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

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
  /** Callback when tab selection changes */
  onSelectionChange?: (tabId: string) => void;
  /** Additional CSS class */
  className?: string;
}

export function Tabs({
  tabs,
  defaultSelectedId,
  orientation = "horizontal",
  activation = "automatic",
  onSelectionChange,
  className = "",
}: TabsProps): React.ReactElement {
  // availableTabsの安定化（パフォーマンス最適化）
  const availableTabs = useMemo(
    () => tabs.filter((tab) => !tab.disabled),
    [tabs]
  );

  const initialTab = defaultSelectedId
    ? availableTabs.find((tab) => tab.id === defaultSelectedId)
    : availableTabs[0];

  const [selectedId, setSelectedId] = useState(
    initialTab?.id || availableTabs[0]?.id
  );
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const index = availableTabs.findIndex((tab) => tab.id === initialTab?.id);
    return index >= 0 ? index : 0;
  });

  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const tablistId = useId();

  const handleTabSelection = useCallback(
    (tabId: string) => {
      setSelectedId(tabId);
      onSelectionChange?.(tabId);
    },
    [onSelectionChange]
  );

  const handleTabFocus = useCallback(
    (index: number) => {
      setFocusedIndex(index);
      const tab = availableTabs[index];
      if (tab) {
        tabRefs.current.get(tab.id)?.focus();
      }
    },
    [availableTabs]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event;
      const target = event.target;
      if (
        !tablistRef.current ||
        !(target instanceof Node) ||
        !tablistRef.current.contains(target)
      ) {
        return;
      }

      let newIndex = focusedIndex;
      let shouldPreventDefault = false;

      switch (key) {
        case "ArrowRight":
        case "ArrowDown":
          newIndex = (focusedIndex + 1) % availableTabs.length;
          shouldPreventDefault = true;
          break;

        case "ArrowLeft":
        case "ArrowUp":
          newIndex =
            (focusedIndex - 1 + availableTabs.length) % availableTabs.length;
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
      }

      if (shouldPreventDefault) {
        event.preventDefault();

        if (newIndex !== focusedIndex) {
          handleTabFocus(newIndex);

          if (activation === "automatic") {
            const newTab = availableTabs[newIndex];
            if (newTab) {
              handleTabSelection(newTab.id);
            }
          }
        }
      }
    },
    [focusedIndex, availableTabs, activation, handleTabSelection, handleTabFocus]
  );

  // フォーカス同期（Activation mode考慮）
  useEffect(() => {
    if (activation === "manual") {
      // Manual: tabsの変更により範囲外になった場合のみ修正
      if (focusedIndex >= availableTabs.length) {
        setFocusedIndex(Math.max(0, availableTabs.length - 1));
      }
      return;
    }

    // Automatic: 選択に追従
    const selectedIndex = availableTabs.findIndex(
      (tab) => tab.id === selectedId
    );
    if (selectedIndex >= 0 && selectedIndex !== focusedIndex) {
      setFocusedIndex(selectedIndex);
    }
  }, [selectedId, availableTabs, activation, focusedIndex]);

  const containerClass = `apg-tabs ${
    orientation === "vertical" ? "apg-tabs--vertical" : "apg-tabs--horizontal"
  } ${className}`.trim();

  const tablistClass = `apg-tablist ${
    orientation === "vertical"
      ? "apg-tablist--vertical"
      : "apg-tablist--horizontal"
  }`;

  return (
    <div className={containerClass}>
      <div
        ref={tablistRef}
        role="tablist"
        aria-orientation={orientation}
        className={tablistClass}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === selectedId;
          // APG準拠: Manual Activationではフォーカス位置でtabIndexを制御
          const isFocusTarget =
            activation === "manual"
              ? tab.id === availableTabs[focusedIndex]?.id
              : isSelected;
          const tabIndex = tab.disabled ? -1 : isFocusTarget ? 0 : -1;
          const tabPanelId = `${tablistId}-panel-${tab.id}`;

          const tabClass = `apg-tab ${
            orientation === "vertical"
              ? "apg-tab--vertical"
              : "apg-tab--horizontal"
          } ${isSelected ? "apg-tab--selected" : ""} ${
            tab.disabled ? "apg-tab--disabled" : ""
          }`.trim();

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) {
                  tabRefs.current.set(tab.id, el);
                } else {
                  tabRefs.current.delete(tab.id);
                }
              }}
              role="tab"
              type="button"
              id={`${tablistId}-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={isSelected ? tabPanelId : undefined}
              tabIndex={tabIndex}
              disabled={tab.disabled}
              className={tabClass}
              onClick={() => !tab.disabled && handleTabSelection(tab.id)}
            >
              <span className="apg-tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="apg-tabpanels">
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
              className={`apg-tabpanel ${
                isSelected ? "apg-tabpanel--active" : "apg-tabpanel--inactive"
              }`}
              tabIndex={isSelected ? 0 : -1}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
