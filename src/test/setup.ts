import "@testing-library/jest-dom/vitest";
import { toHaveNoViolations } from "jest-axe";
import { expect } from "vitest";

// jest-axe マッチャーを追加
expect.extend(toHaveNoViolations);
