/**
 * Utilitarios para lidar com os marcadores {{MAIUSCULAS}} do conteudo.
 *
 * Por que isto existe: um campo como `repoUrl: "{{URL_REPO}}"` renderizado
 * direto num `href` produz um link quebrado em producao. Um portfolio com
 * link morto e pior do que um portfolio com um link a menos — ele sugere
 * descuido exatamente para quem esta avaliando cuidado tecnico.
 *
 * Com `isPlaceholder`, os componentes simplesmente nao renderizam o link
 * ainda nao preenchido, e o layout se adapta.
 */

/** Reconhece valores no formato {{ALGO}}. */
export function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return /^\{\{[\s\S]*\}\}$/.test(value.trim());
}

/** Devolve o valor apenas se estiver realmente preenchido. */
export function resolved(value: string | undefined): string | undefined {
  return isPlaceholder(value) ? undefined : value;
}

/**
 * Em desenvolvimento, lista no console o que ainda falta preencher.
 *
 * Fica atras de `import.meta.env.DEV`, entao o bundler remove esta funcao
 * inteira do build de producao — custo zero para quem visita o site.
 */
export function warnAboutPlaceholders(content: unknown): void {
  if (!import.meta.env.DEV) return;

  const found: string[] = [];

  const walk = (node: unknown, path: string) => {
    if (typeof node === "string") {
      if (isPlaceholder(node)) found.push(`${path} = ${node}`);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`));
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        walk(value, path ? `${path}.${key}` : key);
      }
    }
  };

  walk(content, "");

  if (found.length > 0) {
    console.info(
      `[conteúdo] ${found.length} campo(s) ainda com placeholder:\n` + found.join("\n"),
    );
  }
}
