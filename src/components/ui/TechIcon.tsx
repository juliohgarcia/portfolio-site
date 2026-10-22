import { findIcon, accentFor } from "@/lib/tech-icons";
import { useTechIcons } from "@/hooks/useTechIcons";

/**
 * Icone da tecnologia ao lado do nome — nas Skills e nas tags dos projetos.
 *
 * Fica monocromatico por padrao — um mural de logos coloridos brigaria com a
 * paleta e viraria ruido. A cor da marca aparece so no hover do item,
 * que precisa ter a classe `group/tech`.
 *
 * O elemento SEMPRE ocupa 16x16, mesmo antes de os dados chegarem e mesmo
 * quando nao existe icone para o rotulo. Isso mantem o alinhamento da lista
 * estavel e garante que o carregamento sob demanda nao mova nada na pagina.
 *
 * `aria-hidden`: o nome da tecnologia ja esta escrito ao lado. O icone nao
 * acrescenta informacao, so reconhecimento visual.
 */
export function TechIcon({
  label,
  collapseMissing = false,
}: {
  label: string;
  /**
   * Some de vez quando os dados ja chegaram e nao ha icone para o rotulo.
   * Numa lista vertical (Skills) o espaco vazio alinha os nomes; dentro de
   * uma tag em pilula ele parece defeito. O colapso so afeta a largura da
   * tag, nunca a altura da pagina.
   */
  collapseMissing?: boolean;
}) {
  const icons = useTechIcons();
  const icon = icons ? findIcon(icons, label) : null;

  if (!icon) {
    if (icons && collapseMissing) return null;
    // Espaco reservado: nada se move quando o icone chega.
    return <span aria-hidden="true" className="h-4 w-4 shrink-0" />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="tech-icon h-4 w-4 shrink-0 transition-colors duration-200 group-hover/tech:text-[var(--tech-accent)]"
      // `currentColor` deixa a cor ser controlada pelo CSS do item pai, entao
      // o hover do <li> pinta o icone sem JavaScript.
      fill="currentColor"
      style={{ ["--tech-accent" as string]: accentFor(icon) }}
    >
      <path d={icon.path} />
    </svg>
  );
}
