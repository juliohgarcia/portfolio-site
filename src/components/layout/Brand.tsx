import type { Ref } from "react";
import { useContent } from "@/i18n/locale-context";

/**
 * Logo fixo no canto superior esquerdo — nome em serifa, sobrenome em
 * grotesca pesada, como o "LANDO / NORRIS" do landonorris.com.
 *
 * Vive FORA do <header> de proposito: o header se esconde ao rolar para
 * baixo, e o logo nao. Se ele fosse filho do header, subiria junto.
 *
 * A cor nao e decidida aqui. O Header coloca e tira a classe `theme-light`
 * deste elemento conforme a secao que passa por baixo (ver Header.tsx), e os
 * tokens remapeados fazem `text-paper` virar preto sobre o papel.
 * `transition-colors` suaviza a troca: a classe muda de uma vez, mas a cor
 * calculada muda, e e isso que a transicao do CSS anima.
 */
export function Brand({ ref, onClick }: { ref: Ref<HTMLDivElement>; onClick: () => void }) {
  const { nav } = useContent();

  return (
    <div
      ref={ref}
      // O container fixo nao recebe clique (pointer-events-none) para nao
      // bloquear o que estiver embaixo dele na faixa do header; so o botao
      // recebe.
      className="container-page pointer-events-none fixed inset-x-0 top-0 z-[55] flex h-22 items-center"
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`${nav.brand.firstName} ${nav.brand.lastName} — ${nav.brand.backToTop}`}
        data-cursor="topo"
        className="text-paper pointer-events-auto flex min-h-11 flex-col items-start justify-center uppercase transition-colors duration-500"
      >
        <span className="text-brand-serif font-serif">{nav.brand.firstName}</span>
        {/* Mesma largura expandida do resto da tipografia display do site,
            para o logo parecer da familia, nao um enfeite colado. */}
        <span className="text-expanded text-brand-sans font-extrabold">{nav.brand.lastName}</span>
      </button>
    </div>
  );
}
