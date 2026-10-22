import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

/**
 * "dev" escrito a mao, em pincel, que se desenha conforme a pessoa rola.
 * Referencia: o "Collabs" atras do titulo de parceiros do landonorris.com.
 *
 * -------------------------------------------------------------------------
 * COMO UM TRACO "SE DESENHA"
 * -------------------------------------------------------------------------
 * Nao ha mascara nem animacao de forma. O truque e o tracejado do SVG:
 *
 *   stroke-dasharray:  L   -> um traco de comprimento L seguido de um
 *                             espaco de comprimento L
 *   stroke-dashoffset: L   -> empurra o padrao L para tras: o que aparece
 *                             na linha e so o ESPACO, ela fica invisivel
 *
 * Levando o offset de L ate 0, o traco desliza para dentro do caminho e
 * parece ser escrito do inicio ao fim. L vem de `getTotalLength()`, que o
 * navegador calcula a partir do proprio caminho.
 *
 * (O GSAP tem o DrawSVGPlugin, gratuito desde a 3.13, que faz isso por
 * baixo. Aqui o mecanismo fica a vista e o bundle nao ganha um plugin.)
 * -------------------------------------------------------------------------
 *
 * O estado "nao desenhado" so e aplicado dentro do bloco MOTION_OK. Sem JS,
 * ou em movimento reduzido, o rabisco aparece inteiro — e decorativo, mas a
 * regra de nunca esconder por CSS vale igual.
 *
 * Os caminhos foram desenhados a mao, curva por curva: sao um tracado
 * original, nao uma fonte convertida.
 */

/** Uma linha continua: bojo do "d", haste com laco, "e", "v" e o arremate. */
const WORD =
  "M 150 212 C 125 172 62 188 64 236 C 66 276 122 270 152 226 C 178 186 206 110 228 48 " +
  "C 240 14 200 8 194 52 C 186 112 178 190 184 240 C 188 272 220 262 242 238 " +
  "C 264 214 302 200 302 178 C 302 150 254 160 252 205 C 250 250 292 262 324 236 " +
  "C 342 220 346 196 350 180 C 358 215 366 248 382 252 C 404 248 430 195 442 160 " +
  "C 450 132 486 136 468 172";

/** O sublinhado, um segundo gesto depois da palavra. */
const UNDERLINE = "M 40 318 C 200 292 400 276 610 246";

/** Espessura do pincel, em unidades do viewBox. */
const STROKE = 21;

export function Scribble({ className = "" }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const paths = gsap.utils.toArray<SVGPathElement>("path");

        paths.forEach((path) => {
          const length = path.getTotalLength();
          // Folga de uma espessura de traco (STROKE). Com espaco e offset
          // exatamente iguais a L, o tracejado deixa um traco de comprimento
          // ZERO na ponta do caminho — e a ponta arredondada de um traco zero
          // e um ponto visivel, solto na tela antes de o desenho comecar.
          gsap.set(path, {
            strokeDasharray: `${length} ${length + STROKE * 2}`,
            strokeDashoffset: length + STROKE,
          });
        });

        // Uma timeline com scrub: a palavra ocupa a maior parte da janela de
        // scroll e o sublinhado entra no fim, como a mao que termina a palavra
        // e risca embaixo.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "bottom 35%",
            scrub: 0.8,
          },
        });

        tl.to(paths[0]!, { strokeDashoffset: 0, ease: "none", duration: 0.75 }).to(paths[1]!, {
          strokeDashoffset: 0,
          ease: "power1.out",
          duration: 0.25,
        });

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 640 340"
      aria-hidden="true"
      focusable="false"
      // overflow visivel: as pontas arredondadas e o sublinhado passam um
      // pouco da caixa, e cortar ali denunciaria que e um SVG retangular.
      className={`overflow-visible ${className}`}
    >
      <g
        fill="none"
        stroke="var(--color-brush)"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={WORD} />
        <path d={UNDERLINE} />
      </g>
    </svg>
  );
}
