import { Navigate, createBrowserRouter } from "react-router-dom";
import ToggleButtonDemo from "./demos/ToggleButtonDemo";
import TabsDemo from "./demos/TabsDemo";
import { type DemoPath, getDemoUrl } from "../../../src/types/demo";

// 共通型定義を使用
export type DemoRoute = DemoPath;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={getDemoUrl("toggle-button")} replace />,
  },
  {
    path: getDemoUrl("toggle-button"),
    element: <ToggleButtonDemo />,
  },
  {
    path: getDemoUrl("tabs"),
    element: <TabsDemo />,
  },
  {
    path: getDemoUrl("accordion"),
    element: <div>Accordion Demo - Coming Soon</div>,
  },
  // 404 fallback
  {
    path: "*",
    element: <Navigate to={getDemoUrl("toggle-button")} replace />,
  },
], {
  basename: typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/",
});