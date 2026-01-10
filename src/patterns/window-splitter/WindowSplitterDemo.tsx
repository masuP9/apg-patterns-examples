import type { CSSProperties } from 'react';
import { useState } from 'react';
import { WindowSplitter } from './WindowSplitter';

// CSS custom properties type for splitter position
interface SplitterStyle extends CSSProperties {
  '--splitter-position': string;
}

function KeyboardHints() {
  return (
    <div className="apg-window-splitter-keyboard-hints">
      <div className="apg-window-splitter-keyboard-hints-title">Keyboard Navigation</div>
      <dl className="apg-window-splitter-keyboard-hints-list">
        <div className="apg-window-splitter-keyboard-hint">
          <dt>
            <kbd>←</kbd> / <kbd>→</kbd>
          </dt>
          <dd>Move horizontal splitter</dd>
        </div>
        <div className="apg-window-splitter-keyboard-hint">
          <dt>
            <kbd>↑</kbd> / <kbd>↓</kbd>
          </dt>
          <dd>Move vertical splitter</dd>
        </div>
        <div className="apg-window-splitter-keyboard-hint">
          <dt>
            <kbd>Shift</kbd> + Arrow
          </dt>
          <dd>Move by large step</dd>
        </div>
        <div className="apg-window-splitter-keyboard-hint">
          <dt>
            <kbd>Home</kbd> / <kbd>End</kbd>
          </dt>
          <dd>Move to min/max</dd>
        </div>
        <div className="apg-window-splitter-keyboard-hint">
          <dt>
            <kbd>Enter</kbd>
          </dt>
          <dd>Collapse/Expand</dd>
        </div>
      </dl>
    </div>
  );
}

export function WindowSplitterDemo() {
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [horizontalCollapsed, setHorizontalCollapsed] = useState(false);
  const [verticalCollapsed, setVerticalCollapsed] = useState(false);

  return (
    <div className="apg-window-splitter-demo-wrapper">
      <KeyboardHints />

      {/* Horizontal Splitter Demo */}
      <section className="apg-window-splitter-demo-section">
        <h2 className="apg-window-splitter-demo-title" id="horizontal-demo-label">
          Horizontal Splitter
        </h2>
        <div className="apg-window-splitter-demo-info">
          Position: {horizontalPosition}% | Collapsed: {horizontalCollapsed ? 'Yes' : 'No'}
        </div>
        <div
          className="apg-window-splitter-demo-container"
          data-testid="horizontal-demo"
          style={{ '--splitter-position': `${horizontalPosition}%` } satisfies SplitterStyle}
        >
          <div className="apg-window-splitter-pane" id="horizontal-primary">
            <div className="apg-window-splitter-pane-content">Primary Pane</div>
          </div>
          <WindowSplitter
            primaryPaneId="horizontal-primary"
            secondaryPaneId="horizontal-secondary"
            aria-labelledby="horizontal-demo-label"
            data-testid="horizontal-splitter"
            defaultPosition={50}
            onPositionChange={(pos) => setHorizontalPosition(pos)}
            onCollapsedChange={(col) => setHorizontalCollapsed(col)}
          />
          <div className="apg-window-splitter-pane" id="horizontal-secondary">
            <div className="apg-window-splitter-pane-content">Secondary Pane</div>
          </div>
        </div>
      </section>

      {/* Vertical Splitter Demo */}
      <section className="apg-window-splitter-demo-section">
        <h2 className="apg-window-splitter-demo-title" id="vertical-demo-label">
          Vertical Splitter
        </h2>
        <div className="apg-window-splitter-demo-info">
          Position: {verticalPosition}% | Collapsed: {verticalCollapsed ? 'Yes' : 'No'}
        </div>
        <div
          className="apg-window-splitter-demo-container apg-window-splitter-demo-container--vertical"
          data-testid="vertical-demo"
          style={{ '--splitter-position': `${verticalPosition}%` } satisfies SplitterStyle}
        >
          <div className="apg-window-splitter-pane" id="vertical-primary">
            <div className="apg-window-splitter-pane-content">Primary Pane</div>
          </div>
          <WindowSplitter
            primaryPaneId="vertical-primary"
            secondaryPaneId="vertical-secondary"
            orientation="vertical"
            aria-labelledby="vertical-demo-label"
            data-testid="vertical-splitter"
            defaultPosition={50}
            onPositionChange={(pos) => setVerticalPosition(pos)}
            onCollapsedChange={(col) => setVerticalCollapsed(col)}
          />
          <div className="apg-window-splitter-pane" id="vertical-secondary">
            <div className="apg-window-splitter-pane-content">Secondary Pane</div>
          </div>
        </div>
      </section>

      {/* Disabled Splitter Demo */}
      <section className="apg-window-splitter-demo-section">
        <h2 className="apg-window-splitter-demo-title" id="disabled-demo-label">
          Disabled Splitter
        </h2>
        <div
          className="apg-window-splitter-demo-container"
          data-testid="disabled-demo"
          style={{ '--splitter-position': '30%' } satisfies SplitterStyle}
        >
          <div className="apg-window-splitter-pane" id="disabled-primary">
            <div className="apg-window-splitter-pane-content">Primary Pane</div>
          </div>
          <WindowSplitter
            primaryPaneId="disabled-primary"
            secondaryPaneId="disabled-secondary"
            aria-labelledby="disabled-demo-label"
            data-testid="disabled-splitter"
            defaultPosition={30}
            disabled
          />
          <div className="apg-window-splitter-pane" id="disabled-secondary">
            <div className="apg-window-splitter-pane-content">Secondary Pane</div>
          </div>
        </div>
      </section>

      {/* Readonly Splitter Demo */}
      <section className="apg-window-splitter-demo-section">
        <h2 className="apg-window-splitter-demo-title" id="readonly-demo-label">
          Readonly Splitter
        </h2>
        <div
          className="apg-window-splitter-demo-container"
          data-testid="readonly-demo"
          style={{ '--splitter-position': '70%' } satisfies SplitterStyle}
        >
          <div className="apg-window-splitter-pane" id="readonly-primary">
            <div className="apg-window-splitter-pane-content">Primary Pane</div>
          </div>
          <WindowSplitter
            primaryPaneId="readonly-primary"
            secondaryPaneId="readonly-secondary"
            aria-labelledby="readonly-demo-label"
            data-testid="readonly-splitter"
            defaultPosition={70}
            readonly
          />
          <div className="apg-window-splitter-pane" id="readonly-secondary">
            <div className="apg-window-splitter-pane-content">Secondary Pane</div>
          </div>
        </div>
      </section>

      {/* Initially Collapsed Demo */}
      <section className="apg-window-splitter-demo-section">
        <h2 className="apg-window-splitter-demo-title" id="collapsed-demo-label">
          Initially Collapsed
        </h2>
        <div
          className="apg-window-splitter-demo-container"
          data-testid="collapsed-demo"
          style={{ '--splitter-position': '0%' } satisfies SplitterStyle}
        >
          <div className="apg-window-splitter-pane" id="collapsed-primary">
            <div className="apg-window-splitter-pane-content">Primary Pane</div>
          </div>
          <WindowSplitter
            primaryPaneId="collapsed-primary"
            secondaryPaneId="collapsed-secondary"
            aria-labelledby="collapsed-demo-label"
            data-testid="collapsed-splitter"
            defaultCollapsed
            expandedPosition={50}
          />
          <div className="apg-window-splitter-pane" id="collapsed-secondary">
            <div className="apg-window-splitter-pane-content">Secondary Pane</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WindowSplitterDemo;
