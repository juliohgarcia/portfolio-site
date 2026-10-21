import type { TechIconData } from "./tech-icons-data";
import type { IconMap } from "@/hooks/useTechIcons";

/**
 * Resolve o rotulo de uma skill no icone correspondente.
 *
 * O mapa chega por parametro, e nao por import, porque os dados sao
 * carregados sob demanda (ver useTechIcons). Este arquivo so tem `import
 * type`, que o TypeScript apaga na compilacao — entao ele nao arrasta os
 * dados para o bundle inicial.
 *
 * A busca e por trecho normalizado porque o conteudo traz sufixos como
 * "React (aprendendo)" e "JavaScript (ES6+)". Assim o arquivo de conteudo
 * continua sendo texto simples, e um rotulo sem icone nao mostra nenhum.
 */
export function findIcon(icons: IconMap, label: string): TechIconData | null {
  const normalized = label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Da chave mais longa para a mais curta: senao "Git & GitHub" casaria com
  // "git" antes de chegar em "github".
  const key = Object.keys(icons)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => normalized.includes(candidate));

  return key ? (icons[key] ?? null) : null;
}

/** Luminancia relativa (WCAG), para saber se a cor da marca sobrevive ao fundo escuro. */
function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

/**
 * Cor usada no hover.
 *
 * Algumas marcas sao quase pretas: Express (#0A0A0A) e exatamente a cor de
 * fundo do site e GitHub (#181717) chega perto. Pintar o icone com a cor da
 * marca o faria desaparecer no hover — o oposto do efeito pretendido. Nesses
 * casos voltamos para o off-white.
 */
export function accentFor(icon: TechIconData): string {
  return luminance(icon.hex) < 0.06 ? "#F5F2EA" : `#${icon.hex}`;
}
