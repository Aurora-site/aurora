import { expect, test } from "vitest";
import {
  getLangFromHref,
  getLangFromUrl,
  getLocalizedUrl,
  useTranslations,
} from "./utils";

test("getLangFromUrl", () => {
  expect(getLangFromUrl(new URL("http://localhost/en/"))).toBe("en");
  expect(getLangFromUrl(new URL("http://localhost/ru/?a=1"))).toBe("ru");
  expect(getLangFromUrl(new URL("http://localhost/en/app"))).toBe("en");
});

test("getLangFromHref", () => {
  expect(getLangFromHref("/en/")).toBe("en");
  expect(getLangFromHref("/ru/")).toBe("ru");
  expect(getLangFromHref("/en/app")).toBe("en");
});

test("useTranslations", () => {
  expect(useTranslations("en")("description.title")).toBe("Polar lights");
});

test("getLocalizedUrl", () => {
  expect(getLocalizedUrl("en", "/en/")).toBe("/en/");
  expect(getLocalizedUrl("ru", "/en/app")).toBe("/app/");
  expect(getLocalizedUrl("cn", "/en/app")).toBe("/cn/app/");
  expect(getLocalizedUrl("cn", "/en/app/")).toBe("/cn/app/");
});
