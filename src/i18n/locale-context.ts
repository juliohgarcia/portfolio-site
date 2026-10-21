import { createContext, useContext } from "react";
import { CONTENT, type Locale, type SiteContent } from "@/content";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
};

/**
 * Contexto e hooks ficam neste arquivo (sem componentes) por causa do
 * Fast Refresh — ver a mesma nota em useSmoothScroll.ts.
 */
export const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Acesso ao idioma ativo e as funcoes de troca. */
export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale precisa estar dentro de <LocaleProvider>");
  }
  return value;
}

/**
 * Atalho para o conteudo do idioma ativo — e o hook que os componentes de
 * secao usam no dia a dia:
 *
 *   const { hero } = useContent();
 *   <h1>{hero.titleLines[0]}</h1>
 */
export function useContent(): SiteContent {
  const { locale } = useLocale();
  return CONTENT[locale];
}

/**
 * Descobre o idioma inicial, em ordem de prioridade:
 *   1. escolha salva da ultima visita;
 *   2. idioma do navegador;
 *   3. portugues.
 *
 * Fica fora do componente para poder ser usada como inicializador de
 * `useState`, o que evita um primeiro render no idioma errado seguido de
 * troca (que apareceria como um piscar de texto).
 */
export function detectInitialLocale(storageKey: string): Locale {
  if (typeof window === "undefined") return "pt";

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    // localStorage pode lancar em modo privado ou com cookies bloqueados.
    // Nao e motivo para derrubar o site: seguimos para a deteccao seguinte.
  }

  const browser = window.navigator.language?.toLowerCase() ?? "";
  return browser.startsWith("pt") ? "pt" : "en";
}
