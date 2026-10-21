import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/motion";

/**
 * Cortina de entrada com contador 0 → 100.
 *
 * O contador e HONESTO, nao um setTimeout decorativo: ele avanca ate 90
 * enquanto as fontes carregam e so completa quando `document.fonts.ready`
 * resolve. Isso resolve um problema real, nao so estetico — a tipografia
 * display e o elemento central do hero, e trocar a fonte de fallback pela
 * webfont no meio da animacao de entrada produz um salto de layout bem
 * visivel. A cortina cobre exatamente essa troca.
 *
 * Acessibilidade e seguranca:
 * - nao e renderizado em `prefers-reduced-motion` (decidido no App);
 * - e um overlay criado por JS, entao se o JS falhar ele simplesmente nao
 *   existe e o conteudo aparece — nunca uma tela preta travada;
 * - tem um teto de tempo (FAILSAFE_MS): se `fonts.ready` nunca resolver,
 *   a cortina sai de qualquer jeito. Preloader que nao sai e site quebrado.
 * - `aria-hidden` + `inert`: leitor de tela e teclado ignoram a cortina e
 *   vao direto ao conteudo, que ja esta no DOM atras dela.
 */

/** Teto absoluto: a cortina nunca fica mais que isto na tela. */
const FAILSAFE_MS = 4000;

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useGSAP(
    () => {
      // Objeto intermediario: o GSAP anima `progress.value` e nos espelhamos
      // no estado do React. Animar o numero direto no DOM seria mais rapido,
      // mas aqui sao ~100 atualizacoes em 2s, e a legibilidade vale mais.
      const progress = { value: 0 };
      let finished = false;

      const tl = gsap.timeline();

      // Fase 1: sobe ate 90 com desaceleracao. Para em 90 de proposito —
      // os 10 finais pertencem ao evento real de fonte carregada.
      tl.to(progress, {
        value: 90,
        duration: DURATION.slow,
        ease: EASE.softOut,
        onUpdate: () => setCount(Math.round(progress.value)),
      });

      /** Fase 2: completa 100 e sobe a cortina. */
      const finish = () => {
        if (finished) return;
        finished = true;

        gsap
          .timeline({
            onComplete: () => {
              onComplete();
            },
          })
          .to(progress, {
            value: 100,
            duration: DURATION.fast,
            ease: EASE.softOut,
            onUpdate: () => setCount(Math.round(progress.value)),
          })
          // A cortina sai para cima revelando o conteudo, com clipPath em vez
          // de `height`: clipPath e animado na GPU (composite), enquanto
          // `height` forca o navegador a recalcular layout a cada quadro.
          .to(
            root.current,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              duration: DURATION.slow,
              ease: EASE.quartInOut,
            },
            "+=0.1",
          )
          .set(root.current, { pointerEvents: "none", visibility: "hidden" });
      };

      // Dispara quando as fontes terminarem...
      const fontsReady = "fonts" in document ? document.fonts.ready : Promise.resolve(undefined);
      void fontsReady.then(finish);

      // ...ou no teto de tempo, o que vier primeiro.
      const failsafe = window.setTimeout(finish, FAILSAFE_MS);

      return () => {
        window.clearTimeout(failsafe);
        tl.kill();
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      // `inert` remove a cortina da ordem de tabulacao e da arvore de
      // acessibilidade: nada atras dela recebe foco por engano enquanto ela
      // esta na frente, e o leitor de tela vai direto ao conteudo.
      inert={true}
      className="bg-ink fixed inset-0 z-[100] flex items-end justify-between p-6 md:p-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <span className="text-label text-paper-dim">Júlio Garcia</span>
      {/* `tabular-nums` evita o numero "dancar" na horizontal ao mudar de
          digito, porque todos os algarismos passam a ter a mesma largura. */}
      <span className="text-expanded text-display text-paper leading-none tabular-nums">
        {count}
      </span>
    </div>
  );
}
