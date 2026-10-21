import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { isPlaceholder } from "@/content/placeholders";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Trajetoria como linha do tempo vertical.
 *
 * A linha a esquerda e desenhada por scroll (`scaleY` de 0 a 1 com scrub),
 * o que faz a pagina parecer "escrever" a trajetoria conforme a pessoa rola.
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

        const items = gsap.from(".exp-item", {
          opacity: 0,
          y: 40,
          duration: DURATION.base,
          ease: EASE.expoOut,
          stagger: 0.15,
          scrollTrigger: { trigger: ".exp-list", start: "top 75%", once: true },
        });

        return () => {
          line.kill();
          items.kill();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [locale], scope: root },
  );

  return (
    <section ref={root} id="trajetoria" className="container-page py-28 md:py-40">
      <SectionLabel>{experience.label}</SectionLabel>

      <RevealText
        key={`${locale}-exp-title`}
        as="h2"
        className="text-expanded text-display text-paper mt-8 max-w-3xl"
      >
        {experience.title}
      </RevealText>

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
                <p className="text-paper-dim mt-4 max-w-2xl leading-relaxed">{item.description}</p>

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
    </section>
  );
}
