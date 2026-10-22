import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK, SCRUB } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { useIntroDone } from "@/hooks/useIntro";
import { RevealText } from "@/components/ui/RevealText";
import { HeroField } from "@/components/ui/HeroField";

/**
 * Hero: a tipografia display e o elemento principal da pagina.
 *
 * As linhas do titulo vem de `content.hero.titleLines` — uma string por linha,
 * em vez de uma frase com <br>. Motivo: em PT o titulo tem tres palavras curtas
 * e em EN tem outra divisao. Deixar a quebra no conteudo permite que cada
 * idioma escolha o proprio ritmo visual, sem CSS condicional.
 */
export function Hero() {
  const { hero } = useContent();
  const { locale } = useLocale();
  const introDone = useIntroDone();
  const root = useRef<HTMLDivElement>(null);

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
          .from(".hero-hint", { opacity: 0, duration: DURATION.base, ease: EASE.softOut }, 1.1);

        // --- SAIDA AMARRADA AO SCROLL ---
        // O hero nao apenas some: ele recua. O titulo sobe e perde escala
        // enquanto a secao seguinte avanca por cima, o que da a leitura de
        // camadas empilhadas em vez de blocos em sequencia.
        //
        // `scrub` faz o progresso seguir o scroll: parar o dedo para o
        // movimento no meio, subir o desfaz. Sem isso seria so um fade.
        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: SCRUB,
          },
        });

        exit
          .to(".hero-title", { yPercent: -18, scale: 0.92, opacity: 0.25, ease: "none" }, 0)
          // fromTo com `immediateRender: false`, e nao `to`: estes elementos
          // tambem tem a entrada acima, que os deixa em opacity 0 ate rodar.
          // Um `to` grava o valor de partida no primeiro render — se isso
          // acontecer antes da entrada terminar, a saida "lembra" opacity 0 e
          // o elemento fica apagado para sempre. Declarar o ponto de partida
          // remove a dependencia de ordem entre as duas animacoes.
          .fromTo(
            ".hero-eyebrow, .hero-subtitle",
            { opacity: 1, y: 0 },
            { opacity: 0, y: -30, ease: "none", immediateRender: false },
            0,
          )
          .fromTo(
            ".hero-hint",
            { opacity: 1 },
            { opacity: 0, ease: "none", immediateRender: false },
            0,
          );

        // Indicador de scroll em loop suave — convida a rolar sem ser um GIF.
        const hint = gsap.to(".hero-hint-line", {
          scaleY: 0.3,
          transformOrigin: "top center",
          duration: 1.2,
          ease: EASE.quartInOut,
          repeat: -1,
          yoyo: true,
        });

        return () => {
          tl.kill();
          hint.kill();
          exit.kill();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [introDone, locale], scope: root },
  );

  return (
    <section
      ref={root}
      // min-h-dvh e nao min-h-screen: no mobile, `100vh` ignora a barra de
      // endereco do navegador e corta o conteudo. `dvh` acompanha a altura
      // realmente visivel.
      //
      // `isolate` cria um contexto de empilhamento proprio. Sem ele, o
      // `-z-10` do HeroField desce ate o contexto da raiz e e pintado ANTES
      // do fundo do <body> — que e opaco (o index.html da fundo ao <html>,
      // entao o body pinta o seu em vez de propaga-lo). O canvas era
      // desenhado normalmente, so que escondido atras de uma camada preta.
      className="relative isolate flex min-h-dvh flex-col justify-between pt-28 pb-10 md:pt-32"
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

      <div className="container-page flex items-end justify-between gap-8">
        <p className="hero-subtitle text-lead text-paper-dim max-w-md">{hero.subtitle}</p>

        <div className="hero-hint hidden shrink-0 items-center gap-3 md:flex">
          <span className="text-label text-paper-dim">{hero.scrollHint}</span>
          <span aria-hidden="true" className="bg-paper-dim/40 block h-16 w-px overflow-hidden">
            <span className="hero-hint-line bg-lime block h-full w-px" />
          </span>
        </div>
      </div>
    </section>
  );
}
