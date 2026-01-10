<template>
  <div class="apg-window-splitter-demo-wrapper">
    <KeyboardHints />

    <!-- Horizontal Splitter Demo -->
    <section class="apg-window-splitter-demo-section">
      <h2 class="apg-window-splitter-demo-title" id="horizontal-demo-label">Horizontal Splitter</h2>
      <div class="apg-window-splitter-demo-info">
        Position: {{ horizontalPosition }}% | Collapsed: {{ horizontalCollapsed ? 'Yes' : 'No' }}
      </div>
      <div
        class="apg-window-splitter-demo-container"
        data-testid="horizontal-demo"
        :style="{ '--splitter-position': `${horizontalPosition}%` }"
      >
        <div class="apg-window-splitter-pane" id="horizontal-primary">
          <div class="apg-window-splitter-pane-content">Primary Pane</div>
        </div>
        <WindowSplitter
          primary-pane-id="horizontal-primary"
          secondary-pane-id="horizontal-secondary"
          aria-labelledby="horizontal-demo-label"
          data-testid="horizontal-splitter"
          :default-position="50"
          @position-change="(pos) => (horizontalPosition = pos)"
          @collapsed-change="(col) => (horizontalCollapsed = col)"
        />
        <div class="apg-window-splitter-pane" id="horizontal-secondary">
          <div class="apg-window-splitter-pane-content">Secondary Pane</div>
        </div>
      </div>
    </section>

    <!-- Vertical Splitter Demo -->
    <section class="apg-window-splitter-demo-section">
      <h2 class="apg-window-splitter-demo-title" id="vertical-demo-label">Vertical Splitter</h2>
      <div class="apg-window-splitter-demo-info">
        Position: {{ verticalPosition }}% | Collapsed: {{ verticalCollapsed ? 'Yes' : 'No' }}
      </div>
      <div
        class="apg-window-splitter-demo-container apg-window-splitter-demo-container--vertical"
        data-testid="vertical-demo"
        :style="{ '--splitter-position': `${verticalPosition}%` }"
      >
        <div class="apg-window-splitter-pane" id="vertical-primary">
          <div class="apg-window-splitter-pane-content">Primary Pane</div>
        </div>
        <WindowSplitter
          primary-pane-id="vertical-primary"
          secondary-pane-id="vertical-secondary"
          orientation="vertical"
          aria-labelledby="vertical-demo-label"
          data-testid="vertical-splitter"
          :default-position="50"
          @position-change="(pos) => (verticalPosition = pos)"
          @collapsed-change="(col) => (verticalCollapsed = col)"
        />
        <div class="apg-window-splitter-pane" id="vertical-secondary">
          <div class="apg-window-splitter-pane-content">Secondary Pane</div>
        </div>
      </div>
    </section>

    <!-- Disabled Splitter Demo -->
    <section class="apg-window-splitter-demo-section">
      <h2 class="apg-window-splitter-demo-title" id="disabled-demo-label">Disabled Splitter</h2>
      <div
        class="apg-window-splitter-demo-container"
        data-testid="disabled-demo"
        style="--splitter-position: 30%"
      >
        <div class="apg-window-splitter-pane" id="disabled-primary">
          <div class="apg-window-splitter-pane-content">Primary Pane</div>
        </div>
        <WindowSplitter
          primary-pane-id="disabled-primary"
          secondary-pane-id="disabled-secondary"
          aria-labelledby="disabled-demo-label"
          data-testid="disabled-splitter"
          :default-position="30"
          disabled
        />
        <div class="apg-window-splitter-pane" id="disabled-secondary">
          <div class="apg-window-splitter-pane-content">Secondary Pane</div>
        </div>
      </div>
    </section>

    <!-- Readonly Splitter Demo -->
    <section class="apg-window-splitter-demo-section">
      <h2 class="apg-window-splitter-demo-title" id="readonly-demo-label">Readonly Splitter</h2>
      <div
        class="apg-window-splitter-demo-container"
        data-testid="readonly-demo"
        style="--splitter-position: 70%"
      >
        <div class="apg-window-splitter-pane" id="readonly-primary">
          <div class="apg-window-splitter-pane-content">Primary Pane</div>
        </div>
        <WindowSplitter
          primary-pane-id="readonly-primary"
          secondary-pane-id="readonly-secondary"
          aria-labelledby="readonly-demo-label"
          data-testid="readonly-splitter"
          :default-position="70"
          readonly
        />
        <div class="apg-window-splitter-pane" id="readonly-secondary">
          <div class="apg-window-splitter-pane-content">Secondary Pane</div>
        </div>
      </div>
    </section>

    <!-- Initially Collapsed Demo -->
    <section class="apg-window-splitter-demo-section">
      <h2 class="apg-window-splitter-demo-title" id="collapsed-demo-label">Initially Collapsed</h2>
      <div
        class="apg-window-splitter-demo-container"
        data-testid="collapsed-demo"
        style="--splitter-position: 0%"
      >
        <div class="apg-window-splitter-pane" id="collapsed-primary">
          <div class="apg-window-splitter-pane-content">Primary Pane</div>
        </div>
        <WindowSplitter
          primary-pane-id="collapsed-primary"
          secondary-pane-id="collapsed-secondary"
          aria-labelledby="collapsed-demo-label"
          data-testid="collapsed-splitter"
          default-collapsed
          :expanded-position="50"
        />
        <div class="apg-window-splitter-pane" id="collapsed-secondary">
          <div class="apg-window-splitter-pane-content">Secondary Pane</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WindowSplitter from './WindowSplitter.vue';
import KeyboardHints from './KeyboardHints.vue';

const horizontalPosition = ref(50);
const verticalPosition = ref(50);
const horizontalCollapsed = ref(false);
const verticalCollapsed = ref(false);
</script>
