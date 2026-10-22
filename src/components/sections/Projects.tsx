import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MOTION_OK, SCRUB } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContourField } from "@/components/ui/ContourField";
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
 *
 * A secao e uma folha verde-musgo, o mesmo musgo do hero, para tirar a pagina
 * do preto continuo: hero claro, musgo, preto, papel, musgo, preto. E o ritmo
 * de fundos alternados do landonorris.com. O titulo tem duas vozes (grotesca
 * + serifa lime), como o "HELMETS / Hall of Fame" de la.
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
    <section
      ref={root}
      id="projetos"
      // `bg-moss` + cantos arredondados: uma folha, como a Trajetoria, que
      // deixa o preto da pagina aparecer nas bordas. `isolate` mantem o
      // `-z-10` das curvas de nivel acima do fundo da secao, e
      // `overflow-clip` (nao `hidden`) recorta os cantos sem quebrar o
      // sticky do ContourField nem o dos cards.
      className="bg-moss relative isolate overflow-clip rounded-[2rem] md:rounded-[4rem]"
    >
      <ContourField />

      <div className="container-page py-28 md:py-40">
        <SectionLabel>{projects.label}</SectionLabel>

        {/* Duas vozes num titulo so. Cada parte e um RevealText proprio,
            porque cada uma tem fonte e cor diferentes; o <h2> em volta
            mantem uma unica entrada na estrutura de titulos da pagina. */}
        <h2 className="text-display mt-8 max-w-4xl">
          <RevealText
            key={`${locale}-proj-title-sans`}
            as="span"
            className="text-expanded text-paper block"
          >
            {projects.title.sans}
          </RevealText>
          <RevealText
            key={`${locale}-proj-title-serif`}
            as="span"
            // 1.15em: a serifa e mais estreita e tem olho menor; no mesmo
            // tamanho ela pareceria uma linha menor que a de cima.
            className="text-lime block font-serif text-[1.15em] uppercase"
          >
            {projects.title.serif}
          </RevealText>
        </h2>

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
      </div>
    </section>
  );
}
