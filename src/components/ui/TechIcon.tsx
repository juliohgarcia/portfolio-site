import { findIcon, accentFor } from "@/lib/tech-icons";
import { useTechIcons } from "@/hooks/useTechIcons";

/**
 * Icone da tecnologia ao lado do nome da skill.
 *
 * Fica monocromatico por padrao — um mural de logos coloridos brigaria com a
 * paleta e viraria ruido. A cor da marca aparece so no hover do item.
 *
 * O elemento SEMPRE ocupa 16x16, mesmo antes de os dados chegarem e mesmo
 * quando nao existe icone para o rotulo. Isso mantem o alinhamento da lista
 * estavel e garante que o carregamento sob demanda nao mova nada na pagina.
 *
 * `aria-hidden`: o nome da tecnologia ja esta escrito ao lado. O icone nao
 * acrescenta informacao, so reconhecimento visual.
 */
export function TechIcon({ label }: { label: string }) {
  const icons = useTechIcons();
  const icon = icons ? findIcon(icons, label) : null;

  if (!icon) {
    // Espaco reservado: nada se move quando o icone chega.
    return <span aria-hidden="true" className="h-4 w-4 shrink-0" />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="tech-icon h-4 w-4 shrink-0 transition-colors duration-200 group-hover/skill:text-[var(--tech-accent)]"
      // `currentColor` deixa a cor ser controlada pelo CSS do item pai, entao
      // o hover do <li> pinta o icone sem JavaScript.
      fill="currentColor"
      style={{ ["--tech-accent" as string]: accentFor(icon) }}
    >
      <path d={icon.path} />
    </svg>
  );
}
