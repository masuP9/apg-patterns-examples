import type { InjectionKey, ComputedRef } from 'vue';

export interface ToolbarContext {
  orientation: ComputedRef<'horizontal' | 'vertical'>;
}

export const ToolbarContextKey: InjectionKey<ToolbarContext> = Symbol('ToolbarContext');
