import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";
import { useContent } from "@/i18n/locale-context";

/**
 * Cartao de status no canto inferior direito do hero.
 *
 * Referencia: o cartao "NEXT RACE" do landonorris.com, com a pista girando.
 * Aqui ele vira um status de dev: o anel de bits gira no lugar da pista, a
 * aba do cartao e a aba de um arquivo aberto no editor (`status.ts`) e os
 * louros cercam um terminal no lugar do capacete.
 *
 * O ANEL NAO E ALEATORIO. Os 24 bits sao as iniciais J H G em ASCII
 * binario — 01001010 01001000 01000111. Um easter egg para quem decodificar.
 *
 * Quem faz o cartao sumir no primeiro scroll e o Hero (classe
 * `status-card`), porque isso faz parte da timeline dele. Aqui fica so o
 * giro continuo do anel.
 *
 * Tamanho fixo em px (CARD_W x CARD_H) de proposito: a borda e um caminho
 * SVG com curvas, e esticar o SVG deformaria os cantos arredondados. Se
 * mudar a altura, mude tambem a classe `h-*` do <aside>.
 */

/** "JHG" em ASCII, 8 bits por letra. */
const BITS = ["J", "H", "G"]
  .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
  .join("")
  .split("");

/** Raio do anel de bits, em unidades do viewBox (-40..40). */
const RING_RADIUS = 33;

/** Medidas do cartao em px. CARD_H casa com a classe `h-80` (20rem). */
const CARD_W = 160;
const CARD_H = 320;

/**
 * Borda com a aba: o topo e baixo a esquerda (onde fica o nome do arquivo)
 * e sobe numa curva para a direita. Coordenadas em px, com 0.5 de recuo
 * para a linha de 1px cair inteira num pixel em vez de borrar entre dois.
 */
const R = CARD_W - 0.5;
const B = CARD_H - 0.5;
const BORDER =
  `M 0.5 26.5 Q 0.5 18.5 8.5 18.5 L 70 18.5 C 82 18.5 84 0.5 96 0.5 L ${R - 8} 0.5 ` +
  `Q ${R} 0.5 ${R} 8.5 L ${R} ${B - 8} Q ${R} ${B} ${R - 8} ${B} L 8.5 ${B} ` +
  `Q 0.5 ${B} 0.5 ${B - 8} Z`;

/**
 * Folhas de um ramo de louro, ao longo de um arco a esquerda do centro
 * (48, 26). Espacadas o bastante para cada folha ler como folha — juntas
 * demais, o ramo vira um parentese.
 */
const LEAF_COUNT = 7;
const LEAVES = Array.from({ length: LEAF_COUNT }, (_, index) => {
  // De baixo (245 graus) para cima (115 graus), em graus do relogio de
  // trigonometria (0 = direita, 90 = cima).
  const degrees = 245 - index * (130 / (LEAF_COUNT - 1));
  const angle = (degrees * Math.PI) / 180;
  return {
    x: 48 + Math.cos(angle) * 27,
    y: 27 - Math.sin(angle) * 23,
    // Tangente do arco (degrees - 90, convertido para o eixo y do SVG, que
    // cresce para baixo), mais uma inclinacao para fora, como folha de louro.
    rotation: -(degrees - 90) - 35,
  };
});

/** O caule que segura as folhas: o mesmo arco, so que como linha. */
const STEM = "M 40.6 48 Q 14 30 36.6 6.2";

export function StatusCard({ className = "" }: { className?: string }) {
  const { hero } = useContent();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // `svgOrigin` e nao `transformOrigin`: gira em volta do ponto (0, 0)
        // do sistema de coordenadas do SVG — o centro do anel —, e nao do
        // canto da caixa do elemento, que e o padrao para <g>.
        const spin = gsap.to(".status-ring", {
          rotation: 360,
          svgOrigin: "0 0",
          duration: 18,
          ease: "none",
          repeat: -1,
        });

        return () => spin.kill();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <aside
      ref={root}
      aria-label={hero.status.label}
      className={`status-card text-paper relative h-80 w-40 shrink-0 ${className}`}
    >
      <svg
        viewBox={`0 0 ${CARD_W} ${CARD_H}`}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path d={BORDER} />
      </svg>

      {/* Nome do arquivo na aba, em fonte de codigo. */}
      <p className="text-label text-paper-dim absolute top-0 left-0 font-mono leading-[18px] tracking-normal normal-case">
        {hero.status.file}
      </p>

      <div className="absolute inset-x-0 top-[18px] bottom-0 flex flex-col items-center px-4 pt-6 pb-5 text-center">
        {/* 112px: o anel e o elemento principal do cartao, como a pista no
            do Lando — precisa ler de longe. */}
        <svg viewBox="-40 -40 80 80" aria-hidden="true" className="h-28 w-28">
          <g className="status-ring" fill="currentColor">
            {BITS.map((bit, index) => (
              <text
                key={index}
                // Cada bit vai para a borda do anel e fica de pe, virado para
                // fora — como os numeros de um relogio.
                transform={`rotate(${index * (360 / BITS.length)}) translate(0 ${-RING_RADIUS})`}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={7}
                className="font-mono"
              >
                {bit}
              </text>
            ))}
          </g>
          <circle r={2.5} fill="var(--color-lime)" />
        </svg>

        <p className="text-label text-paper mt-3 font-semibold">
          {hero.status.headline}
          <span className="text-paper-dim mt-1 block">{hero.status.detail}</span>
        </p>

        <span aria-hidden="true" className="bg-paper/50 mt-4 block h-px w-full" />

        <svg
          viewBox="0 0 96 52"
          aria-hidden="true"
          className="mt-4 h-13 w-24"
          fill="none"
          stroke="currentColor"
        >
          {/* Dois ramos de louro: o mesmo ramo, espelhado. */}
          {[false, true].map((mirrored) => (
            <g
              key={String(mirrored)}
              transform={mirrored ? "translate(96 0) scale(-1 1)" : undefined}
            >
              <path d={STEM} strokeWidth={1} />
              {LEAVES.map((leaf, index) => (
                <ellipse
                  key={index}
                  cx={leaf.x}
                  cy={leaf.y}
                  rx={4.6}
                  ry={1.9}
                  transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
                  fill="currentColor"
                  stroke="none"
                />
              ))}
            </g>
          ))}
          {/* O terminal no lugar do capacete. */}
          <rect x={35} y={15} width={26} height={20} rx={3} strokeWidth={1.2} />
          <text
            x={48}
            y={26}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={9}
            fill="currentColor"
            stroke="none"
            className="font-mono"
          >
            {">_"}
          </text>
        </svg>

        <p className="text-label text-paper mt-3 font-semibold">{hero.status.footer}</p>
      </div>
    </aside>
  );
}
