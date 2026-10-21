import type { Locale, SiteContent } from "./types";
import { pt } from "./pt";
import { en } from "./en";

/**
 * Mapa de conteudo por idioma.
 *
 * Tipado como `Record<Locale, SiteContent>`: adicionar um idioma em
 * `Locale` sem adicionar a entrada aqui vira erro de compilacao.
 */
export const CONTENT: Record<Locale, SiteContent> = { pt, en };

export type {
  Locale,
  SiteContent,
  NavItem,
  Highlight,
  ExperienceItem,
  Project,
  SkillGroup,
  ContactLink,
} from "./types";
export { LOCALES, HTML_LANG } from "./types";
