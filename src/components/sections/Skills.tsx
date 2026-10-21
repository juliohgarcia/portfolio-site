import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DURATION, EASE, MOTION_OK } from "@/lib/motion";
import { useContent, useLocale } from "@/i18n/locale-context";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Skills agrupadas por natureza.
 *
 * O grupo "trazidas do suporte" e proposital: competencias de depuracao e
 * comunicacao tecnica sao o diferencial real do Julio contra outros juniores,
 * e separa-las em vez de misturar com React deixa isso legivel para quem le
 * rapido.
 */
export function Skills() {
  const { skills } = useContent();
  const { locale } = useLocale();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tween = gsap.from(".skill-group", {
          opacity: 0,
          y: 32,
          duration: DURATION.base,
          ease: EASE.expoOut,
          stagger: 0.1,
          scrollTrigger: { trigger: ".skill-grid", start: "top 80%", once: true },
        });

        return () => tween.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [locale], scope: root },
  );

  return (
    <section ref={root} id="skills" className="container-page py-28 md:py-40">
      <SectionLabel>{skills.label}</SectionLabel>

      <RevealText
        key={`${locale}-skills-title`}
        as="h2"
        className="text-expanded text-display text-paper mt-8 max-w-3xl"
      >
        {skills.title}
      </RevealText>

      <RevealText key={`${locale}-skills-intro`} className="text-lead text-paper-dim mt-6 max-w-xl">
        {skills.intro}
      </RevealText>

      <div className="skill-grid mt-16 grid gap-10 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
        {skills.groups.map((group) => (
          <div key={group.name} className="skill-group">
            <h3 className="text-label text-lime border-ink-line border-b pb-4">{group.name}</h3>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li key={item} className="text-paper-dim">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
