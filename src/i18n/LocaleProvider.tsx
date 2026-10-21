import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { HTML_LANG } from "@/content";
import type { Locale } from "@/content";
import { LocaleContext, detectInitialLocale, type LocaleContextValue } from "./locale-context";

const STORAGE_KEY = "juliohgarcia:locale";

/**
 * Provider de idioma.
 *
 * Alem de guardar o idioma ativo, ele faz tres coisas que o toggle precisa
 * para nao ser apenas decorativo:
 *
 *   1. atualiza `<html lang>` — sem isso, leitores de tela continuam lendo
 *      o texto em ingles com pronuncia portuguesa (ou o contrario), e o
 *      navegador oferece traducao errada;
 *   2. atualiza `document.title` e a meta description;
 *   3. salva a escolha, para a segunda visita abrir no idioma certo.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale(STORAGE_KEY));

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem persistencia (modo privado): a troca ainda vale para esta sessao.
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "pt" ? "en" : "pt");
  }, [locale, setLocale]);

  // Sincroniza o idioma com o documento. Efeito e o lugar certo: sao
  // side effects no DOM fora da arvore do React.
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
