import { expect, test } from "vitest";
import { formatDate } from "./KpGraph3";

test("date format", () => {
  process.env.TZ = "UTC";
  expect(formatDate("00-03UT", "Feb 01")).toBe("01.02 00:00");
});

test("date format with TZ", () => {
  process.env.TZ = "Europe/Moscow";
  expect(formatDate("00-03UT", "Feb 01")).toBe("01.02 03:00");
});
