import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Campo de pontos do hero.
 *
 * -------------------------------------------------------------------------
 * A IDEIA
 * -------------------------------------------------------------------------
 * Os pontos comecam dispersos e se resolvem numa grade conforme a pessoa
 * rola. E a narrativa do site em forma visual: o problema chega baguncado
 * ("parou de funcionar") e sai estruturado. O visual nao e decoracao solta —
 * ele diz a mesma coisa que o texto ao lado.
 *
 * O cursor empurra os pontos proximos e os acende no tom de acento, o que da
 * a sensacao de material em vez de imagem.
 * -------------------------------------------------------------------------
 *
 * DECISOES DE PERFORMANCE (um canvas mal feito derruba o site inteiro):
 *
 * - Desenha pelo `gsap.ticker`, NUNCA com requestAnimationFrame proprio.
 *   Esta e a regra do projeto: um unico relogio na pagina. Um segundo loop
 *   aqui brigaria com o Lenis e faria tudo tremer (ver SmoothScroll.tsx).
 * - `devicePixelRatio` limitado a 2. Em telas 3x o ganho visual e nulo e o
 *   custo por quadro triplica.
 * - Espacamento maior no mobile: menos pontos, menos trabalho por quadro.
 * - Para de desenhar quando o hero sai da tela.
 * - Em movimento reduzido desenha a grade UMA vez, ja resolvida, e encerra.
 *   O hero continua com presenca visual sem nada se mexer.
 */

/** Distancia entre pontos, em px. Maior = menos pontos = mais barato. */
const SPACING_DESKTOP = 34;
const SPACING_MOBILE = 46;

/** Raio de influencia do cursor, em px. */
const POINTER_RADIUS = 130;

type Dot = {
  /** Posicao final, na grade. */
  gridX: number;
  gridY: number;
  /** Deslocamento inicial, aleatorio — o estado "baguncado". */
  noiseX: number;
  noiseY: number;
  /** Posicao desenhada neste quadro. */
  x: number;
  y: number;
};

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      let dots: Dot[] = [];
      let width = 0;
      let height = 0;

      /** Progresso de resolucao: 0 = disperso, 1 = grade perfeita. */
      const state = { resolve: 0 };
      const pointer = { x: -9999, y: -9999 };

      /** (Re)constroi a grade. Chamado no inicio e a cada resize. */
      const build = () => {
        const rect = wrap.getBoundingClientRect();
        width = rect.width;
        height = rect.height;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        // Desenhamos em px de CSS; o scale cuida da densidade da tela.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const spacing = width < 768 ? SPACING_MOBILE : SPACING_DESKTOP;
        const cols = Math.ceil(width / spacing);
        const rows = Math.ceil(height / spacing);

        dots = [];
        for (let row = 0; row <= rows; row++) {
          for (let col = 0; col <= cols; col++) {
            const gridX = col * spacing;
            const gridY = row * spacing;
            dots.push({
              gridX,
              gridY,
              // Dispersao proporcional ao espacamento: a bagunca tem a mesma
              // escala da ordem, entao a transicao parece do mesmo material.
              noiseX: (Math.random() - 0.5) * spacing * 3.5,
              noiseY: (Math.random() - 0.5) * spacing * 3.5,
              x: gridX,
              y: gridY,
            });
          }
        }
      };

      const draw = () => {
        ctx.clearRect(0, 0, width, height);

        for (const dot of dots) {
          // Interpola entre o estado disperso e a grade.
          let x = dot.gridX + dot.noiseX * (1 - state.resolve);
          let y = dot.gridY + dot.noiseY * (1 - state.resolve);

          // Opacidade cresce conforme o ponto encontra seu lugar.
          let alpha = 0.12 + state.resolve * 0.2;
          let radius = 1;
          let accent = 0;

          // --- Influencia do cursor ---
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < POINTER_RADIUS) {
            // 1 no centro do cursor, 0 na borda do raio.
            const force = 1 - distance / POINTER_RADIUS;
            // Empurra para fora, com queda suave.
            const push = force * force * 26;
            x += (dx / (distance || 1)) * push;
            y += (dy / (distance || 1)) * push;

            alpha += force * 0.55;
            radius += force * 1.6;
            accent = force;
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          // Mistura entre o off-white e o acento conforme a proximidade.
          ctx.fillStyle =
            accent > 0.05 ? `rgba(224, 255, 79, ${alpha})` : `rgba(245, 242, 234, ${alpha})`;
          ctx.fill();
        }
      };

      build();

      // --- MOVIMENTO REDUZIDO: desenha uma vez, resolvido, e para aqui ---
      if (prefersReduced) {
        state.resolve = 1;
        draw();
        const onResizeStatic = () => {
          build();
          draw();
        };
        window.addEventListener("resize", onResizeStatic);
        return () => window.removeEventListener("resize", onResizeStatic);
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        let visible = true;

        // Um unico relogio na pagina: o ticker do GSAP (ver SmoothScroll.tsx).
        const tick = () => {
          if (visible) draw();
        };
        gsap.ticker.add(tick);

        // A grade se resolve conforme o hero sai da tela.
        const resolveTween = gsap.to(state, {
          resolve: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        // Entrada: resolve um pouco sozinho na primeira aparicao, para o
        // campo nao comecar completamente caotico.
        const intro = gsap.fromTo(
          state,
          { resolve: 0 },
          { resolve: 0.35, duration: 2.4, ease: "power2.out" },
        );

        const onPointerMove = (event: PointerEvent) => {
          const rect = wrap.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
        };
        const onPointerLeave = () => {
          pointer.x = -9999;
          pointer.y = -9999;
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onPointerLeave);

        const onResize = () => build();
        window.addEventListener("resize", onResize);

        // Nao gasta quadro desenhando o que ninguem ve.
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
          resolveTween.kill();
          intro.kill();
          visibility.kill();
          window.removeEventListener("pointermove", onPointerMove);
          document.documentElement.removeEventListener("pointerleave", onPointerLeave);
          window.removeEventListener("resize", onResize);
        };
      });

      return () => mm.revert();
    },
    { dependencies: [prefersReduced], scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      // Puramente decorativo: nao carrega informacao que o texto nao tenha.
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas ref={canvasRef} />
      {/* Desvanece o campo nas bordas, para ele nao brigar com a tipografia
          nem cortar em linha reta no fim da secao. */}
      <div className="from-ink via-ink/20 to-ink absolute inset-0 bg-gradient-to-b" />
      <div className="from-ink absolute inset-0 bg-gradient-to-r to-transparent" />
    </div>
  );
}
