import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";
import { createNoise2D } from "@/lib/noise";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Curvas de nivel animadas no fundo de um trecho da pagina.
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
 * UM MAPA SO PARA A PAGINA INTEIRA
 * -------------------------------------------------------------------------
 * Este componente aparece em mais de um lugar (Sobre/Trajetoria e Contato),
 * e todas as instancias desenham o MESMO terreno: o ruido e amostrado na
 * posicao da PAGINA, nao na posicao do canvas. E como se houvesse um unico
 * mapa impresso atras do site e cada secao fosse uma janela para ele — o
 * efeito do Lando, em que as linhas passam por tras das secoes.
 *
 * O canvas, porem, tem so o tamanho da TELA e fica `sticky`. Um canvas da
 * altura do trecho (~3.000px) em tela retina passaria de 40 MB de memoria.
 * Como o terreno e lido pela posicao na pagina, as linhas sobem junto com o
 * conteudo ao rolar, mesmo com o canvas parado na tela.
 * -------------------------------------------------------------------------
 *
 * AS CORES VEM DO CSS. O componente le `--color-paper` e `--color-lime` do
 * proprio elemento. Dentro do `theme-light` esses tokens viram preto e oliva,
 * entao a mesma instancia desenha linhas claras no escuro e escuras no claro,
 * sem nenhuma prop de tema.
 *
 * O movimento vem de DUAS camadas de ruido derivando em direcoes diferentes.
 * Uma camada so faria o desenho inteiro deslizar como papel de parede; duas,
 * somadas, fazem as formas mudarem de verdade.
 *
 * Mesmas regras de performance do HeroField: um unico relogio (gsap.ticker),
 * DPR limitado a 2, celulas maiores no mobile, nada desenhado fora da tela.
 * Em movimento reduzido o terreno fica parado e so e redesenhado no scroll,
 * para acompanhar o conteudo.
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

/** Opacidade das linhas comuns e da linha de destaque (nivel 0). */
const ALPHA_LINE = 0.07;
const ALPHA_ACCENT = 0.16;

/** "#e0ff4f" -> "224, 255, 79", para montar o rgba() do canvas. */
function hexToRgb(hex: string): string {
  const value = hex.trim().replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16)).join(", ");
}

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

      // Mesmas sementes em todas as instancias: e o que faz delas um mapa so.
      const noiseA = createNoise2D(7);
      const noiseB = createNoise2D(23);

      let width = 0;
      let height = 0;
      let cell = CELL_DESKTOP;
      let cols = 0;
      let rows = 0;
      /** Valores do terreno nos pontos da grade, linha a linha. */
      let field = new Float32Array(0);
      let lineColor = "";
      let accentColor = "";

      const resize = () => {
        width = wrap.clientWidth;
        // Altura da tela, a nao ser que o trecho seja mais baixo que ela.
        height = Math.min(window.innerHeight, wrap.clientHeight);

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

        // Lidos aqui, e nao a cada quadro: getComputedStyle forca o navegador
        // a recalcular estilos, caro demais para rodar 60 vezes por segundo.
        const styles = getComputedStyle(wrap);
        lineColor = `rgba(${hexToRgb(styles.getPropertyValue("--color-paper"))}, ${ALPHA_LINE})`;
        accentColor = `rgba(${hexToRgb(styles.getPropertyValue("--color-lime"))}, ${ALPHA_ACCENT})`;
      };

      const sample = (time: number) => {
        const t = time * DRIFT;
        // Onde o canvas esta NA PAGINA neste quadro. Com o sticky, enquanto
        // ele esta preso no topo da tela esse valor acompanha o scroll — e e
        // isso que faz as linhas subirem junto com o conteudo.
        const originY = canvas.getBoundingClientRect().top + window.scrollY;

        for (let row = 0; row < rows; row++) {
          const y = (originY + row * cell) / SCALE;
          for (let col = 0; col < cols; col++) {
            const x = (col * cell) / SCALE;
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

          // Uma familia de linhas no acento, o resto quase transparente:
          // presenca de textura, nunca de conteudo.
          ctx.strokeStyle = level === 0 ? accentColor : lineColor;
          ctx.stroke();
        }
      };

      resize();

      // ResizeObserver e nao so o `resize` da janela: a altura do trecho muda
      // sozinha quando o idioma troca e o texto quebra em outro lugar. A
      // janela continua sendo ouvida porque a altura da TELA tambem importa.
      const redraw = () => {
        resize();
        draw(prefersReduced ? 0 : gsap.ticker.time);
      };
      const observer = new ResizeObserver(redraw);
      observer.observe(wrap);
      window.addEventListener("resize", redraw);

      // --- MOVIMENTO REDUZIDO: terreno parado, redesenhado so no scroll ---
      if (prefersReduced) {
        const onScroll = () => draw(0);
        draw(0);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
          observer.disconnect();
          window.removeEventListener("resize", redraw);
          window.removeEventListener("scroll", onScroll);
        };
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        let visible = false;

        // `gsap.ticker.time` e o relogio do GSAP em segundos — o mesmo que
        // move o Lenis, que roda ANTES deste callback no mesmo quadro (foi
        // registrado primeiro). Entao o scroll ja esta atualizado quando o
        // terreno e amostrado, e as linhas nao ficam um quadro atrasadas.
        const tick = () => {
          if (visible) draw(gsap.ticker.time);
        };
        gsap.ticker.add(tick);

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
          visibility.kill();
        };
      });

      return () => {
        mm.revert();
        observer.disconnect();
        window.removeEventListener("resize", redraw);
      };
    },
    { dependencies: [prefersReduced], scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      // `overflow-clip`, NAO `overflow-hidden`: hidden transforma o elemento
      // num container de scroll, e um `sticky` dentro dele passa a grudar
      // nesse container (que nao rola) em vez de na tela. `clip` recorta igual
      // sem criar container de scroll.
      // `fade-y` apaga as bordas de cima e de baixo do trecho: as linhas
      // surgem e somem em vez de cortar reto.
      className="fade-y pointer-events-none absolute inset-0 -z-10 overflow-clip"
    >
      <canvas ref={canvasRef} className="sticky top-0 block" />
    </div>
  );
}
