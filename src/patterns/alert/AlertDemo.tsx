import { useState } from "react";
import { Alert, type AlertVariant } from "./Alert";

export function AlertDemo() {
  const [variant, setVariant] = useState<AlertVariant>("info");
  const [message, setMessage] = useState("");

  const messages: Record<AlertVariant, string> = {
    info: "This is an informational message.",
    success: "Operation completed successfully!",
    warning: "Please review your input before proceeding.",
    error: "An error occurred. Please try again.",
  };

  const showAlert = (v: AlertVariant) => {
    setVariant(v);
    setMessage(messages[v]);
  };

  const clearAlert = () => {
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <Alert
        message={message}
        variant={variant}
        dismissible
        onDismiss={clearAlert}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => showAlert("info")}
        >
          Info
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => showAlert("success")}
        >
          Success
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          onClick={() => showAlert("warning")}
        >
          Warning
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => showAlert("error")}
        >
          Error
        </button>
      </div>
    </div>
  );
}
