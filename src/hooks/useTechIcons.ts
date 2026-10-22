import { useEffect, useState } from "react";
import type { TechIconData } from "@/lib/tech-icons-data";

export type IconMap = Record<string, TechIconData>;

/**
 * Cache em nivel de modulo: o import dinamico acontece UMA vez por sessao,
 * mesmo com dezenas de <TechIcon> montando ao mesmo tempo. Sem isso, cada
 * instancia dispararia a propria promessa.
 */
let cache: IconMap | null = null;

/**
 * Carrega os dados dos icones sob demanda.
 *
 * Por que isto nao repete o erro do React.lazy que removemos das secoes:
 * la, o chunk que chegava era uma SECAO INTEIRA, e a altura do documento
 * mudava depois da primeira pintura — o que quebra sticky e scrub. Aqui o
 * <TechIcon> reserva 16x16 desde o primeiro render e o caminho SVG apenas
 * preenche esse espaco. A altura da pagina nao muda em nenhum momento.
 *
 * Ganho: ~14 kB gzip saem do bundle inicial. Os icones vivem em Projetos e
 * Skills, bem abaixo da dobra — nao faz sentido atrasar a primeira pintura
 * por causa deles.
 */
export function useTechIcons(): IconMap | null {
  const [icons, setIcons] = useState<IconMap | null>(cache);

  useEffect(() => {
    if (cache) return;

    let alive = true;
    void import("@/lib/tech-icons-data").then((module) => {
      cache = module.TECH_ICONS;
      if (alive) setIcons(cache);
    });

    return () => {
      alive = false;
    };
  }, []);

  return icons;
}
