import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK_DESKTOP } from "@/lib/motion";
import type { Project } from "@/content";
import { isPlaceholder, resolved } from "@/content/placeholders";
import { TechIcon } from "@/components/ui/TechIcon";

type ProjectCardProps = {
  project: Project;
  index: number;
  labels: { viewRepo: string; viewLive: string };
};

/**
 * Card de projeto com hover animado.
 *
 * O hover e feito em JS (GSAP) e nao em CSS porque duas coisas acontecem
 * juntas e precisam ficar em sincronia: o numero do indice desliza e a seta
 * avanca. Com `transition` em CSS daria para fazer, mas qualquer ajuste de
 * tempo passaria a exigir editar dois lugares.
 *
 * `MOTION_OK_DESKTOP` em vez de `MOTION_OK`: hover nao existe em touch, e
 * registrar os listeners no mobile seria custo sem retorno.
 *
 * Campos ainda nao preenchidos ({{...}}) nao viram link: `href="{{URL_REPO}}"`
 * seria um link quebrado no ar.
 */
export function ProjectCard({ project, index, labels }: ProjectCardProps) {
  const root = useRef<HTMLLIElement>(null);

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
      // `sticky` + fundo solido: o card para na altura do topo e o proximo
      // sobe por cima dele. `origin-top` faz o encolhimento recuar em vez de
      // puxar o card para o centro.
      //
      // `motion-safe:` e importante aqui. O sticky nao e animacao, mas cria
      // sobreposicao de conteudo — e sem o GSAP para encolher e apagar o card
      // de tras (que nao roda em movimento reduzido), o empilhamento perderia
      // a pista visual de profundidade e viraria so cards se cobrindo. Em
      // movimento reduzido a lista volta a ser uma lista.
      className="project-card bg-ink border-ink-line group motion-safe:sticky motion-safe:top-[18vh] origin-top border-t py-10 md:py-14"
    >
      <div className="flex items-start gap-6 md:gap-12">
        <span aria-hidden="true" className="text-label text-paper-dim/60 shrink-0 pt-3">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
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
            <span className="text-label text-paper-dim">{project.year}</span>
            <span
              aria-hidden="true"
              className="card-arrow text-lime text-title hidden opacity-0 md:inline"
            >
              →
            </span>
          </div>

          <p className="text-paper-dim mt-5 max-w-2xl leading-relaxed">{project.description}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags
              .filter((tag) => !isPlaceholder(tag))
              .map((tag) => (
                <li
                  key={tag}
                  className="group/tech border-ink-line text-paper-dim hover:text-paper flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors duration-200"
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
      </div>
    </li>
  );
}
