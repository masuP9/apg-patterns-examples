import { getContext, setContext } from 'svelte';

export const TOOLBAR_CONTEXT_KEY = Symbol('toolbar');

export interface ToolbarContext {
  readonly orientation: 'horizontal' | 'vertical';
}

export function setToolbarContext(getOrientation: () => 'horizontal' | 'vertical'): void {
  const context: ToolbarContext = {
    get orientation() {
      return getOrientation();
    }
  };
  setContext<ToolbarContext>(TOOLBAR_CONTEXT_KEY, context);
}

export function getToolbarContext(): ToolbarContext | undefined {
  return getContext<ToolbarContext>(TOOLBAR_CONTEXT_KEY);
}
