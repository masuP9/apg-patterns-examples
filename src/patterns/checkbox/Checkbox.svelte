<script lang="ts">
  import { untrack } from 'svelte';

  interface CheckboxProps {
    initialChecked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    onCheckedChange?: (checked: boolean) => void;
    [key: string]: unknown;
  }

  let {
    initialChecked = false,
    indeterminate: indeterminateProp = false,
    disabled = false,
    name,
    value,
    onCheckedChange = () => {},
    ...restProps
  }: CheckboxProps = $props();

  let checked = $state(untrack(() => initialChecked));
  let isIndeterminate = $state(untrack(() => indeterminateProp));
  let inputRef: HTMLInputElement | undefined = $state();

  // Update indeterminate property when ref or state changes
  $effect(() => {
    if (inputRef) {
      inputRef.indeterminate = isIndeterminate;
    }
  });

  // Sync with prop changes
  $effect(() => {
    isIndeterminate = indeterminateProp;
  });

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    checked = target.checked;
    isIndeterminate = false;
    onCheckedChange(checked);
  }
</script>

<span class="apg-checkbox {restProps.class || ''}" data-testid={restProps['data-testid']}>
  <input
    bind:this={inputRef}
    type="checkbox"
    class="apg-checkbox-input"
    {checked}
    {disabled}
    {name}
    {value}
    onchange={handleChange}
    {...restProps}
    data-testid={undefined}
  />
  <span class="apg-checkbox-control" aria-hidden="true">
    <span class="apg-checkbox-icon apg-checkbox-icon--check">
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="apg-checkbox-icon apg-checkbox-icon--indeterminate">
      <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 6H9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </span>
  </span>
</span>
