<script lang="ts">
  import { untrack } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  interface RadioOption {
    id: string;
    label: string;
    value: string;
    disabled?: boolean;
  }

  interface RadioGroupProps {
    options: RadioOption[];
    name: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    defaultValue?: string;
    orientation?: 'horizontal' | 'vertical';
    onValueChange?: (value: string) => void;
    class?: string;
  }

  let {
    options,
    name,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    defaultValue = '',
    orientation = 'vertical',
    onValueChange = () => {},
    class: className,
  }: RadioGroupProps = $props();

  // Generate unique ID
  const instanceId = `radio-group-${Math.random().toString(36).slice(2, 9)}`;

  // Get enabled options
  function getEnabledOptions() {
    return options.filter((opt) => !opt.disabled);
  }

  // Find initial value
  function getInitialValue() {
    if (defaultValue) {
      const option = options.find((opt) => opt.value === defaultValue);
      if (option && !option.disabled) {
        return defaultValue;
      }
    }
    return '';
  }

  let selectedValue = $state(untrack(() => getInitialValue()));

  // Refs for focus management
  let radioRefs: Map<string, HTMLDivElement> = new SvelteMap();

  function radioRefAction(node: HTMLDivElement, value: string) {
    radioRefs.set(value, node);
    return {
      destroy() {
        radioRefs.delete(value);
      },
    };
  }

  // Get the tabbable radio value
  function getTabbableValue() {
    const enabledOptions = getEnabledOptions();
    if (selectedValue && enabledOptions.some((opt) => opt.value === selectedValue)) {
      return selectedValue;
    }
    return enabledOptions[0]?.value || '';
  }

  function getTabIndex(option: RadioOption): number {
    if (option.disabled) return -1;
    return option.value === getTabbableValue() ? 0 : -1;
  }

  // Focus a radio by value
  function focusRadio(value: string) {
    const radioEl = radioRefs.get(value);
    radioEl?.focus();
  }

  // Select a radio
  function selectRadio(value: string) {
    const option = options.find((opt) => opt.value === value);
    if (option && !option.disabled) {
      selectedValue = value;
      onValueChange(value);
    }
  }

  // Get enabled index of a value
  function getEnabledIndex(value: string) {
    return getEnabledOptions().findIndex((opt) => opt.value === value);
  }

  // Navigate and select
  function navigateAndSelect(direction: 'next' | 'prev' | 'first' | 'last', currentValue: string) {
    const enabledOptions = getEnabledOptions();
    if (enabledOptions.length === 0) return;

    let targetIndex: number;
    const currentIndex = getEnabledIndex(currentValue);

    switch (direction) {
      case 'next':
        targetIndex = currentIndex >= 0 ? (currentIndex + 1) % enabledOptions.length : 0;
        break;
      case 'prev':
        targetIndex =
          currentIndex >= 0
            ? (currentIndex - 1 + enabledOptions.length) % enabledOptions.length
            : enabledOptions.length - 1;
        break;
      case 'first':
        targetIndex = 0;
        break;
      case 'last':
        targetIndex = enabledOptions.length - 1;
        break;
    }

    const targetOption = enabledOptions[targetIndex];
    if (targetOption) {
      focusRadio(targetOption.value);
      selectRadio(targetOption.value);
    }
  }

  function handleKeyDown(event: KeyboardEvent, optionValue: string) {
    const { key } = event;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        navigateAndSelect('next', optionValue);
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        navigateAndSelect('prev', optionValue);
        break;

      case 'Home':
        event.preventDefault();
        navigateAndSelect('first', optionValue);
        break;

      case 'End':
        event.preventDefault();
        navigateAndSelect('last', optionValue);
        break;

      case ' ':
        event.preventDefault();
        selectRadio(optionValue);
        break;
    }
  }

  function handleClick(option: RadioOption) {
    if (!option.disabled) {
      focusRadio(option.value);
      selectRadio(option.value);
    }
  }
</script>

<div
  role="radiogroup"
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  aria-orientation={orientation === 'horizontal' ? 'horizontal' : undefined}
  class="apg-radio-group {className || ''}"
>
  <!-- Hidden input for form submission -->
  <input type="hidden" {name} value={selectedValue} />

  {#each options as option (option.id)}
    <div
      use:radioRefAction={option.value}
      role="radio"
      aria-checked={selectedValue === option.value}
      aria-disabled={option.disabled || undefined}
      aria-labelledby={`${instanceId}-label-${option.id}`}
      tabindex={getTabIndex(option)}
      class="apg-radio {selectedValue === option.value
        ? 'apg-radio--selected'
        : ''} {option.disabled ? 'apg-radio--disabled' : ''}"
      onclick={() => handleClick(option)}
      onkeydown={(e) => handleKeyDown(e, option.value)}
    >
      <span class="apg-radio-control" aria-hidden="true">
        <span class="apg-radio-indicator"></span>
      </span>
      <span id={`${instanceId}-label-${option.id}`} class="apg-radio-label">
        {option.label}
      </span>
    </div>
  {/each}
</div>
