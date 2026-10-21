import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MOTION_OK, SCENE_END, SCENE_START, SCRUB } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { useParallax } from "@/hooks/useParallax";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Sobre / a historia da transicao de suporte para desenvolvimento. */
export function About() {
  const { about } = useContent();
  const { locale } = useLocale();
  const root = useRef<HTMLElement>(null);

  useParallax(root);

  /**
   * Montagem por scroll.
   *
   * Cada destaque entra amarrado a propria posicao na tela (`trigger: item`),
   * nao a um gatilho unico da lista. O efeito e de pecas se encaixando uma a
   * uma conforme a pessoa desce, em vez de tudo aparecer de uma vez.
   */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>(".about-highlight");

        const tweens = items.map((item) =>
          gsap.from(item, {
            opacity: 0,
            y: 48,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: SCENE_START,
              end: SCENE_END,
              scrub: SCRUB,
            },
          }),
        );

        return () => tweens.forEach((tween) => tween.kill());
      });

      return () => mm.revert();
    },
    { dependencies: [locale], scope: root },
  );

  return (
    <section ref={root} id="sobre" className="container-page py-28 md:py-40">
      <SectionLabel>{about.label}</SectionLabel>

      <RevealText
        key={`${locale}-about-title`}
        as="h2"
        className="text-expanded text-display text-paper mt-8 max-w-4xl"
      >
        {about.title}
      </RevealText>

      <div className="mt-16 grid gap-14 md:grid-cols-12 md:gap-10">
        {/* Texto ocupa 7 das 12 colunas no desktop: linha de ~65 caracteres,
            que e a faixa confortavel de leitura. */}
        <div className="space-y-7 md:col-span-7">
          {about.paragraphs.map((text, index) => (
            <RevealText
              key={`${locale}-p-${index}`}
              className="text-lead text-paper-dim"
              delay={index * 0.05}
            >
              {text}
            </RevealText>
          ))}
        </div>

        {/* Os destaques sobem um pouco mais devagar que o texto, criando
            profundidade sem que nada pareca descolado. */}
        {/* `sticky` em CSS puro em vez de pin do ScrollTrigger: o navegador
            resolve nativamente, sem reescrever a altura do documento nem criar
            spacer, e continua correto se o conteudo mudar de tamanho na troca
            de idioma. Pin so vale quando se precisa de algo que o sticky nao
            faz. */}
        <ul className="about-highlights divide-ink-line md:col-span-4 md:col-start-9 md:sticky md:top-32 md:self-start md:divide-y">
          {about.highlights.map((highlight) => (
            <li key={highlight.label} className="about-highlight py-6 first:pt-0">
              <p className="text-expanded text-title text-lime">{highlight.value}</p>
              <p className="text-paper-dim mt-2 text-sm">{highlight.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
