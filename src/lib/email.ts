/**
 * Monta o endereco de e-mail em tempo de execucao.
 *
 * O que isto protege, honestamente: o site e uma SPA, entao o e-mail nunca
 * aparece no `index.html` servido — so dentro do bundle JS. Guardando as
 * partes separadas, ele tambem nao aparece como uma string continua no
 * bundle, o que atrapalha raspagem ingenua por expressao regular.
 *
 * O que NAO protege: qualquer scraper que execute JavaScript le o endereco
 * normalmente. Isto reduz spam automatizado, nao e garantia.
 */

/** Divide "pessoa@dominio.com" nas partes guardadas separadamente. */
export function splitEmail(email: string): { user: string; domain: string } | null {
  const at = email.lastIndexOf("@");
  if (at <= 0 || at === email.length - 1) return null;
  return { user: email.slice(0, at), domain: email.slice(at + 1) };
}

/** Remonta o endereco a partir das partes. */
export function joinEmail(parts: { user: string; domain: string }): string {
  return `${parts.user}@${parts.domain}`;
}
