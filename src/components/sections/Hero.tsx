import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK, SCRUB } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { useIntroDone } from "@/hooks/useIntro";
import { RevealText } from "@/components/ui/RevealText";
import { HeroField } from "@/components/ui/HeroField";
import { Signature, SIGNATURE_STROKE } from "@/components/ui/Signature";
import { StatusCard } from "@/components/ui/StatusCard";
import { hideStrokes } from "@/lib/draw";

/**
 * Hero: a tipografia display e o elemento principal da pagina.
 *
 * As linhas do titulo vem de `content.hero.titleLines` — uma string por linha,
 * em vez de uma frase com <br>. Motivo: em PT o titulo tem tres palavras curtas
 * e em EN tem outra divisao. Deixar a quebra no conteudo permite que cada
 * idioma escolha o proprio ritmo visual, sem CSS condicional.
 *
 * -------------------------------------------------------------------------
 * A TRANSICAO (referencia: o hero do landonorris.com)
 * -------------------------------------------------------------------------
 * O hero nao sai rolando. Ele fica PARADO na tela por ~2 telas de scroll e,
 * nesse tempo, se transforma:
 *
 *   1. o hero claro encolhe e vira um cartao, revelando o verde-musgo atras;
 *   2. duas linhas grandes correm por tras do cartao, em sentidos opostos;
 *   3. o cartao encolhe mais e escurece;
 *   4. a rubrica do Julio se desenha por cima;
 *   5. o musgo escurece ate o preto da secao seguinte, e a pagina segue.
 *
 * COMO O "PARADO" FUNCIONA: a <section> e alta (300vh) e o palco dentro dela
 * e `sticky top-0 h-dvh`. O palco gruda no topo enquanto a secao passa por
 * baixo — sao 200vh de scroll em que nada sobe, so a timeline avanca. E
 * `position: sticky` do CSS, nao `pin` do ScrollTrigger, pelo mesmo motivo
 * do resto do site: o pin reescreve a altura do documento e briga com a
 * troca de idioma.
 *
 * Em movimento reduzido a secao volta a ter a altura de uma tela, sem a
 * pista de 300vh (`motion-safe:`): rolar passa direto pelo hero, como antes.
 * -------------------------------------------------------------------------
 */
export function Hero() {
  const { hero } = useContent();
  const { locale } = useLocale();
  const introDone = useIntroDone();
  const root = useRef<HTMLElement>(null);

  /** Entrada dos elementos secundarios, escalonada apos o titulo. */
  useGSAP(
    () => {
      if (!introDone) return;

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ delay: 0.2 });

        tl.from(".hero-eyebrow", {
          opacity: 0,
          y: 16,
          duration: DURATION.base,
          ease: EASE.expoOut,
        })
          // O subtitulo entra depois do titulo, que leva ~1s revelando linhas.
          .from(
            ".hero-subtitle",
            { opacity: 0, y: 24, duration: DURATION.base, ease: EASE.expoOut },
            0.9,
          )
          .from(
            ".status-card",
            { opacity: 0, y: 24, duration: DURATION.base, ease: EASE.expoOut },
            1.1,
          );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [introDone, locale], scope: root },
  );

  /** A transicao amarrada ao scroll (ver o comentario do componente). */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const strokes = gsap.utils.toArray<SVGPathElement>(".signature-stroke");
        // Estado inicial da rubrica: invisivel pelo tracejado (ver lib/draw.ts).
        const lengths = hideStrokes(strokes, SIGNATURE_STROKE);
        // O CSS deixa a rubrica `invisible` ate aqui: sem JS ela ficaria por
        // cima do titulo desde o inicio. Nao e texto, entao a regra de nunca
        // esconder texto por CSS nao se aplica — e o tracejado acima ja a
        // mantem apagada ate a timeline chegar nela.
        gsap.set(".hero-signature", { visibility: "visible" });

        const ink = getComputedStyle(document.documentElement).getPropertyValue("--color-ink");

        // Uma timeline de duracao 1: as posicoes abaixo (0.3, 0.58...) leem
        // como "porcentagem do scroll da pista". Mais facil de ajustar do que
        // segundos, que aqui nao significam nada — quem manda e o scroll.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: SCRUB,
          },
        });

        // 1. O hero vira cartao.
        tl.fromTo(
          ".hero-card",
          { scale: 1, borderRadius: 0 },
          { scale: 0.84, borderRadius: 32, duration: 0.3, ease: "power1.inOut" },
          0,
        )
          // fromTo com `immediateRender: false` nos elementos que a entrada
          // tambem anima: um `to` gravaria o valor de partida no primeiro
          // render, e se isso acontecesse antes de a entrada terminar, a
          // saida "lembraria" opacity 0 para sempre.
          // O cartao de status se desfaz de baixo para cima, com o corte em
          // DIAGONAL. O clip-path e um poligono de 4 pontos; os dois de baixo
          // sobem juntos, mas o da direita sempre 40% acima do da esquerda —
          // e essa diferenca constante que inclina a linha de corte. Comeca
          // com os dois abaixo da caixa (140% e 100%: tudo visivel) e termina
          // com os dois acima (0% e -40%: nada visivel). O GSAP interpola os
          // numeros dentro da string, desde que os dois poligonos tenham o
          // mesmo numero de pontos.
          // Sai antes de o cartao grande encolher muito, para os dois nao
          // competirem. `immediateRender: false` pelo mesmo motivo acima: a
          // entrada tambem anima este elemento.
          .fromTo(
            ".status-card",
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 140%)" },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% -40%, 0% 0%)",
              duration: 0.14,
              immediateRender: false,
            },
            0,
          )

          // 2. As linhas correm por tras do cartao a pista inteira.
          .fromTo(".hero-line-a", { xPercent: -8 }, { xPercent: -38, duration: 1 }, 0)
          .fromTo(".hero-line-b", { xPercent: -38 }, { xPercent: -8, duration: 1 }, 0)

          // 3. O cartao encolhe mais, o texto sai e ele escurece — como a
          // foto que fica cinza no site do Lando antes da assinatura.
          .to(".hero-card", { scale: 0.46, duration: 0.3, ease: "power1.inOut" }, 0.3)
          .fromTo(
            ".hero-eyebrow, .hero-subtitle",
            { opacity: 1 },
            { opacity: 0, duration: 0.15, immediateRender: false },
            0.3,
          )
          .to(".hero-dim", { opacity: 0.62, duration: 0.2 }, 0.42);

        // 4. A rubrica, um gesto depois do outro. Cada traco dura o
        // proporcional ao proprio comprimento: o laco grande demora mais que
        // o risquinho, como uma mao de verdade.
        const total = lengths.reduce((sum, length) => sum + length, 0);
        let cursor = 0.58;
        strokes.forEach((path, index) => {
          const duration = (lengths[index]! / total) * 0.32;
          tl.to(path, { strokeDashoffset: 0, duration, ease: "power1.inOut" }, cursor);
          cursor += duration;
        });

        // 5. O musgo escurece ate o preto da secao seguinte: a passagem para
        // o resto da pagina nao tem costura.
        tl.to(".hero-stage", { backgroundColor: ink, duration: 0.12 }, 0.88).to(
          ".hero-lines",
          { opacity: 0, duration: 0.12 },
          0.88,
        );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [locale], scope: root },
  );

  // A frase repete para a linha nunca acabar dentro da tela enquanto corre.
  const repeat = (text: string) => Array.from({ length: 4 }, () => text).join(" · ");

  return (
    <section
      ref={root}
      // Pista de 300vh so quando ha movimento: e ela que segura o palco
      // parado.
      className="relative motion-safe:h-[300vh]"
    >
      {/* Zona em que a barra do header fica sem fundo (ver Header.tsx): os
          200vh em que o palco esta parado e nada rola por baixo dela. Termina
          quando o palco comeca a subir — senao o cartao passaria por baixo de
          uma barra transparente. Em movimento reduzido o hero rola desde o
          inicio, entao a zona nao existe. */}
      <span
        aria-hidden="true"
        data-header-bare=""
        className="pointer-events-none absolute inset-x-0 top-0 h-0 motion-safe:h-[200vh]"
      />

      {/* Zona em que o cartao ainda cobre a faixa do logo: enquanto ela passa
          sob o header, logo e barra ficam no tema claro. Em movimento
          reduzido o hero nao encolhe, entao a zona e a secao toda. */}
      <span
        aria-hidden="true"
        data-header-light=""
        className="pointer-events-none absolute inset-x-0 top-0 h-full motion-safe:h-[32vh]"
      />

      <div className="hero-stage bg-moss sticky top-0 h-dvh overflow-clip">
        {/* Linhas por tras do cartao. Decorativas: repetem a ideia do
            titulo, entao ficam fora da arvore de acessibilidade. */}
        <div
          aria-hidden="true"
          className="hero-lines absolute inset-0 hidden flex-col justify-center gap-2 motion-safe:flex"
        >
          <p className="hero-line-a text-hero text-lime font-serif whitespace-nowrap">
            {repeat(hero.transition.serif)}
          </p>
          <p className="hero-line-b text-expanded text-hero text-paper whitespace-nowrap">
            {repeat(hero.transition.sans)}
          </p>
        </div>

        <div
          // O cartao e o hero de antes, agora claro (`theme-light`): `bg-ink`
          // aqui e o papel, e os pontos do HeroField saem escuros sozinhos.
          // `isolate` mantem o `-z-10` do canvas atras do texto e acima do
          // fundo do cartao.
          className="hero-card theme-light bg-ink absolute inset-0 isolate flex origin-center flex-col justify-between overflow-clip pt-28 pb-10 md:pt-32"
        >
          <HeroField />

          <div className="container-page">
            <p className="hero-eyebrow text-label text-paper-dim mb-8 md:mb-12">{hero.eyebrow}</p>

            <h1 className="hero-title text-expanded text-hero text-paper origin-top">
              {hero.titleLines.map((line, index) => (
                <RevealText
                  // A chave inclui o idioma: trocar PT/EN remonta o componente e
                  // o SplitText recorta o texto novo em vez de reaproveitar
                  // mascaras do texto antigo.
                  key={`${locale}-${line}`}
                  as="span"
                  trigger="intro"
                  delay={index * 0.08}
                  className="block"
                >
                  {line}
                </RevealText>
              ))}
            </h1>
          </div>

          <div className="container-page">
            <p className="hero-subtitle text-lead text-paper-dim max-w-md">{hero.subtitle}</p>
          </div>

          {/* O cartao fica FORA do fluxo, preso no canto: com 272px ele e mais
              alto que a linha do subtitulo, e no fluxo empurrava o conteudo
              do hero para fora da tela. So a partir do tablet e so em telas
              com altura para ele: no celular o hero ja e cheio, e numa tela
              baixa o cartao encostaria no titulo. */}
          <div className="container-page pointer-events-none absolute inset-x-0 bottom-10 hidden justify-end md:flex [@media(max-height:44rem)]:hidden">
            <StatusCard className="pointer-events-auto" />
          </div>

          {/* Veu que escurece o cartao antes da rubrica. Comeca em 0 por CSS —
              nao e texto, e sem JS ele simplesmente nunca aparece. */}
          <div
            aria-hidden="true"
            className="hero-dim bg-moss pointer-events-none absolute inset-0 opacity-0"
          />
        </div>

        <div className="hero-signature pointer-events-none invisible absolute inset-0 hidden items-center justify-center motion-safe:flex">
          <Signature className="w-[min(62vw,24rem)]" />
        </div>
      </div>
    </section>
  );
}
