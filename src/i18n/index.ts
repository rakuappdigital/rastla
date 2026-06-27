import tr from "./tr";
import en from "./en";

export type Dict = typeof tr;
export type Locale = "tr" | "en";

export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

export function isLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}

export function getDictionary(lang: string): Dict {
  return lang === "en" ? en : tr;
}
