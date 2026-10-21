import { createContext, useCallback, useContext, type RefObject } from "react";
import type Lenis from "lenis";

/**
 * O contexto carrega um REF para a instancia do Lenis, nao a instancia em
 * estado do React.
 *
 * Por que ref e nao useState: a instancia nasce dentro de um `useEffect`, ou
 * seja, depois do primeiro render. Guardar em estado dispararia um segundo
 * render de toda a arvore so para anunciar "o Lenis existe" — e ninguem
 * precisa redesenhar por causa disso. Quem chama `scrollTo` le o valor no
 * momento do clique, que e sempre o atual.
 *
 * O contexto vive em arquivo separado do componente provider por causa do
 * Fast Refresh: um arquivo que exporta componente E valor nao-componente
 * perde a atualizacao em tempo real no dev server.
 */
export const SmoothScrollContext = createContext<RefObject<Lenis | null> | null>(null);

type ScrollToTarget = string | number | HTMLElement;

/**
 * Retorna um `scrollTo` que funciona nos dois mundos: com Lenis ativo usa a
 * animacao suave dele; sem Lenis (movimento reduzido) cai no scroll nativo.
 *
 * Quem chama nao precisa saber qual dos dois esta ativo — e isso que mantem a
 * decisao de acessibilidade em um lugar so, em vez de espalhada pelos
 * componentes de navegacao.
 *
 * @param offset deslocamento em px; use negativo para compensar header fixo.
 */
export function useSmoothScroll() {
  const lenisRef = useContext(SmoothScrollContext);

  const scrollTo = useCallback(
    (target: ScrollToTarget, offset = 0) => {
      const lenis = lenisRef?.current;

      if (lenis) {
        lenis.scrollTo(target, { offset });
        return;
      }

      // --- Fallback nativo ---
      if (typeof target === "number") {
        window.scrollTo({ top: target + offset });
        return;
      }

      const element = typeof target === "string" ? document.querySelector(target) : target;
      if (!element) return;

      // Calculamos a posicao na mao em vez de usar scrollIntoView para poder
      // aplicar o mesmo `offset` do caminho com Lenis — assim o header fixo
      // nao cobre o titulo da secao nos dois modos.
      const top = element.getBoundingClientRect().top + window.scrollY + offset;
      // `behavior: "auto"` respeita a preferencia do sistema, que e justamente
      // o motivo de estarmos neste caminho.
      window.scrollTo({ top, behavior: "auto" });
    },
    [lenisRef],
  );

  return { lenisRef, scrollTo };
}
