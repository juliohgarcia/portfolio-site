import { useRef } from "react";
import { useContent, useLocale } from "@/i18n/locale-context";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const { projects } = useContent();
  const { locale } = useLocale();
  const root = useRef<HTMLElement>(null);

  return (
    <section ref={root} id="projetos" className="container-page py-28 md:py-40">
      <SectionLabel>{projects.label}</SectionLabel>

      <RevealText
        key={`${locale}-proj-title`}
        as="h2"
        className="text-expanded text-display text-paper mt-8 max-w-3xl"
      >
        {projects.title}
      </RevealText>

      <RevealText key={`${locale}-proj-intro`} className="text-lead text-paper-dim mt-6 max-w-xl">
        {projects.intro}
      </RevealText>

      <ul className="mt-16 md:mt-24">
        {projects.items.map((project, index) => (
          <ProjectCard
            key={`${project.name}-${index}`}
            project={project}
            index={index}
            labels={{ viewRepo: projects.viewRepo, viewLive: projects.viewLive }}
          />
        ))}
      </ul>
    </section>
  );
}
