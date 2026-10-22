import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";
import { findIcon } from "@/lib/tech-icons";
import { useTechIcons } from "@/hooks/useTechIcons";

/**
 * Faixa de logos que percorre a tela horizontalmente, sem fim — a mesma
 * ideia da faixa de parceiros do landonorris.com, aqui com a stack.
 *
 * Logos monocromaticos no acento, e nao nas cores de cada marca: dez cores
 * diferentes lado a lado viram um mural de propaganda. Uma cor so faz a
 * faixa ler como parte do site.
 *
 * Como o loop infinito funciona: renderizamos a lista DUAS vezes e animamos o
 * conjunto de `x: 0` ate `x: -50%`. Quando a primeira copia termina de sair, a
 * segunda esta exatamente onde a primeira comecou — o `repeat: -1` reinicia e
 * a emenda e invisivel. E por isso que a duplicata existe; nao e descuido.
 *
 * A velocidade reage ao scroll via `timeScale`: parado, a faixa anda devagar;
 * rolando, ela acelera, e `onUpdate` inverte o sinal conforme a direcao. Esse
 * detalhe e o que faz a faixa parecer ligada a pagina em vez de um GIF.
 *
 * Acessibilidade:
 * - `aria-hidden` na copia duplicada, para o leitor de tela nao ler tudo duas
 *   vezes;
 * - em movimento reduzido nao ha animacao nenhuma: a faixa fica parada e
 *   legivel, o que tambem atende quem tem sensibilidade vestibular (texto em
 *   movimento continuo e um gatilho classico).
 */
export function Marquee({
  items,
  // A faixa abaixo do hero tem linhas em cima e embaixo; a do rodape (dentro
  // do cartao do Contato) nao. O resto do comportamento e o mesmo.
  className = "border-ink-line border-y py-8 md:py-10",
}: {
  items: readonly string[];
  className?: string;
}) {
  const icons = useTechIcons();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tween = gsap.to(track.current, {
          xPercent: -50,
          ease: "none",
          duration: 24,
          repeat: -1,
        });

        // Liga a velocidade ao scroll.
        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            // `getVelocity()` vem em px/s e pode chegar a milhares; dividimos
            // para trazer para uma faixa util e limitamos com clamp para um
            // scroll violento nao fazer a faixa virar um borrao.
            const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 400);
            // direction: 1 rolando para baixo, -1 para cima.
            tween.timeScale(boost * self.direction);
          },
          // Pausa a animacao quando a faixa sai da tela: nao faz sentido
          // gastar quadros animando o que ninguem ve.
          onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
        });

        return () => {
          trigger.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // A lista entra duas vezes em cada copia. Com ~10 logos, uma passada so
  // tem uns 1.700px — menos que um monitor largo, e ai a emenda do loop
  // apareceria como um buraco na borda direita.
  const sequence = [...items, ...items];

  const copy = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {sequence.map((label, index) => {
        const icon = icons ? findIcon(icons, label) : null;
        return (
          <li
            key={`${label}-${index}`}
            // Tamanho fixo desde o primeiro render: os logos chegam sob
            // demanda (useTechIcons) e preenchem um espaco que ja existe,
            // entao a faixa nao muda de largura nem de altura quando chegam.
            className="text-lime mx-7 flex h-10 w-10 shrink-0 items-center justify-center md:mx-12 md:h-12 md:w-12 lg:mx-14"
          >
            {icon && (
              <svg
                viewBox="0 0 24 24"
                className="h-full w-full"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={icon.path} />
              </svg>
            )}
            {/* O nome continua no DOM: e o que o leitor de tela anuncia. */}
            <span className="sr-only-custom">{label}</span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      ref={root}
      className={`overflow-hidden ${className}`}
      // A faixa e decorativa e repetida; agrupamos como <section> sem rotulo
      // seria pior para navegacao, entao fica como div simples.
    >
      <div ref={track} className="flex w-max">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
