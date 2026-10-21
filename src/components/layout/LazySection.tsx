import { Suspense, useEffect, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Envolve uma secao carregada por `React.lazy`.
 *
 * Duas responsabilidades:
 *
 * 1. RESERVAR ESPACO. O `fallback` tem altura minima parecida com a da secao
 *    real. Sem isso, a pagina encurta e depois cresce quando o chunk chega,
 *    e a barra de scroll "salta" sob o dedo de quem esta rolando.
 *
 * 2. RECALCULAR OS TRIGGERS. Quando o chunk monta, a altura total do documento
 *    muda — e todo ScrollTrigger ja criado guardou medidas da altura antiga.
 *    Sem o `refresh()`, as animacoes das secoes acima passam a disparar no
 *    lugar errado. Este e o custo escondido de code splitting em pagina com
 *    animacao por scroll, e e facil de nao perceber em dev (onde o chunk
 *    chega em milissegundos) e obvio em 3G.
 *
 * Nao usamos IntersectionObserver para adiar a montagem de proposito: um
 * crawler renderiza a pagina mas nao rola. Secao montada so ao chegar perto
 * da viewport ficaria invisivel para indexacao — ruim para um portfolio. Como
 * esta, os chunks carregam em paralelo logo apos a primeira pintura: o bundle
 * inicial fica menor sem esconder conteudo de ninguem.
 */
export function LazySection({
  children,
  minHeight = "60vh",
}: {
  children: ReactNode;
  minHeight?: string;
}) {
  return (
    <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>
      {/* Dentro do Suspense: so monta quando o chunk chega, que e exatamente
          o momento em que a altura do documento muda. */}
      <RefreshOnMount />
      {children}
    </Suspense>
  );
}

/** Avisa o ScrollTrigger que o documento mudou de tamanho. Nao renderiza nada. */
function RefreshOnMount() {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return null;
}
