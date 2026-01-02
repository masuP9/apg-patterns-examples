<script lang="ts" module>
  import type { Snippet } from "svelte";
  import type { AlertVariant } from "./alert-config";

  export type { AlertVariant };

  // Module-level counter for generating unique IDs
  let idCounter = 0;
  function generateId() {
    return `alert-${++idCounter}`;
  }

  export interface AlertProps {
    /**
     * Alert message content.
     * Changes to this prop trigger screen reader announcements.
     */
    message?: string;
    /**
     * Optional children for complex content.
     * Use message prop for simple text alerts.
     */
    children?: Snippet;
    /**
     * Alert variant for visual styling.
     * Does NOT affect ARIA - all variants use role="alert"
     */
    variant?: AlertVariant;
    /**
     * Custom ID for the alert container.
     * Auto-generated if not provided.
     */
    id?: string;
    /**
     * Whether to show dismiss button.
     * Note: Manual dismiss only - NO auto-dismiss per WCAG 2.2.3
     */
    dismissible?: boolean;
    /**
     * Additional class name for the alert container
     */
    class?: string;
  }
</script>

<script lang="ts">
  import { cn } from "@/lib/utils";
  import { Info, CircleCheck, AlertTriangle, OctagonAlert, X } from "lucide-svelte";
  import { variantStyles } from "./alert-config";

  let {
    message,
    children,
    variant = "info",
    id: providedId,
    dismissible = false,
    class: className = "",
    onDismiss,
  }: AlertProps & { onDismiss?: () => void } = $props();

  // Generate stable ID - use provided or generate once
  const generatedId = generateId();
  let alertId = $derived(providedId ?? generatedId);

  let hasContent = $derived(Boolean(message) || Boolean(children));
  let IconComponent = $derived(
    variant === "success" ? CircleCheck :
    variant === "warning" ? AlertTriangle :
    variant === "error" ? OctagonAlert :
    Info
  );

  function handleDismiss() {
    onDismiss?.();
  }
</script>

<div
  class={cn(
    "apg-alert",
    hasContent && [
      "relative flex items-start gap-3 px-4 py-3 rounded-lg border",
      "transition-colors duration-150",
      variantStyles[variant],
    ],
    !hasContent && "contents",
    className
  )}
>
  <!-- Live region - contains only content for screen reader announcement -->
  <div
    id={alertId}
    role="alert"
    class={cn(
      hasContent && "flex-1 flex items-start gap-3",
      !hasContent && "contents"
    )}
  >
    {#if hasContent}
      <span class="apg-alert-icon flex-shrink-0 mt-0.5" aria-hidden="true">
        <IconComponent class="size-5" />
      </span>
      <span class="apg-alert-content flex-1">
        {#if message}
          {message}
        {:else if children}
          {@render children()}
        {/if}
      </span>
    {/if}
  </div>
  <!-- Dismiss button - outside live region to avoid SR announcing it as part of alert -->
  {#if hasContent && dismissible}
    <button
      type="button"
      class={cn(
        "apg-alert-dismiss",
        "flex-shrink-0 min-w-11 min-h-11 p-2 -m-2 rounded",
        "flex items-center justify-center",
        "hover:bg-black/10 dark:hover:bg-white/10",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
      )}
      aria-label="Dismiss alert"
      onclick={handleDismiss}
    >
      <X class="size-5" aria-hidden="true" />
    </button>
  {/if}
</div>
