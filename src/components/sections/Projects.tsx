import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MOTION_OK, SCRUB } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "./ProjectCard";

/**
 * Projetos com cards empilhados.
 *
 * ---------------------------------------------------------------------------
 * COMO O EMPILHAMENTO FUNCIONA
 * ---------------------------------------------------------------------------
 * Cada card e `position: sticky`. Ao chegar na altura definida por `top`, ele
 * para e espera; o proximo card sobe por baixo da pagina e o cobre. Como todos
 * tem fundo solido, a leitura e de um baralho sendo montado.
 *
 * O sticky e CSS puro — o navegador resolve, sem pin do ScrollTrigger, sem
 * spacer e sem reescrever a altura do documento. O GSAP entra so para a parte
 * que o CSS nao faz: encolher e apagar o card que ficou atras, dando
 * profundidade ao monte.
 *
 * Com um unico projeto o efeito simplesmente nao acontece — nao ha card atras
 * para cobrir. Ele liga sozinho quando o Julio adicionar o segundo.
 * ---------------------------------------------------------------------------
 */
export function Projects() {
  const { projects } = useContent();
  const { locale } = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");

        const tweens = cards.map((card, index) => {
          const next = cards[index + 1];
          // O ultimo card nunca e coberto: fica como esta.
          if (!next) return null;

          return gsap.to(card, {
            scale: 0.94,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 18%",
              // Termina exatamente quando o proximo card assume a posicao
              // fixa. Amarrar ao proximo elemento, em vez de uma distancia
              // fixa, mantem o efeito correto quando os cards tem alturas
              // diferentes — que e o caso, porque as descricoes variam.
              endTrigger: next,
              end: "top 18%",
              scrub: SCRUB,
            },
          });
        });

        return () => tweens.forEach((tween) => tween?.kill());
      });

      return () => mm.revert();
    },
    { dependencies: [locale], scope: root },
  );

  return (
    <section ref={root} id="projetos" className="container-page py-28 md:py-40">
      <SectionLabel>{projects.label}</SectionLabel>

      <RevealText
        key={`${locale}-proj-title`}
        as="h2"
        className="text-expanded text-display text-paper mt-8 max-w-3xl"
      >
        {projects.title}
      </RevealText>

      <RevealText key={`${locale}-proj-intro`} className="text-lead text-paper-dim mt-6 max-w-xl">
        {projects.intro}
      </RevealText>

      <ul className="mt-16 md:mt-24">
        {projects.items.map((project, index) => (
          <ProjectCard
            key={`${project.name}-${index}`}
            project={project}
            index={index}
            labels={{ viewRepo: projects.viewRepo, viewLive: projects.viewLive }}
          />
        ))}
      </ul>
    </section>
  );
}
