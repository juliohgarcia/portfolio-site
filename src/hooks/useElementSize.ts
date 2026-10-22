import { useEffect, useState } from "react";
import type { RefObject } from "react";

/**
 * Largura e altura de um elemento, atualizadas quando ele muda de tamanho.
 *
 * Existe para desenhos em SVG que precisam das medidas REAIS em px — como a
 * borda com aba do ProjectCard. Esticar um SVG com `preserveAspectRatio="none"`
 * deformaria as curvas; redesenhar o caminho com as medidas certas, nao.
 *
 * ResizeObserver e nao o `resize` da janela: o card muda de altura sozinho
 * quando o idioma troca e o texto quebra em outro lugar, sem a janela mudar.
 */
export function useElementSize<T extends Element>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      // borderBoxSize inclui padding e borda — o tamanho que o SVG cobre.
      const box = entry.borderBoxSize[0];
      if (!box) return;
      setSize({ width: box.inlineSize, height: box.blockSize });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
