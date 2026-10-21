import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SmoothScrollContext } from "@/hooks/useSmoothScroll";

/**
 * Provider do smooth scroll.
 *
 * ---------------------------------------------------------------------------
 * O PONTO CENTRAL DESTE ARQUIVO
 * ---------------------------------------------------------------------------
 * Lenis e ScrollTrigger precisam concordar sobre duas coisas: QUANDO o quadro
 * acontece e QUAL e a posicao do scroll. Se cada um mantiver seu proprio loop
 * de `requestAnimationFrame`, eles rodam em momentos ligeiramente diferentes
 * do mesmo quadro. O resultado visivel e o parallax "tremendo" ou atrasado um
 * quadro em relacao ao conteudo — o defeito mais comum em sites com smooth
 * scroll, e o mais difícil de diagnosticar depois.
 *
 * A solucao tem tres partes:
 *
 *   1. `autoRaf: false` — desliga o loop proprio do Lenis. Sem isso existem
 *      dois loops, e todo o resto aqui nao resolve nada. O padrao e `true`.
 *   2. `gsap.ticker.add(...)` — o ticker do GSAP passa a ser o unico relogio
 *      da pagina e chama `lenis.raf()` no mesmo quadro das animacoes.
 *   3. `lenis.on("scroll", ScrollTrigger.update)` — o ScrollTrigger passa a
 *      ler a posicao INTERPOLADA do Lenis, nao a posicao nativa do navegador.
 *
 * `gsap.ticker.lagSmoothing(0)` completa o conjunto e esta em src/lib/gsap.ts.
 * ---------------------------------------------------------------------------
 *
 * Em `prefers-reduced-motion: reduce` o Lenis nao e instanciado. O navegador
 * volta a controlar o scroll, que e exatamente o que a preferencia pede —
 * e tambem o caminho mais leve.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  // Ref em vez de estado: ver a explicacao em src/hooks/useSmoothScroll.ts.
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Se a pessoa ativou "reduzir movimento" com a pagina aberta, o cleanup
    // da execucao anterior deste efeito ja destruiu a instancia e zerou o ref.
    if (prefersReduced) return;

    const instance = new Lenis({
      autoRaf: false, // ver item 1 do comentario acima — nao remover
      // `lerp` controla a suavidade: quanto menor, mais "pesado" o scroll.
      // 0.1 da a inercia caracteristica sem fazer o site parecer lento.
      lerp: 0.1,
      wheelMultiplier: 1,
      // O toque no mobile fica nativo: sequestrar o scroll no celular prejudica
      // mais do que ajuda (quebra o overscroll do sistema e gasta bateria).
      syncTouch: false,
      // Deixamos a navegacao por ancora com o nosso scrollTo, para controlar
      // o offset do header fixo.
      anchors: false,
    });

    // --- Item 3: ScrollTrigger le a posicao interpolada do Lenis ---
    instance.on("scroll", ScrollTrigger.update);

    // --- Item 2: um unico relogio para a pagina ---
    // O ticker do GSAP entrega o tempo em segundos; o Lenis espera milissegundos.
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);

    lenisRef.current = instance;

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  return <SmoothScrollContext.Provider value={lenisRef}>{children}</SmoothScrollContext.Provider>;
}

/**
 * Recalcula as posicoes de inicio/fim de todos os ScrollTriggers depois que as
 * fontes carregam.
 *
 * Por que isso e necessario: o ScrollTrigger mede a altura da pagina no
 * momento em que e criado. Tipografia display em `clamp()` com fonte propria
 * muda de altura quando a webfont substitui a fonte de fallback — as medidas
 * viram mentira e as animacoes disparam no lugar errado. Um `refresh()`
 * depois de `document.fonts.ready` resolve.
 *
 * Fica em componente separado para poder ser montado uma unica vez na raiz.
 */
export function ScrollRefreshOnFontsReady() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !("fonts" in document)) return;
    done.current = true;

    void document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return null;
}
