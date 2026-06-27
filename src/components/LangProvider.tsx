"use client";

import { createContext, useContext } from "react";
import { getDictionary, defaultLocale } from "@/i18n";
import type { Dict } from "@/i18n";

const DictContext = createContext<Dict>(getDictionary(defaultLocale));

export function LangProvider({ lang, children }: { lang: string; children: React.ReactNode }) {
  return (
    <DictContext.Provider value={getDictionary(lang)}>
      {children}
    </DictContext.Provider>
  );
}

export function useDict(): Dict {
  return useContext(DictContext);
}
