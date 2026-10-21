import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK } from "@/lib/motion";
import { useContent } from "@/i18n/locale-context";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { LocaleToggle } from "./LocaleToggle";

/** Altura do header; usada como deslocamento para o titulo da secao nao ficar coberto. */
const HEADER_OFFSET = -88;

export function Header() {
  const { nav } = useContent();
  const { scrollTo, lenisRef } = useSmoothScroll();
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Guarda quem abriu o menu, para devolver o foco ao fechar — sem isso quem
  // navega por teclado volta para o inicio da pagina.
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  /** Esconde o header ao rolar para baixo, revela ao rolar para cima. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const trigger = ScrollTrigger.create({
          start: "top -120",
          end: "max",
          onUpdate: (self) => {
            // Nunca esconde com o menu aberto: o botao de fechar iria embora.
            if (menuOpen) return;
            gsap.to(root.current, {
              yPercent: self.direction === 1 ? -100 : 0,
              duration: DURATION.fast,
              ease: EASE.expoOut,
            });
          },
          // Acima do topo o header esta sempre visivel.
          onLeaveBack: () => gsap.to(root.current, { yPercent: 0, duration: DURATION.fast }),
        });

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [menuOpen], scope: root },
  );

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

      <header ref={root} className="bg-ink/80 fixed top-0 right-0 left-0 z-50 backdrop-blur-md">
        <div className="container-page flex h-22 items-center justify-between">
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="text-expanded text-sm tracking-widest"
            data-cursor="topo"
          >
            JG
          </button>

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
              menu
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
              fechar
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
