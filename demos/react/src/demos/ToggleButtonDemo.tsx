import { useState } from "react";
import ToggleButton from "../components/Button/ToggleButton";

function ToggleButtonDemo() {
  const [notification, setNotification] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-8">
      <div className="flex gap-4">
        <ToggleButton
          initialPressed={notification}
          onToggle={setNotification}
          aria-label="Toggle email notifications"
        >
          📧 Email Notifications
        </ToggleButton>

        <ToggleButton
          initialPressed={darkMode}
          onToggle={setDarkMode}
          aria-label="Toggle dark mode"
        >
          🌙 Dark Mode
        </ToggleButton>
      </div>
    </div>
  );
}

export default ToggleButtonDemo;