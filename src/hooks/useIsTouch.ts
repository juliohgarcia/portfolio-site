import { useEffect, useState } from "react";

/**
 * Detecta se o dispositivo e primariamente de toque.
 *
 * Usamos media queries de capacidade (`hover` e `pointer`) em vez de
 * `"ontouchstart" in window` ou sniffing de user agent. Motivo: um laptop com
 * tela sensivel ao toque responde "sim" ao teste de touch, mas tem mouse e
 * deveria receber o cursor customizado. `hover: none` descreve a capacidade
 * real, que e o que importa aqui.
 */
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(TOUCH_QUERY).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia(TOUCH_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsTouch(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
