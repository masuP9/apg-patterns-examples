<script lang="ts">
  /**
   * Breadcrumb component following WAI-ARIA APG pattern
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
   */

  export interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  interface Props {
    items: BreadcrumbItem[];
    ariaLabel?: string;
    class?: string;
  }

  let { items, ariaLabel = 'Breadcrumb', class: className }: Props = $props();

  function getItemKey(item: BreadcrumbItem): string {
    return `${item.href ?? 'current'}-${item.label}`;
  }
</script>

{#if items.length > 0}
  <nav aria-label={ariaLabel} class="apg-breadcrumb {className ?? ''}">
    <ol class="apg-breadcrumb-list">
      {#each items as item, index (getItemKey(item))}
        <li class="apg-breadcrumb-item">
          {#if item.href && index !== items.length - 1}
            <a href={item.href} class="apg-breadcrumb-link">
              {item.label}
            </a>
          {:else}
            <span
              aria-current={index === items.length - 1 ? 'page' : undefined}
              class="apg-breadcrumb-current"
            >
              {item.label}
            </span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}
