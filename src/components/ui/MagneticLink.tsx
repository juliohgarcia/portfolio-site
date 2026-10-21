import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { EASE, MOTION_OK_DESKTOP } from "@/lib/motion";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Abre em nova aba com rel seguro. */
  external?: boolean;
  /** Rotulo exibido no cursor customizado ao passar por cima. */
  cursorLabel?: string;
};

/**
 * Link com efeito magnetico: o conteudo e atraido suavemente na direcao do
 * ponteiro e volta ao lugar quando ele sai.
 *
 * O deslocamento e limitado a poucos pixels de proposito. Microinteracao que
 * move demais deixa o alvo escorregando do cursor e passa a atrapalhar o
 * clique — o efeito tem que ser sentido, nao perseguido.
 *
 * So no desktop com movimento permitido: em touch nao existe ponteiro para
 * seguir, e o deslocamento seria movimento gratuito.
 */
export function MagneticLink({
  href,
  children,
  className,
  external = false,
  cursorLabel,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK_DESKTOP, () => {
        // quickTo reaproveita um tween por propriedade, em vez de criar um
        // novo a cada movimento do ponteiro.
        const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: EASE.expoOut });
        const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: EASE.expoOut });

        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          // Distancia do centro, normalizada para -0.5..0.5 e multiplicada
          // por um deslocamento maximo de 16px.
          const relX = (event.clientX - rect.left) / rect.width - 0.5;
          const relY = (event.clientY - rect.top) / rect.height - 0.5;
          moveX(relX * 16);
          moveY(relY * 16);
        };

        const onLeave = () => {
          moveX(0);
          moveY(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      data-cursor={cursorLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
