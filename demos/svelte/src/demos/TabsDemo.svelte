<script lang="ts">
  import Tabs from "../components/Tabs/Tabs.svelte";

  const tabs = [
    {
      id: 'tab1',
      label: 'First Tab',
      content: 'First tab content'
    },
    {
      id: 'tab2', 
      label: 'Second Tab',
      content: 'Second tab content'
    },
    {
      id: 'tab3',
      label: 'Third Tab', 
      content: 'Third tab content'
    }
  ];
</script>

<div class="p-8 space-y-8">
  <Tabs
    {tabs}
    defaultSelectedId="tab1"
  />

  <Tabs
    tabs={tabs.slice(0, 2)}
    orientation="vertical"
    defaultSelectedId="tab1"
  />

  <Tabs
    {tabs}
    activation="manual"
    defaultSelectedId="tab1"
  />
</div>