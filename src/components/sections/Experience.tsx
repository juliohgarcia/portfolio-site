import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MOTION_OK, SCENE_END, SCENE_START, SCRUB } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { isPlaceholder } from "@/content/placeholders";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Scribble } from "@/components/ui/Scribble";
import { ContourField } from "@/components/ui/ContourField";

/**
 * Trajetoria como linha do tempo vertical.
 *
 * A linha a esquerda e desenhada por scroll (`scaleY` de 0 a 1 com scrub),
 * o que faz a pagina parecer "escrever" a trajetoria conforme a pessoa rola.
 *
 * E a unica secao clara do site (`theme-light`, ver index.css). A escolha
 * nao e aleatoria: a trajetoria e o capitulo da virada suporte -> dev, e a
 * troca de fundo marca essa virada. O "dev" a pincel atras do titulo diz o
 * mesmo — e so funciona sobre fundo claro, porque o titulo passa por cima
 * dele: preto sobre lime e legivel, off-white sobre lime nao seria.
 */
export function Experience() {
  const { experience } = useContent();
  const { locale } = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // A linha cresce acompanhando o scroll.
        const line = gsap.from(".exp-line", {
          scaleY: 0,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: ".exp-list",
            start: "top 70%",
            end: "bottom 80%",
            scrub: true,
          },
        });

        // Cada item monta amarrado a PROPRIA posicao na tela, nao a um
        // gatilho unico da lista. E isso que faz a trajetoria se escrever
        // conforme a pessoa desce, em vez de aparecer inteira de uma vez.
        const items = gsap.utils.toArray<HTMLElement>(".exp-item").map((item) =>
          gsap.from(item, {
            opacity: 0,
            y: 56,
            // Entra levemente deslocado da linha do tempo e se encaixa nela.
            x: -24,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: SCENE_START,
              end: SCENE_END,
              scrub: SCRUB,
            },
          }),
        );

        return () => {
          line.kill();
          items.forEach((tween) => tween.kill());
        };
      });

      return () => mm.revert();
    },
    { dependencies: [locale], scope: root },
  );

  return (
    <section
      ref={root}
      id="trajetoria"
      // `bg-ink` aqui E o papel: o theme-light redefiniu os tokens. Os cantos
      // arredondados deixam o fundo escuro da pagina aparecer nas bordas, o
      // que faz a secao ler como uma folha por cima do resto.
      // `isolate`: contexto de empilhamento proprio, para o rabisco e as
      // curvas de nivel (`-z-10`) ficarem atras do conteudo, mas na frente
      // do fundo da secao.
      // `overflow-clip` e nao `hidden`: recorta os cantos sem virar container
      // de scroll, o que quebraria o canvas sticky do ContourField.
      className="theme-light bg-ink relative isolate overflow-clip rounded-[2rem] md:rounded-[4rem]"
    >
      {/* Mesmo terreno do trecho escuro acima (ver ContourField): aqui o
          theme-light faz as linhas sairem escuras sobre o papel. */}
      <ContourField />

      <div className="container-page py-28 md:py-40">
        <div className="relative">
          <Scribble className="absolute -top-10 -right-[6%] -z-10 w-[80%] -rotate-[10deg] md:top-[-48%] md:right-[4%] md:w-[48%]" />

          <SectionLabel>{experience.label}</SectionLabel>

          <RevealText
            key={`${locale}-exp-title`}
            as="h2"
            className="text-expanded text-display text-paper mt-8 max-w-3xl"
          >
            {experience.title}
          </RevealText>
        </div>

        {/* A lista e um <ol>: a ordem cronologica e informacao, nao estilo. */}
        <ol className="exp-list relative mt-16 md:mt-24">
          {/* Trilho vertical decorativo, atras dos itens. */}
          <span
            aria-hidden="true"
            className="exp-line bg-ink-line absolute top-2 bottom-2 left-0 w-px md:left-[7.5rem]"
          />

          {experience.items.map((item) => (
            <li
              key={`${item.company}-${item.period}`}
              className="exp-item relative pb-14 pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-[7.5rem_1fr] md:gap-10">
                <p className="text-label text-paper-dim pt-1">{item.period}</p>

                <div className="md:pl-10">
                  {/* Marcador na linha do tempo. */}
                  <span
                    aria-hidden="true"
                    className="bg-lime absolute left-0 h-2 w-2 translate-x-[-3.5px] translate-y-2 rounded-full md:left-[7.5rem]"
                  />

                  <h3 className="text-expanded text-title text-paper">{item.role}</h3>
                  <p className="text-lime mt-1 text-sm">{item.company}</p>
                  <p className="text-paper-dim mt-4 max-w-2xl leading-relaxed">
                    {item.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {/* Filtra chips ainda nao preenchidos, em vez de exibir "{{TAG}}". */}
                    {item.tags
                      .filter((tag) => !isPlaceholder(tag))
                      .map((tag) => (
                        <li
                          key={tag}
                          className="border-ink-line text-paper-dim rounded-full border px-3 py-1 text-xs"
                        >
                          {tag}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
