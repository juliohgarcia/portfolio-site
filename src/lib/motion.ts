/**
 * Vocabulario de movimento do projeto.
 *
 * Ter duracoes e curvas em um so lugar e o que faz animacoes feitas em dias
 * diferentes parecerem parte do mesmo site. Numero solto no componente ("0.7")
 * e como cor em hexadecimal solta no meio do CSS: funciona, mas nao escala.
 */

/** Duracoes em segundos (o GSAP usa segundos, nao milissegundos). */
export const DURATION = {
  /** Microinteracoes: hover, cursor, toggle. */
  fast: 0.4,
  /** Padrao para a maioria das transicoes. */
  base: 0.8,
  /** Revelacao de texto e entradas de secao. */
  reveal: 1.0,
  /** Movimentos grandes e cinematograficos (hero, preloader). */
  slow: 1.4,
} as const;

/**
 * Curvas de easing.
 * `expoOut` e a assinatura do projeto: comeca rapido e assenta devagar,
 * o que da a sensacao de "peso" dos sites award-winning.
 * Os equivalentes em CSS estao em src/styles/index.css (--ease-out-expo).
 */
export const EASE = {
  expoOut: "expo.out",
  quartInOut: "power4.inOut",
  softOut: "power3.out",
  /** Para elementos que entram e precisam de um leve overshoot. */
  backOut: "back.out(1.4)",
} as const;

/**
 * Media queries usadas com `gsap.matchMedia()`.
 *
 * Por que matchMedia em vez de `if (prefersReducedMotion) return`:
 * o GSAP reverte sozinho as animacoes do bloco quando a media query deixa de
 * bater. Se a pessoa ativar "reduzir movimento" com o site aberto, o site se
 * adapta na hora, sem reload. Um `if` so e avaliado uma vez.
 *
 * Padrao de uso em qualquer componente:
 *
 *   useGSAP(() => {
 *     const mm = gsap.matchMedia();
 *     mm.add(MOTION_OK, () => { ... animacao completa ... });
 *     mm.add(MOTION_REDUCED, () => { ... estado final, sem tween ... });
 *     return () => mm.revert();
 *   }, { scope: ref });
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

/** Combina a preferencia de movimento com um breakpoint, para animacoes so no desktop. */
export const MOTION_OK_DESKTOP = "(prefers-reduced-motion: no-preference) and (width >= 48rem)";

/**
 * Leitura pontual da preferencia, para decisoes fora do GSAP — como nao
 * instanciar o Lenis. Para animacao, prefira sempre `gsap.matchMedia()`.
 * Protegido para SSR / ambientes sem `window`.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(MOTION_REDUCED).matches;
}
