import type { ReactNode } from "react";

/**
 * Rotulo numerado de secao ("01 — Sobre").
 *
 * Alem de decorar, da a quem rola uma noção de progresso na pagina — o mesmo
 * papel do indice em um artigo longo.
 */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-label text-lime flex items-center gap-3">
      <span aria-hidden="true" className="bg-lime/40 block h-px w-10" />
      {children}
    </p>
  );
}
