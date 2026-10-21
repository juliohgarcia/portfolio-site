import { useEffect } from "react";
import { useContent } from "./locale-context";

/**
 * Mantem `<title>` e a meta description em sincronia com o idioma ativo.
 *
 * Fica em componente separado do LocaleProvider para que o provider cuide
 * apenas de estado, e porque este so precisa ser montado uma vez na raiz.
 * Nao renderiza nada.
 */
export function DocumentMeta() {
  const { meta } = useContent();

  useEffect(() => {
    document.title = meta.title;

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", meta.description);
  }, [meta]);

  return null;
}
