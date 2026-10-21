import { LOCALES, type Locale } from "@/content";
import { useLocale } from "@/i18n/locale-context";

const LABEL: Record<Locale, string> = { pt: "PT", en: "EN" };

/** Nome do idioma no PROPRIO idioma — e o que leitor de tela deve anunciar. */
const NATIVE_NAME: Record<Locale, string> = { pt: "Português", en: "English" };

const GROUP_LABEL: Record<Locale, string> = { pt: "Idioma", en: "Language" };

/**
 * Seletor de idioma.
 *
 * Decisoes de acessibilidade aqui:
 *
 * - Dois botoes em vez de um botao que alterna. Um botao "PT/EN" unico obriga
 *   a pessoa a adivinhar se o rotulo mostra o idioma atual ou o proximo.
 * - `aria-pressed` comunica qual esta ativo, em vez de depender so da cor.
 * - `lang` em cada botao faz o leitor de tela pronunciar "English" em ingles
 *   e "Português" em portugues, em vez de ler um com a fonetica do outro.
 * - `aria-hidden` no rotulo curto visual + nome completo no `sr-only-custom`:
 *   quem ve le "PT", quem ouve escuta "Português".
 * - Altura minima de 44px: alvo de toque confortavel no mobile.
 */
export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label={GROUP_LABEL[locale]}
      className="text-label flex items-center gap-1"
    >
      {LOCALES.map((code, index) => {
        const isActive = code === locale;

        return (
          <span key={code} className="flex items-center">
            {index > 0 && (
              <span aria-hidden="true" className="text-paper-dim/40 mr-1 select-none">
                /
              </span>
            )}
            <button
              type="button"
              lang={code}
              aria-pressed={isActive}
              onClick={() => setLocale(code)}
              className={[
                "flex min-h-11 items-center px-1 transition-colors duration-200",
                isActive ? "text-lime" : "text-paper-dim hover:text-paper",
              ].join(" ")}
            >
              <span aria-hidden="true">{LABEL[code]}</span>
              <span className="sr-only-custom">{NATIVE_NAME[code]}</span>
            </button>
          </span>
        );
      })}
    </div>
  );
}
