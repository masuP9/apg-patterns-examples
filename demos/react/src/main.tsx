import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 共通スタイルをインポート
import "../../shared/styles/base.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
