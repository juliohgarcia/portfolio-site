import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/motion";

/**
 * Cursor customizado: um anel que segue o mouse com atraso suave e cresce
 * sobre elementos interativos, exibindo um rotulo contextual.
 *
 * Como marcar um elemento (funciona em qualquer parte do site):
 *   <a data-cursor="ver projeto">...</a>   -> anel cresce e mostra o rotulo
 *   <a data-cursor>...</a>                 -> so cresce, sem rotulo
 *
 * DECISAO: o cursor nativo do sistema CONTINUA VISIVEL.
 * Muitos sites award-winning escondem o cursor nativo para o anel ser o unico
 * ponteiro. Nao fizemos isso: se o JS falhar, se o anel sair de sincronia, ou
 * se a pessoa usar um dispositivo apontador assistivo, esconder o cursor
 * nativo deixa alguem sem saber onde esta clicando. O anel aqui soma ao
 * cursor, nao o substitui. (Para inverter, basta `cursor: none` no body.)
 *
 * PERFORMANCE: usamos `gsap.quickTo`, que reaproveita um unico tween por
 * propriedade. Chamar `gsap.to()` a cada mousemove criaria um tween novo a
 * cada evento — centenas por segundo, todos competindo pela mesma propriedade.
 *
 * Nao e montado em dispositivos de toque nem em movimento reduzido: quem
 * decide isso e o App, para este componente nao precisar saber de nada.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useGSAP(
    () => {
      const el = ring.current;
      if (!el) return;

      // Comeca fora da tela: sem isso o anel apareceria no canto superior
      // esquerdo antes do primeiro movimento do mouse.
      gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100, scale: 0 });

      // quickTo devolve uma funcao que atualiza o tween existente.
      const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: EASE.expoOut });
      const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: EASE.expoOut });

      let visible = false;

      const onMove = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);

        if (!visible) {
          visible = true;
          gsap.to(el, { scale: 1, duration: DURATION.fast, ease: EASE.backOut });
        }

        // `closest` sobe a arvore: funciona mesmo quando o ponteiro esta sobre
        // um <span> dentro do link marcado.
        const target = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
        const nextLabel = target?.dataset.cursor ?? "";

        setLabel(nextLabel);
        gsap.to(el, {
          scale: target ? 2.6 : 1,
          duration: DURATION.fast,
          ease: EASE.expoOut,
        });
      };

      // Esconde quando o ponteiro sai da janela.
      const onLeave = () => {
        visible = false;
        gsap.to(el, { scale: 0, duration: DURATION.fast });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ring },
  );

  return (
    <div
      ref={ring}
      // Puramente decorativo: o rotulo tambem existe como texto real no
      // elemento marcado, entao esconder daqui nao perde informacao.
      aria-hidden="true"
      className="border-lime pointer-events-none fixed top-0 left-0 z-[90] grid h-10 w-10 place-items-center rounded-full border mix-blend-difference"
    >
      {label && (
        <span className="text-paper text-[0.3rem] font-medium tracking-wider uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
