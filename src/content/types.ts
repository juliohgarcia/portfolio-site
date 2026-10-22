/**
 * CONTRATO DE CONTEUDO
 *
 * `pt.ts` e `en.ts` declaram `satisfies SiteContent`. Isso significa que, se
 * voce adicionar um campo em um idioma e esquecer o outro, o `npm run build`
 * falha — em vez de o site ir ao ar com um pedaco em branco.
 *
 * Todo texto visivel do site mora aqui. Nenhuma string de conteudo deve
 * ficar escrita dentro de um componente: seria invisivel para o toggle
 * PT/EN e quebraria a traducao silenciosamente.
 */

export type Locale = "pt" | "en";

export const LOCALES: readonly Locale[] = ["pt", "en"] as const;

/** Mapeia nosso codigo curto para o valor do atributo `lang` do HTML. */
export const HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

export type NavItem = {
  /** Texto exibido no menu. */
  label: string;
  /** Seletor do alvo, ex: "#about". Precisa casar com o id da secao. */
  href: string;
};

export type Highlight = {
  /** Numero ou palavra curta em destaque, ex: "3+". */
  value: string;
  label: string;
};

export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  description: string;
  /** Tecnologias ou competencias, exibidas como chips. */
  tags: readonly string[];
};

export type Project = {
  name: string;
  year: string;
  description: string;
  tags: readonly string[];
  /** Links opcionais: o card se adapta a quantos existirem. */
  repoUrl?: string;
  liveUrl?: string;
  /**
   * Imagem REAL do projeto (print, nunca ilustracao generica). `src` vem de
   * um import de src/assets, para o Vite otimizar o nome e o cache.
   */
  image?: { src: string; alt: string; width: number; height: number };
};

export type SkillGroup = {
  name: string;
  items: readonly string[];
};

export type ContactLink = {
  label: string;
  /** Texto exibido, ex: "@juliohgarcia". */
  handle: string;
  href: string;
};

export type SiteContent = {
  /** Usado em document.title e na meta description ao trocar de idioma. */
  meta: {
    title: string;
    description: string;
  };

  nav: {
    items: readonly NavItem[];
    /** Rotulos acessiveis do botao de menu no mobile. */
    openMenu: string;
    closeMenu: string;
    /** Texto VISIVEL dos mesmos botoes — curto, cabe ao lado do PT/EN. */
    menuButton: string;
    closeButton: string;
    /** Rotulo do <nav>, lido por leitor de tela ao listar as regioes da pagina. */
    mainNavLabel: string;
    /** Primeiro link da pagina, visivel so ao receber foco por teclado. */
    skipToContent: string;
    /** Logo fixo no canto: nome em cima, sobrenome embaixo. */
    brand: { firstName: string; lastName: string; backToTop: string };
  };

  hero: {
    eyebrow: string;
    /** Cada string e uma linha da tipografia display. Mantenha-as curtas. */
    titleLines: readonly string[];
    subtitle: string;
    /**
     * Cartao de status no canto inferior direito do hero (StatusCard.tsx),
     * no lugar do antigo "role". `file` e o nome na aba de editor.
     */
    status: { label: string; file: string; headline: string; detail: string; footer: string };
    /**
     * As duas linhas grandes que correm por tras do hero quando ele encolhe
     * em cartao (ver Hero.tsx). Decorativas: repetem a ideia do titulo.
     */
    transition: { serif: string; sans: string };
    /** Rotulo acima da rubrica que se desenha no fim do hero. */
    signatureLabel: string;
  };

  about: {
    label: string;
    title: string;
    paragraphs: readonly string[];
    highlights: readonly Highlight[];
  };

  experience: {
    label: string;
    title: string;
    items: readonly ExperienceItem[];
  };

  projects: {
    label: string;
    /**
     * Titulo em duas vozes, como o "HELMETS / Hall of Fame" do Lando: a
     * primeira parte na grotesca, a segunda na serifa lime.
     */
    title: { sans: string; serif: string };
    intro: string;
    items: readonly Project[];
    /** Rotulos dos links dos cards. */
    viewRepo: string;
    viewLive: string;
  };

  skills: {
    label: string;
    title: string;
    intro: string;
    groups: readonly SkillGroup[];
  };

  contact: {
    label: string;
    title: string;
    invitation: string;
    email: string;
    links: readonly ContactLink[];
  };

  footer: {
    note: string;
    builtWith: string;
  };

  /**
   * Tecnologias da faixa horizontal abaixo do hero. Cada rotulo vira o logo
   * correspondente (busca em src/lib/tech-icons.ts) e continua sendo o nome
   * acessivel dele.
   */
  marquee: readonly string[];
};
