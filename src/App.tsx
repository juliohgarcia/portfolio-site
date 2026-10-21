import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK, MOTION_REDUCED } from "@/lib/motion";
import { SmoothScroll, ScrollRefreshOnFontsReady } from "@/components/layout/SmoothScroll";
import { LocaleToggle } from "@/components/layout/LocaleToggle";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { DocumentMeta } from "@/i18n/DocumentMeta";
import { useContent, useLocale } from "@/i18n/locale-context";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * PAGINA DE TESTE DA FASE 1A — temporaria.
 *
 * Existe para provar tres coisas antes de qualquer secao real ser construida:
 *   1. o scroll suave funciona e o ScrollTrigger esta sincronizado com ele;
 *   2. o parallax nao treme (um unico loop de animacao);
 *   3. com "reduzir movimento" ativo, nada anima e TODO texto continua legivel.
 *
 * Sera substituida pelas secoes reais na Fase 1D.
 */
function Diagnostics() {
  const reduced = useReducedMotion();
  const { locale } = useLocale();

  return (
    <div className="border-ink-line bg-ink-soft fixed top-4 right-4 z-50 space-y-1 rounded border p-3 font-mono text-xs">
      <p>
        reduced-motion: <strong className="text-lime">{reduced ? "ON" : "off"}</strong>
      </p>
      <p>
        scroll: <strong className="text-lime">{reduced ? "nativo" : "lenis"}</strong>
      </p>
      <p>
        locale: <strong className="text-lime">{locale}</strong> · html lang:{" "}
        <strong className="text-lime">{document.documentElement.lang}</strong>
      </p>
      <div className="border-ink-line mt-2 border-t pt-2">
        <LocaleToggle />
      </div>
    </div>
  );
}

function TestSections() {
  const root = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  const { hero, about } = useContent();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Parallax: o bloco sobe mais devagar que a pagina.
        gsap.to(".test-parallax", {
          yPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: ".test-parallax",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        // Revelacao por scroll. Note `from`, nao `fromTo`: o estado escondido
        // e aplicado por JS neste instante. O texto nasce visivel no HTML.
        gsap.utils.toArray<HTMLElement>(".test-reveal").forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: DURATION.reveal,
            ease: EASE.expoOut,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      });

      mm.add(MOTION_REDUCED, () => {
        // Sem tween: so garante que tudo esta no estado final e visivel.
        gsap.set(".test-parallax, .test-reveal", { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className="container-page flex min-h-screen flex-col justify-center">
        <p className="text-label text-paper-dim mb-6">{hero.eyebrow}</p>
        <h1 className="text-expanded text-hero">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="text-lead text-paper-dim mt-8 max-w-xl">{hero.subtitle}</p>
        <button
          type="button"
          onClick={() => scrollTo("#alvo", -80)}
          className="text-label text-lime mt-10 self-start underline underline-offset-4"
        >
          Testar scrollTo →
        </button>
      </section>

      <section className="container-page min-h-screen py-32">
        <div className="test-parallax bg-ink-soft border-ink-line mb-24 border p-10">
          <p className="text-title">Bloco com parallax</p>
          <p className="text-paper-dim mt-2 text-sm">
            Role devagar: este bloco deve subir mais lentamente que a página, sem tremer.
          </p>
        </div>

        {about.paragraphs.map((text) => (
          <p key={text.slice(0, 24)} className="test-reveal text-lead mb-12 max-w-2xl">
            {text}
          </p>
        ))}
      </section>

      <section id="alvo" className="container-page flex min-h-screen items-center">
        <div>
          <p className="text-display text-expanded">Alvo do scrollTo</p>
          <p className="text-paper-dim text-lead mt-4 max-w-prose">
            Com movimento reduzido ativo, o salto até aqui é instantâneo e nativo — e os três
            “Reveal” acima continuam visíveis.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <DocumentMeta />
      <SmoothScroll>
        <ScrollRefreshOnFontsReady />
        <Diagnostics />
        <TestSections />
      </SmoothScroll>
    </LocaleProvider>
  );
}
