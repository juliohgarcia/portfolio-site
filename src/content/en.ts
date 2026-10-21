import type { SiteContent } from "./types";

/**
 * Conteudo em ingles.
 *
 * Mantenha paralelo ao pt.ts: mesma estrutura, mesma intencao. Nao e traducao
 * literal — o hero em ingles usa tres linhas curtas porque e isso que funciona
 * na tipografia display.
 *
 * Marcadores {{MAIUSCULAS}} sao dados que o Julio ainda vai preencher.
 */
export const en = {
  meta: {
    title: "Júlio Garcia — Front-end Developer",
    description:
      "Support analyst moving into front-end development. React, TypeScript and motion on the web.",
  },

  nav: {
    items: [
      { label: "About", href: "#sobre" },
      { label: "Path", href: "#trajetoria" },
      { label: "Work", href: "#projetos" },
      { label: "Skills", href: "#skills" },
      { label: "Contact", href: "#contato" },
    ],
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  hero: {
    eyebrow: "Júlio Garcia · Front-end",
    titleLines: ["Support", "to", "developer"],
    subtitle:
      "I spent {{ANOS_SUPORTE}} years fixing problems for the people using the software. Now I build the software.",
    scrollHint: "scroll",
  },

  about: {
    label: "01 — About",
    title: "Debugging in production teaches you fast",
    paragraphs: [
      "I started in technical support, at the exact point where software meets real life. My job was to receive the problem already in progress: the confusing log, the person losing patience on the other end, the bug that only shows up on one specific machine.",
      "That is where I learned what no course teaches well — reproducing an error from a vague description, reading a stack trace without panicking, isolating variables until a single cause is left. And translating: from what someone reports to what the system actually did.",
      "Now I am on the other side, writing the code. I brought the habit of asking “what happens when this fails?” before asking “how do I make this work?”. When you build interfaces, that order changes the outcome.",
    ],
    highlights: [
      { value: "{{ANOS_SUPORTE}}+", label: "years debugging production systems" },
      { value: "React", label: "current focus" },
      { value: "{{CIDADE}}", label: "open to remote" },
    ],
  },

  experience: {
    label: "02 — Path",
    title: "How I got here",
    items: [
      {
        period: "{{PERIODO_ATUAL}}",
        role: "Technical Support Analyst",
        company: "{{EMPRESA_ATUAL}}",
        description:
          "End-to-end incident handling: reproducing the issue, analysing logs, escalating to engineering and communicating with whoever reported it. I became the bridge between the user's account and the technical cause.",
        tags: ["SQL", "Log analysis", "REST APIs", "Documentation"],
      },
      {
        period: "{{PERIODO_ANTERIOR}}",
        role: "{{CARGO_ANTERIOR}}",
        company: "{{EMPRESA_ANTERIOR}}",
        description: "{{DESCRICAO_ANTERIOR — what you did and what it taught you that still helps}}",
        tags: ["{{TAG}}", "{{TAG}}"],
      },
      {
        period: "{{ANO_INICIO_ESTUDOS}} — now",
        role: "Moving into development",
        company: "Self-directed study",
        description:
          "Continuous front-end study through my own projects: JavaScript and TypeScript, React, accessibility and performance. This site is one of them — built from scratch to properly learn motion on the web.",
        tags: ["TypeScript", "React", "GSAP", "Accessibility"],
      },
    ],
  },

  projects: {
    label: "03 — Work",
    title: "What I have built",
    intro: "Projects where I made the architecture calls, got them wrong, and fixed them.",
    items: [
      {
        name: "{{NOME_DO_PROJETO_1}}",
        year: "{{ANO}}",
        description:
          "{{One or two sentences: what problem it solves and the hard technical decision}}",
        tags: ["{{TECNOLOGIA}}", "{{TECNOLOGIA}}"],
        repoUrl: "{{URL_REPO}}",
        liveUrl: "{{URL_DEMO}}",
      },
      {
        name: "{{NOME_DO_PROJETO_2}}",
        year: "{{ANO}}",
        description: "{{One or two sentences}}",
        tags: ["{{TECNOLOGIA}}", "{{TECNOLOGIA}}"],
        repoUrl: "{{URL_REPO}}",
      },
      {
        name: "This portfolio",
        year: "2026",
        description:
          "Single-page landing with smooth scroll, scroll-driven animation and display typography. Built to learn GSAP and ScrollTrigger properly — including making Lenis and ScrollTrigger share a single animation loop.",
        tags: ["React", "TypeScript", "GSAP", "Tailwind"],
        repoUrl: "{{URL_REPO_PORTFOLIO}}",
      },
    ],
    viewRepo: "Code",
    viewLive: "Live",
  },

  skills: {
    label: "04 — Skills",
    title: "What I work with",
    intro:
      "What I already use with confidence and what I am learning right now — kept separate, because the difference matters.",
    groups: [
      {
        name: "Front-end",
        items: ["Semantic HTML", "CSS / Tailwind", "JavaScript", "TypeScript", "React"],
      },
      {
        name: "Motion & interaction",
        items: ["GSAP", "ScrollTrigger", "Lenis", "Motion accessibility"],
      },
      {
        name: "Tooling",
        items: ["Git", "Vite", "ESLint", "Chrome DevTools", "Figma"],
      },
      {
        name: "Brought from support",
        items: [
          "Systematic debugging",
          "Log reading",
          "SQL",
          "Technical communication",
          "Documentation",
        ],
      },
    ],
  },

  contact: {
    label: "05 — Contact",
    title: "Let's talk",
    invitation:
      "I am looking for my first role as a front-end developer. If what you read here fits your team, write to me.",
    email: "{{EMAIL}}",
    links: [
      { label: "GitHub", handle: "{{GITHUB_HANDLE}}", href: "{{GITHUB_URL}}" },
      { label: "LinkedIn", handle: "{{LINKEDIN_HANDLE}}", href: "{{LINKEDIN_URL}}" },
    ],
  },

  footer: {
    note: "Júlio Garcia · {{CIDADE}}",
    builtWith: "Built with React, TypeScript and GSAP",
  },

  marquee: ["Support → Dev", "React", "TypeScript", "Open to work", "GSAP"],
} satisfies SiteContent;
