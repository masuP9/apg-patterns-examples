<script setup lang="ts">
/**
 * Breadcrumb component following WAI-ARIA APG pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  ariaLabel?: string;
  class?: string;
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  ariaLabel: 'Breadcrumb',
});

function getItemKey(item: BreadcrumbItem): string {
  return `${item.href ?? 'current'}-${item.label}`;
}
</script>

<template>
  <nav v-if="items.length > 0" :aria-label="ariaLabel" :class="['apg-breadcrumb', props.class]">
    <ol class="apg-breadcrumb-list">
      <li v-for="(item, index) in items" :key="getItemKey(item)" class="apg-breadcrumb-item">
        <a
          v-if="item.href && index !== items.length - 1"
          :href="item.href"
          class="apg-breadcrumb-link"
        >
          {{ item.label }}
        </a>
        <span
          v-else
          :aria-current="index === items.length - 1 ? 'page' : undefined"
          class="apg-breadcrumb-current"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
