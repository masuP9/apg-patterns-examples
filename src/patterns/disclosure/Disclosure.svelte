<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * APG Disclosure Pattern - Svelte Implementation
   *
   * A button that controls the visibility of a section of content.
   *
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
   */

  /**
   * Props for the Disclosure component
   */
  interface DisclosureProps {
    /** Unique identifier (recommended for SSR-safe aria-controls) */
    id?: string;
    /** Content displayed in the disclosure trigger button */
    trigger: string;
    /** Content displayed in the collapsible panel */
    children?: Snippet;
    /** When true, the panel is expanded on initial render */
    defaultExpanded?: boolean;
    /** When true, the disclosure cannot be expanded/collapsed */
    disabled?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Callback fired when the expanded state changes */
    onExpandedChange?: (expanded: boolean) => void;
  }

  let {
    id,
    trigger,
    children,
    defaultExpanded = false,
    disabled = false,
    className = '',
    onExpandedChange = () => {},
  }: DisclosureProps = $props();

  // Generate fallback ID if not provided (client-side only, may cause SSR mismatch)
  const instanceId = id ?? crypto.randomUUID();

  let expanded = $state(defaultExpanded);

  const panelId = `${instanceId}-panel`;

  function handleToggle() {
    if (disabled) return;

    expanded = !expanded;
    onExpandedChange(expanded);
  }
</script>

<div class="apg-disclosure {className}">
  <button
    type="button"
    aria-expanded={expanded}
    aria-controls={panelId}
    {disabled}
    class="apg-disclosure-trigger"
    onclick={handleToggle}
  >
    <span class="apg-disclosure-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 6 15 12 9 18" />
      </svg>
    </span>
    <span class="apg-disclosure-trigger-content">{trigger}</span>
  </button>
  <div
    id={panelId}
    class="apg-disclosure-panel"
    aria-hidden={!expanded}
    inert={!expanded ? true : undefined}
  >
    <div class="apg-disclosure-panel-content">
      {@render children?.()}
    </div>
  </div>
</div>
