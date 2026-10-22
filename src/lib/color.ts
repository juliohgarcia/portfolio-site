/**
 * "#e0ff4f" -> "224, 255, 79", para montar `rgba(...)` no canvas.
 *
 * Existe porque os canvas do site (HeroField, ContourField) leem as cores
 * dos tokens CSS em vez de repeti-las em hexadecimal. Assim, dentro do
 * `theme-light`, o mesmo componente desenha com a paleta clara sozinho.
 */
export function hexToRgb(hex: string): string {
  const value = hex.trim().replace("#", "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16)).join(", ");
}

/** Le um token de cor (`--color-*`) como visto pelo elemento — respeita temas. */
export function tokenRgb(element: Element, token: string): string {
  return hexToRgb(getComputedStyle(element).getPropertyValue(token));
}
