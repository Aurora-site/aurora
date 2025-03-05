import { expect, test } from "vitest";
import { getColorFromWeight, colorMap } from "./AuroraMap";

test("getColorFromWeight key in colorMap", () => {
  expect(getColorFromWeight(0.1, 1)).toBe(colorMap[0].rgbaColor);
  expect(getColorFromWeight(0.2, 1)).toBe(colorMap[1].rgbaColor);
  expect(getColorFromWeight(0.4, 1)).toBe(colorMap[2].rgbaColor);
  expect(getColorFromWeight(0.6, 1)).toBe(colorMap[3].rgbaColor);
  expect(getColorFromWeight(1, 1)).toBe(colorMap[4].rgbaColor);
});

test("getColorFromWeight with alpha", () => {
  expect(getColorFromWeight(-1, 0.5)).toBe("rgba(223, 276, 245, 0.5)");
  expect(getColorFromWeight(0, 0.5)).toBe("rgba(223, 276, 245, 0.5)");
  expect(getColorFromWeight(0.5, 0.5)).toBe("rgba(253, 196, 27, 0.5)");
  expect(getColorFromWeight(1, 0.5)).toBe("rgba(255, 67, 67, 0.5)");
  expect(getColorFromWeight(1.5, 0.5)).toBe("rgba(255, 67, 67, 0.5)");
});
