import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

/**
 * Aplica parallax a todos os elementos marcados dentro de um escopo.
 *
 * Uso declarativo — o valor e o deslocamento em % da altura do elemento ao
 * longo da travessia pela viewport. Negativo sobe (mais rapido que a pagina),
 * positivo desce (mais devagar):
 *
 *   const root = useRef<HTMLDivElement>(null);
 *   useParallax(root);
 *
 *   <div ref={root}>
 *     <img data-parallax="-12" />
 *     <p data-parallax="6" />
 *   </div>
 *
 * `ease: "none"` e obrigatorio aqui: com `scrub`, a posicao do scroll JA e a
 * linha do tempo. Qualquer easing faria o elemento acelerar e desacelerar em
 * relacao ao dedo da pessoa, o que se percebe como atraso.
 */
export function useParallax(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Parallax fica so no desktop por escolha de performance: no mobile o
      // ganho visual e pequeno (a viewport e curta) e o custo por quadro em
      // aparelho modesto nao se justifica.
      mm.add(MOTION_OK, () => {
        const targets = gsap.utils.toArray<HTMLElement>("[data-parallax]", scope.current);

        const tweens = targets.map((el) => {
          const amount = Number(el.dataset.parallax ?? 0);

          return gsap.to(el, {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              // `scrub: true` amarra o progresso da animacao ao scroll.
              // Como o ScrollTrigger le a posicao interpolada do Lenis
              // (ver SmoothScroll.tsx), o movimento sai suave sem tremer.
              scrub: true,
            },
          });
        });

        return () => tweens.forEach((tween) => tween.kill());
      });

      return () => mm.revert();
    },
    { scope },
  );
}

/** Reexportado para quem precisar de um refresh manual apos mudar o layout. */
export const refreshParallax = () => ScrollTrigger.refresh();
