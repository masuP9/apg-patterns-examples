<script lang="ts">
  import Tabs from "../components/Tabs/Tabs.svelte";

  let selectedTab = 'tab1';

  const tabs = [
    {
      id: 'tab1',
      label: 'First Tab',
      content: 'This is the content for the first tab. It demonstrates the horizontal tab layout with automatic activation.'
    },
    {
      id: 'tab2', 
      label: 'Second Tab',
      content: 'This is the content for the second tab. Users can navigate using arrow keys.'
    },
    {
      id: 'tab3',
      label: 'Third Tab', 
      content: 'This is the content for the third tab. The component follows WAI-ARIA guidelines.'
    }
  ];
  
  function handleSelectionChange(event: CustomEvent<string>) {
    selectedTab = event.detail;
  }
</script>

<div class="apg-demo-container">
  <div class="apg-demo-section">
    <h1 class="apg-demo-title">Tabs Demo (Svelte)</h1>
    <p class="apg-demo-description">
      Interactive demonstration of accessible tabs following the
      <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noopener noreferrer"
        class="text-blue-600 underline hover:text-blue-800">
        WAI-ARIA Tabs Pattern
      </a> - implemented in Svelte.
    </p>

    <!-- Horizontal Tabs (Default) -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Horizontal Tabs</h2>
      <Tabs
        {tabs}
        defaultSelectedId="tab1"
        on:selectionChange={handleSelectionChange}
      />
    </section>

    <!-- Vertical Tabs -->
    <section style="margin-top: 2rem;">
      <h2 class="text-xl font-semibold mb-4">Vertical Tabs</h2>
      <Tabs
        tabs={tabs.slice(0, 2)}
        orientation="vertical"
        defaultSelectedId="tab1"
      />
    </section>

    <!-- Manual Activation -->
    <section style="margin-top: 2rem;">
      <h2 class="text-xl font-semibold mb-4">Manual Activation</h2>
      <p class="mb-4">Arrow keys move focus, Enter/Space activates tab</p>
      <Tabs
        {tabs}
        activation="manual"
        defaultSelectedId="tab1"
      />
    </section>

    <div class="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <h3 class="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
        ✅ Accessibility Features:
      </h3>
      <ul class="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
        <li>• Uses proper ARIA roles (tablist, tab, tabpanel)</li>
        <li>• Keyboard navigation with arrow keys</li>
        <li>• Roving tabindex for focus management</li>
        <li>• Screen reader announcements</li>
        <li>• Support for horizontal and vertical orientations</li>
        <li>• Automatic and manual activation modes</li>
      </ul>
    </div>
  </div>
</div>