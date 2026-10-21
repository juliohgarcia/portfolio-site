import { useEffect, useState } from "react";
import { MOTION_REDUCED } from "@/lib/motion";

/**
 * Observa `prefers-reduced-motion` de forma REATIVA.
 *
 * Por que nao basta ler uma vez: a pessoa pode ativar "reduzir movimento" nas
 * preferencias do sistema com o site aberto. Uma leitura unica deixaria o site
 * animando contra a preferencia dela ate o proximo reload.
 *
 * Use este hook para decisoes de React (montar ou nao um componente).
 * Para animacao em si, prefira `gsap.matchMedia()` — ver src/lib/motion.ts.
 */
export function useReducedMotion(): boolean {
  // Estado inicial lido de forma sincrona para evitar um primeiro render
  // "animado" que seria corrigido no efeito seguinte.
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(MOTION_REDUCED).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia(MOTION_REDUCED);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
