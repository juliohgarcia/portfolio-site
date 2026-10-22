import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK } from "@/lib/motion";
import { useIntroDone } from "@/hooks/useIntro";

/**
 * Revela texto linha por linha, cada linha subindo por tras de uma mascara.
 *
 * -------------------------------------------------------------------------
 * POR QUE O TEXTO NUNCA FICA INVISIVEL
 * -------------------------------------------------------------------------
 * O texto e renderizado normalmente no HTML. Quem esconde as linhas e o
 * `gsap.from()`, que roda somente dentro do bloco MOTION_OK. Ou seja:
 *   - JS falhou?            o texto esta la, visivel.
 *   - movimento reduzido?   o bloco nao roda, o texto esta visivel.
 *   - animacao rodou?       o texto termina visivel.
 * Nao existe `opacity: 0` em CSS esperando um trigger que talvez nao venha.
 * Essa e a regra numero 2 do CLAUDE.md, e este arquivo e onde ela mais importa.
 * -------------------------------------------------------------------------
 *
 * Tres opcoes do SplitText fazem o trabalho pesado:
 *
 * - `aria: "auto"` — coloca o texto original em `aria-label` no container e
 *   esconde os fragmentos do leitor de tela. Sem isso, o SplitText transforma
 *   um titulo em dezenas de <span> e alguns leitores de tela leem
 *   letra por letra. Esta e a opcao que torna o efeito aceitavel.
 * - `mask: "lines"` — embrulha cada linha num container com overflow oculto,
 *   o que permite a linha surgir "de tras" da anterior em vez de so aparecer.
 * - `autoSplit: true` — refaz o corte quando a fonte carrega ou a janela muda
 *   de largura. Sem ele, o texto quebrado com a fonte de fallback mantem as
 *   linhas antigas depois da troca pela webfont, e as mascaras cortam no
 *   lugar errado.
 */

type RevealTextProps = {
  children: ReactNode;
  /** Tag renderizada. Use a hierarquia semantica correta: h1, h2, p... */
  as?: ElementType;
  className?: string;
  /**
   * "scroll" (padrao) revela quando entra na viewport.
   * "intro" revela assim que o preloader termina — para o hero.
   */
  trigger?: "scroll" | "intro";
  /** Atraso em segundos, para escalonar elementos irmaos. */
  delay?: number;
  /** Texto puro usado como `aria-label` quando `children` tem marcacao. */
  ariaLabel?: string;
};

export function RevealText({
  children,
  as: Tag = "p",
  className,
  trigger = "scroll",
  delay = 0,
  ariaLabel,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroDone();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // O hero espera o preloader sair; se animasse antes, a entrada mais
      // importante do site aconteceria atras da cortina.
      if (trigger === "intro" && !introDone) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          // As mascaras ganham a classe `reveal-line-mask` (o SplitText soma
          // "-mask" ao linesClass). Ela da folga vertical a mascara — ver
          // index.css. Sem isso, acento e cedilha do titulo eram cortados.
          linesClass: "reveal-line",
          aria: "auto",
          autoSplit: true,
          // Devolver a animacao dentro de onSplit e o contrato do GSAP para
          // re-split: ele reverte a animacao antiga antes de recortar.
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: DURATION.reveal,
              ease: EASE.expoOut,
              stagger: 0.08,
              delay,
              ...(trigger === "scroll"
                ? {
                    scrollTrigger: {
                      trigger: el,
                      // Comeca quando o topo do elemento passa de 85% da
                      // altura da viewport: a animacao acontece a vista, nao
                      // antes de a pessoa chegar nela.
                      start: "top 85%",
                      once: true,
                    },
                  }
                : {}),
            }),
        });

        return () => {
          // revert() desfaz o corte e devolve o HTML original. Sem isso, a
          // troca de idioma deixaria spans orfaos no DOM.
          split.revert();
        };
      });

      return () => mm.revert();
    },
    // `children` nas dependencias: ao trocar PT/EN o texto muda, o efeito roda
    // de novo e o SplitText recorta o texto novo. Sem isso o site mostraria o
    // texto novo com as mascaras do texto antigo.
    { dependencies: [children, introDone, trigger, delay], scope: ref },
  );

  return (
    <Tag ref={ref} className={className} aria-label={ariaLabel}>
      {children}
    </Tag>
  );
}
