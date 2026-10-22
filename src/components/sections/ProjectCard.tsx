import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK_DESKTOP } from "@/lib/motion";
import type { Project } from "@/content";
import { isPlaceholder, resolved } from "@/content/placeholders";
import { TechIcon } from "@/components/ui/TechIcon";
import { useElementSize } from "@/hooks/useElementSize";

type ProjectCardProps = {
  project: Project;
  index: number;
  labels: { viewRepo: string; viewLive: string };
};

/** Aba recortada no canto inferior direito, onde ficam o numero e o ano. */
const NOTCH_W = 140;
const NOTCH_H = 34;
/** Raio dos cantos e largura da curva que desce da aba para a base. */
const RADIUS = 18;
const CURVE = 30;

/**
 * Contorno do card com a aba — a mesma familia do cartao `status.ts` do
 * hero, so que com a aba embaixo, como os cards de capacete do Lando.
 *
 * Por que SVG e nao `border` do CSS: `border-radius` so arredonda para
 * FORA. A aba precisa de um degrau com curva para dentro, e isso o CSS nao
 * desenha. O caminho e refeito com as medidas reais do card (useElementSize),
 * porque esticar um SVG fixo deformaria as curvas.
 *
 * A base e baixa a esquerda e sobe antes da aba: o rotulo ocupa o recorte.
 */
function tabbedOutline(width: number, height: number): string {
  // 0.5 de recuo: a linha de 1px cai inteira num pixel em vez de borrar.
  const left = 0.5;
  const top = 0.5;
  const right = width - 0.5;
  const bottom = height - 0.5;
  const raised = bottom - NOTCH_H;
  const notchStart = right - NOTCH_W;

  return [
    `M ${left + RADIUS} ${top}`,
    `L ${right - RADIUS} ${top}`,
    `Q ${right} ${top} ${right} ${top + RADIUS}`,
    `L ${right} ${raised - RADIUS}`,
    `Q ${right} ${raised} ${right - RADIUS} ${raised}`,
    `L ${notchStart} ${raised}`,
    // O degrau: um S suave descendo da altura da aba ate a base.
    `C ${notchStart - CURVE / 2} ${raised} ${notchStart - CURVE / 2} ${bottom} ${notchStart - CURVE} ${bottom}`,
    `L ${left + RADIUS} ${bottom}`,
    `Q ${left} ${bottom} ${left} ${bottom - RADIUS}`,
    `L ${left} ${top + RADIUS}`,
    `Q ${left} ${top} ${left + RADIUS} ${top}`,
    "Z",
  ].join(" ");
}

/**
 * Card de projeto com hover animado.
 *
 * O hover do titulo e da seta e feito em JS (GSAP) e nao em CSS porque as
 * duas coisas precisam ficar em sincronia; qualquer ajuste de tempo passaria
 * a exigir editar dois lugares. A borda que acende e a imagem que se aproxima
 * sao CSS puro (`group-hover`), porque cada uma e uma transicao so.
 *
 * `MOTION_OK_DESKTOP` em vez de `MOTION_OK`: hover nao existe em touch, e
 * registrar os listeners no mobile seria custo sem retorno.
 *
 * Campos ainda nao preenchidos ({{...}}) nao viram link: `href="{{URL_REPO}}"`
 * seria um link quebrado no ar.
 */
export function ProjectCard({ project, index, labels }: ProjectCardProps) {
  const root = useRef<HTMLLIElement>(null);
  const { width, height } = useElementSize(root);

  const repoUrl = resolved(project.repoUrl);
  const liveUrl = resolved(project.liveUrl);
  const isDraft = isPlaceholder(project.name);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK_DESKTOP, () => {
        const arrow = el.querySelector(".card-arrow");
        const title = el.querySelector(".card-title");

        const tl = gsap
          .timeline({ paused: true })
          .to(title, { x: 16, duration: DURATION.fast, ease: EASE.expoOut }, 0)
          .to(arrow, { x: 8, opacity: 1, duration: DURATION.fast, ease: EASE.expoOut }, 0);

        const play = () => tl.play();
        const reverse = () => tl.reverse();

        el.addEventListener("pointerenter", play);
        el.addEventListener("pointerleave", reverse);
        // `focusin`/`focusout` espelham o hover para navegacao por teclado:
        // quem chega no card com Tab ve a mesma resposta visual.
        el.addEventListener("focusin", play);
        el.addEventListener("focusout", reverse);

        return () => {
          el.removeEventListener("pointerenter", play);
          el.removeEventListener("pointerleave", reverse);
          el.removeEventListener("focusin", play);
          el.removeEventListener("focusout", reverse);
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <li
      ref={root}
      // `sticky`: o card para na altura do topo e o proximo sobe por cima
      // dele. O fundo solido vem do `fill` do contorno em SVG, que ocupa o
      // card inteiro. `origin-top` faz o encolhimento recuar em vez de puxar
      // o card para o centro.
      //
      // `motion-safe:` e importante aqui. O sticky nao e animacao, mas cria
      // sobreposicao de conteudo — e sem o GSAP para encolher e apagar o card
      // de tras (que nao roda em movimento reduzido), o empilhamento perderia
      // a pista visual de profundidade e viraria so cards se cobrindo. Em
      // movimento reduzido a lista volta a ser uma lista.
      //
      // `isolate`: o contorno em SVG usa `-z-10` para ficar atras do texto;
      // sem um contexto de empilhamento no proprio card, ele cairia atras do
      // fundo da secao e sumiria.
      className="project-card group relative isolate origin-top motion-safe:sticky motion-safe:top-[18vh]"
    >
      {width > 0 && (
        <svg
          aria-hidden="true"
          width={width}
          height={height}
          // A cor da borda vem de `currentColor`: apagada em repouso, lime no
          // hover e no foco. `focus-within` cobre quem chega pelo teclado.
          className="text-paper/20 group-focus-within:text-lime group-hover:text-lime absolute inset-0 -z-10 transition-colors duration-300"
        >
          <path
            d={tabbedOutline(width, height)}
            fill="var(--color-moss)"
            stroke="currentColor"
            strokeWidth={1}
          />
        </svg>
      )}

      <div className="px-6 pt-8 pb-16 md:px-10 md:pt-10">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <h3 className="card-title text-expanded text-display text-paper min-w-0">
            {isDraft ? (
              // Placeholder visivelmente marcado: melhor um "em breve"
              // honesto do que um nome falso que o Julio pode esquecer.
              // 3.25:1 de contraste — reprovaria para texto de 16px, mas
              // aqui e text-display (bem acima de 24px), faixa em que o AA
              // exige 3:1. Nao reutilize esta opacidade em texto corrido.
              <span className="text-paper-dim/70">{project.name}</span>
            ) : (
              project.name
            )}
          </h3>
          <span
            aria-hidden="true"
            className="card-arrow text-lime text-title hidden opacity-0 md:inline"
          >
            →
          </span>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-paper-dim leading-relaxed">{project.description}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags
                .filter((tag) => !isPlaceholder(tag))
                .map((tag) => (
                  <li
                    key={tag}
                    className="group/tech border-paper/15 text-paper-dim hover:text-paper flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors duration-200"
                  >
                    <TechIcon label={tag} collapseMissing />
                    {tag}
                  </li>
                ))}
            </ul>

            {(repoUrl ?? liveUrl) && (
              <div className="mt-7 flex flex-wrap gap-6">
                {repoUrl && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    // `noreferrer` junto de `noopener`: o primeiro tambem evita
                    // vazar a URL de origem no cabecalho Referer.
                    rel="noopener noreferrer"
                    data-cursor={labels.viewRepo}
                    className="text-label text-paper hover:text-lime inline-flex min-h-11 items-center underline underline-offset-4 transition-colors"
                  >
                    {labels.viewRepo}
                  </a>
                )}
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={labels.viewLive}
                    className="text-label text-paper hover:text-lime inline-flex min-h-11 items-center underline underline-offset-4 transition-colors"
                  >
                    {labels.viewLive}
                  </a>
                )}
              </div>
            )}
          </div>

          {project.image && (
            // Moldura de navegador: a imagem e um print do site, e a moldura
            // e o que faz isso ser lido como "site", e nao como ilustracao.
            // `order-first` no celular: a imagem e o que traz cor ao card, e la
            // ela chegaria so depois de um paragrafo longo. No desktop ela
            // volta para o lado do texto.
            <figure className="border-paper/15 bg-ink order-first overflow-hidden rounded-xl border lg:order-none lg:col-span-6">
              <div aria-hidden="true" className="border-paper/10 flex gap-1.5 border-b px-3 py-2.5">
                <span className="bg-paper/25 block h-2 w-2 rounded-full" />
                <span className="bg-paper/25 block h-2 w-2 rounded-full" />
                <span className="bg-paper/25 block h-2 w-2 rounded-full" />
              </div>
              <div className="overflow-hidden">
                <img
                  src={project.image.src}
                  alt={project.image.alt}
                  // width/height reservam o espaco antes de a imagem chegar: sem
                  // eles o card cresceria depois, e o sticky e os ScrollTriggers
                  // abaixo ficariam com medidas velhas.
                  width={project.image.width}
                  height={project.image.height}
                  loading="lazy"
                  decoding="async"
                  // A imagem se aproxima no hover. `motion-safe:` porque e
                  // movimento: em movimento reduzido ela fica parada.
                  className="ease-out-expo block h-auto w-full transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
                />
              </div>
            </figure>
          )}
        </div>
      </div>

      {/* Rotulo no recorte da aba: numero em cinza, ano no acento — como o
          "Season 2025" dos cards do Lando. */}
      <p
        className="text-label absolute right-0 bottom-0 flex items-center justify-end gap-3 pr-5"
        style={{ width: NOTCH_W, height: NOTCH_H }}
      >
        <span className="text-paper-dim">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-lime">{project.year}</span>
      </p>
    </li>
  );
}
