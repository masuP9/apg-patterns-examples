import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 共通スタイルをインポート
import "../../shared/styles/base.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // eslint-disable-next-line no-console
  console.error("Failed to find root element");
}
