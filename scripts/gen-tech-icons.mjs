/**
 * Regenera src/lib/tech-icons-data.ts a partir do pacote simple-icons.
 *
 * O pacote NAO e dependencia do projeto: os 3.466 icones vivem num unico
 * arquivo de 5,25 MB que o bundler nao consegue reduzir, entao copiamos
 * apenas os que usamos. Os caminhos SVG sao CC0-1.0 (dominio publico).
 *
 * Uso:
 *   npm i -D simple-icons && node scripts/gen-tech-icons.mjs && npm un simple-icons
 *
 * Para adicionar uma tecnologia, inclua a entrada em WANT e rode de novo.
 */
import { writeFileSync } from "node:fs";
import * as si from "simple-icons";

/**
 * chave usada na busca por rotulo -> nome do export no simple-icons
 *
 * Criterio para incluir: a marca precisa ser reconhecivel de relance E caber
 * no orcamento. Mascotes desenhados custam caro — o pinguim do Linux e o
 * elefante do PostgreSQL passam de 5.000 caracteres cada. O da GreenSock
 * passava de 8.600 e foi cortado: ninguem o reconhece, e o item ja diz
 * "GSAP" em texto ao lado.
 */
const WANT = {
  javascript: "siJavascript",
  typescript: "siTypescript",
  php: "siPhp",
  node: "siNodedotjs",
  express: "siExpress",
  postgresql: "siPostgresql",
  mongodb: "siMongodb",
  laravel: "siLaravel",
  html: "siHtml5",
  css: "siCss",
  tailwind: "siTailwindcss",
  react: "siReact",
  figma: "siFigma",
  linux: "siLinux",
  git: "siGit",
  github: "siGithub",
  wordpress: "siWordpress",
  datadog: "siDatadog",
  vite: "siVite",
};

const entries = Object.entries(WANT).map(([key, name]) => {
  const icon = si[name];
  if (!icon) throw new Error(`Icone nao encontrado no simple-icons: ${name}`);
  return `  ${key}: { title: ${JSON.stringify(icon.title)}, hex: ${JSON.stringify(
    icon.hex,
  )}, path: ${JSON.stringify(icon.path)} },`;
});

const file = `/**
 * Dados dos icones de tecnologia — extraidos do projeto simple-icons.
 *
 * GERADO POR scripts/gen-tech-icons.mjs. Nao edite a mao.
 *
 * Fonte: https://github.com/simple-icons/simple-icons
 * Licenca dos caminhos SVG: CC0-1.0 (dominio publico).
 * As marcas seguem sendo de seus donos; exibi-las para indicar "trabalho com
 * esta tecnologia" e uso nominativo normal num portfolio.
 */

export type TechIconData = { title: string; hex: string; path: string };

export const TECH_ICONS = {
${entries.join("\n")}
} as const satisfies Record<string, TechIconData>;
`;

writeFileSync(new URL("../src/lib/tech-icons-data.ts", import.meta.url), file);
console.log(`gerado: ${entries.length} icones`);
