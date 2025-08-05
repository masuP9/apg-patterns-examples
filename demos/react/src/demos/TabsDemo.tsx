import Tabs from "../components/Tabs/Tabs";

function TabsDemo() {
  const tabs = [
    {
      id: "tab1",
      label: "First Tab",
      content: <div>First tab content</div>
    },
    {
      id: "tab2",
      label: "Second Tab", 
      content: <div>Second tab content</div>
    },
    {
      id: "tab3",
      label: "Third Tab",
      content: <div>Third tab content</div>
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <Tabs
        tabs={tabs}
        defaultSelectedId="tab1"
      />
      
      <Tabs
        tabs={tabs.slice(0, 2)}
        orientation="vertical"
        defaultSelectedId="tab1"
      />
      
      <Tabs
        tabs={tabs}
        activation="manual"
        defaultSelectedId="tab1"
      />
    </div>
  );
}

export default TabsDemo;