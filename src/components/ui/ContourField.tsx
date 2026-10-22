import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";
import { createNoise2D } from "@/lib/noise";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Curvas de nivel animadas no fundo de uma secao.
 *
 * -------------------------------------------------------------------------
 * A IDEIA
 * -------------------------------------------------------------------------
 * As linhas finas que derivam no fundo do landonorris.com sao curvas de
 * nivel, como num mapa topografico: imagine um terreno invisivel e desenhe
 * so as linhas onde ele cruza certas alturas. Mexendo o terreno devagar, as
 * linhas se dobram, se separam e se fundem.
 *
 * Aqui o "terreno" e ruido de Perlin (ver src/lib/noise.ts), e as linhas
 * saem do algoritmo MARCHING SQUARES:
 *
 *   1. Amostra o ruido numa grade de pontos.
 *   2. Para cada quadradinho da grade, olha os 4 cantos: quais estao acima
 *      da altura de corte e quais estao abaixo. Sao 16 combinacoes.
 *   3. Cada combinacao diz por quais lados do quadrado a linha passa.
 *      A posicao exata no lado sai de uma interpolacao linear entre os
 *      valores dos dois cantos — e isso que deixa a curva lisa em vez de
 *      escada.
 * -------------------------------------------------------------------------
 *
 * O movimento vem de DUAS camadas de ruido derivando em direcoes diferentes.
 * Uma camada so faria o desenho inteiro deslizar como papel de parede; duas,
 * somadas, fazem as formas mudarem de verdade.
 *
 * Mesmas regras de performance do HeroField: um unico relogio (gsap.ticker),
 * DPR limitado a 2, celulas maiores no mobile, nada desenhado fora da tela,
 * e em movimento reduzido um quadro estatico.
 */

/** Tamanho da celula do marching squares, em px. Maior = mais barato. */
const CELL_DESKTOP = 22;
const CELL_MOBILE = 30;

/** Escala do ruido: quantos px correspondem a uma "unidade" de terreno. */
const SCALE = 340;

/** Alturas de corte. Cada uma vira uma familia de linhas. */
const LEVELS = [-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45];

/** Velocidade da deriva, em unidades de ruido por segundo. Lento de proposito. */
const DRIFT = 0.035;

export function ContourField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const noiseA = createNoise2D(7);
      const noiseB = createNoise2D(23);

      let width = 0;
      let height = 0;
      let cell = CELL_DESKTOP;
      let cols = 0;
      let rows = 0;
      /** Valores do terreno nos pontos da grade, linha a linha. */
      let field = new Float32Array(0);

      const resize = () => {
        width = wrap.clientWidth;
        height = wrap.clientHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        cell = width < 768 ? CELL_MOBILE : CELL_DESKTOP;
        cols = Math.ceil(width / cell) + 1;
        rows = Math.ceil(height / cell) + 1;
        field = new Float32Array(cols * rows);
      };

      const sample = (time: number) => {
        const t = time * DRIFT;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const x = (col * cell) / SCALE;
            const y = (row * cell) / SCALE;
            // Camada larga derivando para a direita e uma mais fina, com
            // metade do peso, indo na diagonal oposta.
            field[row * cols + col] =
              noiseA(x + t, y + t * 0.4) + 0.5 * noiseB(x * 2 - t * 0.7, y * 2 + t * 0.9);
          }
        }
      };

      const draw = (time: number) => {
        sample(time);
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 1;

        for (let index = 0; index < LEVELS.length; index++) {
          const level = LEVELS[index]!;
          ctx.beginPath();

          for (let row = 0; row < rows - 1; row++) {
            for (let col = 0; col < cols - 1; col++) {
              // Cantos: a = sup. esq., b = sup. dir., c = inf. dir., d = inf. esq.
              const a = field[row * cols + col]!;
              const b = field[row * cols + col + 1]!;
              const c = field[(row + 1) * cols + col + 1]!;
              const d = field[(row + 1) * cols + col]!;

              const config =
                (a > level ? 8 : 0) |
                (b > level ? 4 : 0) |
                (c > level ? 2 : 0) |
                (d > level ? 1 : 0);
              // 0 = tudo abaixo, 15 = tudo acima: a linha nao passa aqui.
              if (config === 0 || config === 15) continue;

              const x = col * cell;
              const y = row * cell;
              // Onde a linha cruza cada lado (interpolacao linear).
              const top = x + ((level - a) / (b - a)) * cell;
              const right = y + ((level - b) / (c - b)) * cell;
              const bottom = x + ((level - d) / (c - d)) * cell;
              const left = y + ((level - a) / (d - a)) * cell;

              const segment = (x1: number, y1: number, x2: number, y2: number) => {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
              };

              switch (config) {
                case 1:
                case 14:
                  segment(x, left, bottom, y + cell);
                  break;
                case 2:
                case 13:
                  segment(bottom, y + cell, x + cell, right);
                  break;
                case 3:
                case 12:
                  segment(x, left, x + cell, right);
                  break;
                case 4:
                case 11:
                  segment(top, y, x + cell, right);
                  break;
                case 6:
                case 9:
                  segment(top, y, bottom, y + cell);
                  break;
                case 7:
                case 8:
                  segment(x, left, top, y);
                  break;
                // Casos de sela: dois cantos opostos acima. Ha duas leituras
                // validas; escolher sempre a mesma basta para nao haver furo.
                case 5:
                  segment(x, left, top, y);
                  segment(bottom, y + cell, x + cell, right);
                  break;
                case 10:
                  segment(top, y, x + cell, right);
                  segment(x, left, bottom, y + cell);
                  break;
              }
            }
          }

          // Uma familia de linhas no acento, o resto em off-white quase
          // transparente: presenca de textura, nunca de conteudo.
          ctx.strokeStyle = level === 0 ? "rgba(224, 255, 79, 0.16)" : "rgba(245, 242, 234, 0.07)";
          ctx.stroke();
        }
      };

      resize();

      // --- MOVIMENTO REDUZIDO: um quadro estatico ---
      if (prefersReduced) {
        draw(0);
        const observer = new ResizeObserver(() => {
          resize();
          draw(0);
        });
        observer.observe(wrap);
        return () => observer.disconnect();
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        let visible = false;

        // `gsap.ticker.time` e o relogio do GSAP em segundos — o mesmo que
        // move o Lenis. Usar o tempo, e nao "contar quadros", deixa a deriva
        // com a mesma velocidade em telas de 60 e de 120 Hz.
        const tick = () => {
          if (visible) draw(gsap.ticker.time);
        };
        gsap.ticker.add(tick);

        // ResizeObserver e nao `resize` da janela: a altura da secao muda
        // sozinha quando o idioma troca e o texto quebra em outro lugar.
        const observer = new ResizeObserver(() => {
          resize();
          draw(gsap.ticker.time);
        });
        observer.observe(wrap);

        const visibility = ScrollTrigger.create({
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
          },
        });

        return () => {
          gsap.ticker.remove(tick);
          observer.disconnect();
          visibility.kill();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [prefersReduced], scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      // `fade-y` apaga as bordas de cima e de baixo: as linhas surgem e somem
      // em vez de cortar reto no limite da secao.
      className="fade-y pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
