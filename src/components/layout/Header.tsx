import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useContent } from "@/i18n/locale-context";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { LocaleToggle } from "./LocaleToggle";
import { Brand } from "./Brand";

/** Altura do header; usada como deslocamento para o titulo da secao nao ficar coberto. */
const HEADER_OFFSET = -88;

export function Header() {
  const { nav } = useContent();
  const { scrollTo, lenisRef } = useSmoothScroll();
  const root = useRef<HTMLElement>(null);
  const brand = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Guarda quem abriu o menu, para devolver o foco ao fechar — sem isso quem
  // navega por teclado volta para o inicio da pagina.
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // O header NAO se esconde mais ao rolar. Ele fazia isso ate o logo virar
  // fixo (Brand.tsx): sem a barra por tras, o logo flutuava sobre o
  // conteudo e colidia com titulos da mesma cor. A barra translucida e o
  // fundo que mantem o logo legivel em qualquer ponto da pagina.

  /**
   * Header e logo trocam de tema conforme a secao que passa por baixo.
   *
   * Cada secao clara (`.theme-light`) ganha um ScrollTrigger cuja janela e o
   * tempo em que ela cobre a faixa do logo — 44px, o meio do header de 88px.
   * Enquanto estiver ativo, header e logo recebem a mesma classe
   * `theme-light` da secao, e os tokens remapeados fazem o resto: texto
   * preto, barra cor de papel. Nenhuma cor e escrita em JavaScript.
   *
   * Fica FORA do `gsap.matchMedia()`: nao e animacao, e estado. Em movimento
   * reduzido a troca continua necessaria — sem ela o logo sumiria sobre o
   * papel. O que suaviza a troca e `transition-colors` no CSS, e a rede de
   * seguranca de movimento reduzido do index.css ja cuida dela.
   */
  useGSAP(() => {
    const targets = [root.current, brand.current].filter((el) => el !== null);
    const active = new Set<Element>();

    const triggers = gsap.utils.toArray<HTMLElement>(".theme-light").map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 44px",
        end: "bottom 44px",
        onToggle: (self) => {
          if (self.isActive) active.add(section);
          else active.delete(section);
          // Um Set e nao um booleano: com duas secoes claras encostadas, a
          // segunda entrando antes de a primeira sair nao pode "apagar" o tema.
          targets.forEach((el) => el.classList.toggle("theme-light", active.size > 0));
        },
      }),
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      targets.forEach((el) => el.classList.remove("theme-light"));
    };
  });

  /** Trava o scroll e gerencia foco e Escape enquanto o menu esta aberto. */
  useEffect(() => {
    if (!menuOpen) return;

    const lenis = lenisRef?.current;
    // Com Lenis, `stop()` e o caminho certo. Sem Lenis (movimento reduzido),
    // travamos o overflow do documento.
    if (lenis) lenis.stop();
    else document.documentElement.style.overflow = "hidden";

    // Capturamos o botao agora, para o cleanup nao depender do valor que o ref
    // tiver no futuro — o React avisa sobre isso com razao.
    const triggerButton = openButton.current;
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (lenis) lenis.start();
      else document.documentElement.style.overflow = "";
      // Devolve o foco a quem abriu o menu.
      triggerButton?.focus();
    };
  }, [menuOpen, lenisRef]);

  const goTo = (href: string) => {
    setMenuOpen(false);
    scrollTo(href, HEADER_OFFSET);
  };

  return (
    <>
      {/* Link para quem navega por teclado pular direto ao conteudo.
          Fica fora da tela ate receber foco. */}
      <a
        href="#conteudo"
        className="focus-visible:bg-lime focus-visible:text-ink sr-only-custom focus-visible:text-label focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[110] focus-visible:h-auto focus-visible:w-auto focus-visible:px-4 focus-visible:py-3 focus-visible:[clip-path:none]"
      >
        {nav.skipToContent}
      </a>

      <Brand ref={brand} onClick={() => scrollTo(0)} />

      <header
        ref={root}
        className="bg-ink/80 fixed top-0 right-0 left-0 z-50 backdrop-blur-md transition-colors duration-500"
      >
        <div className="container-page flex h-22 items-center justify-between">
          {/* Reserva o lugar do logo, que e fixo e fica fora do header (ver
              Brand.tsx). Sem isso o menu deslizaria para a esquerda. */}
          <span aria-hidden="true" className="w-28 md:w-40" />

          {/* Navegacao desktop */}
          <nav aria-label={nav.mainNavLabel} className="hidden md:block">
            <ul className="flex items-center gap-8">
              {nav.items.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => goTo(item.href)}
                    className="text-label text-paper-dim hover:text-paper transition-colors duration-200"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <LocaleToggle />
            <button
              ref={openButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label={nav.openMenu}
              className="text-label flex min-h-11 items-center md:hidden"
            >
              {nav.menuButton}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile em tela cheia */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={nav.openMenu}
          className="bg-ink fixed inset-0 z-[60] flex flex-col md:hidden"
        >
          <div className="container-page flex h-22 shrink-0 items-center justify-end">
            <button
              ref={closeButton}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={nav.closeMenu}
              className="text-label flex min-h-11 items-center"
            >
              {nav.closeButton}
            </button>
          </div>
          <nav aria-label={nav.mainNavLabel} className="container-page flex flex-1 items-center">
            <ul className="w-full space-y-2">
              {nav.items.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => goTo(item.href)}
                    className="text-expanded text-title flex min-h-14 w-full items-center text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
