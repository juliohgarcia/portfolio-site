import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";

/**
 * Faixa de texto que percorre a tela horizontalmente, sem fim.
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
  separator = "·",
}: {
  items: readonly string[];
  separator?: string;
}) {
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

  // Uma copia da lista, com separadores entre os itens.
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="text-expanded text-title text-paper px-6">{item}</span>
          <span className="text-lime text-title" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className="border-ink-line overflow-hidden border-y py-6"
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
