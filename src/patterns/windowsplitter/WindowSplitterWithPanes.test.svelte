<script lang="ts">
  import WindowSplitter from './WindowSplitter.svelte';

  interface Props {
    defaultPosition?: number;
    defaultCollapsed?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    orientation?: 'horizontal' | 'vertical';
    'aria-label'?: string;
    'aria-labelledby'?: string;
  }

  let {
    defaultPosition = 50,
    defaultCollapsed = false,
    disabled = false,
    readonly = false,
    orientation = 'horizontal',
    ...restProps
  }: Props = $props();
</script>

<div>
  <div id="primary">Primary Pane</div>
  <div id="secondary">Secondary Pane</div>
  <WindowSplitter
    primaryPaneId="primary"
    {defaultPosition}
    {defaultCollapsed}
    {disabled}
    {readonly}
    {orientation}
    {...restProps}
  />
</div>
