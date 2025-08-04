import { useId, useState } from "react";
import ToggleButton from "../components/Button/ToggleButton";

function ToggleButtonDemo() {
  const [notification, setNotification] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Generate unique IDs for accessibility
  const emailDescId = useId();
  const darkDescId = useId();

  return (
    <div className="apg-demo-container">
      <div className="apg-demo-section">
        <h1 className="apg-demo-title">Toggle Button Demo</h1>
        <p className="apg-demo-description">
          Interactive demonstration of accessible toggle buttons following the{" "}
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            WAI-ARIA Button Pattern
          </a>
          .
        </p>

        <div className="apg-button-group">
          <div>
            <p id={emailDescId} className="apg-toggle-button-description">
              Enable or disable email notifications for your account
            </p>
            <ToggleButton
              initialPressed={notification}
              onToggle={setNotification}
              aria-label="Toggle email notifications"
              aria-describedby={emailDescId}
            >
              📧 Email Notifications
            </ToggleButton>
          </div>

          <div>
            <p id={darkDescId} className="apg-toggle-button-description">
              Switch between light and dark theme
            </p>
            <ToggleButton
              initialPressed={darkMode}
              onToggle={setDarkMode}
              aria-label="Toggle dark mode"
              aria-describedby={darkDescId}
            >
              🌙 Dark Mode
            </ToggleButton>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Current State:
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            📧 Notifications:{" "}
            <strong>{notification ? "Enabled" : "Disabled"}</strong>
          </p>
          <p className="text-blue-800 dark:text-blue-200">
            🌙 Dark Mode: <strong>{darkMode ? "On" : "Off"}</strong>
          </p>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
            ✅ Accessibility Features:
          </h3>
          <ul className="text-green-800 dark:text-green-200 space-y-1 text-sm">
            <li>
              • Uses{" "}
              <code className="bg-green-100 dark:bg-green-800 px-1 rounded">
                aria-pressed
              </code>{" "}
              attribute
            </li>
            <li>• Keyboard support (Space/Enter)</li>
            <li>• Screen reader announcements</li>
            <li>• Focus management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ToggleButtonDemo;