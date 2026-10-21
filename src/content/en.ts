import type { SiteContent } from "./types";

/**
 * Conteudo em ingles.
 *
 * Mantenha paralelo ao pt.ts: mesma estrutura, mesma intencao, sem traducao
 * literal. "Developer in the making" vem do proprio README do Julio no
 * GitHub — manter as palavras dele e o que faz os dois perfis parecerem a
 * mesma pessoa para quem abre os dois.
 */
export const en = {
  meta: {
    title: "Júlio Henrique Garcia — Developer in the making",
    description:
      "IT support analyst at Autentique and Computer Science student, moving into development. TypeScript, Node.js and PostgreSQL.",
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
    mainNavLabel: "Main navigation",
    skipToContent: "Skip to content",
  },

  hero: {
    eyebrow: "Júlio Henrique Garcia · Erechim, Brazil",
    titleLines: ["Support", "to", "developer"],
    subtitle:
      "For 11 months I have been fixing problems for the people who use the software. Alongside it, I study Computer Science and learn to build it.",
    scrollHint: "scroll",
  },

  about: {
    label: "01 — About",
    title: "Debugging in production teaches you fast",
    paragraphs: [
      "I work in technical support, at the exact point where software meets real life. My job is to receive the problem already in progress: the confusing log, the person losing patience on the other end, the error that only shows up in one specific setup.",
      "That is where you learn what no course teaches well — reproducing an error from a vague description, isolating the problems until a single cause is left. And translating: from what someone reports to what the system actually did.",
      "Alongside that I am on the other side, writing the code. I brought the habit of asking “what happens when this fails?” before asking “how do I make this work?”. Support teaches you that order early, and it holds on either side of the stack.",
    ],
    highlights: [
      { value: "11+", label: "months debugging production systems" },
      { value: "PHP & Laravel", label: "current focus" },
      { value: "Erechim · Brazil", label: "open to remote roles" },
    ],
  },

  experience: {
    label: "02 — Path",
    title: "How I got here",
    items: [
      {
        period: "{{PERIODO_AUTENTIQUE}}",
        role: "IT Support Analyst",
        company: "Autentique",
        description:
          "End-to-end incident handling: reproducing the issue, analysing logs, escalating to engineering and communicating with whoever reported it. I am the bridge between the user's account and the technical cause.",
        tags: ["Log analysis", "SQL", "REST APIs", "Documentation"],
      },
      {
        period: "{{PERIODO_ASTRUS}}",
        role: "Tier 1 Support Analyst",
        company: "Astrus Digital",
        description:
          "First contact with support at scale: triaging and resolving first-level tickets, writing down what had no documentation and routing what needed another team.",
        tags: ["Tier 1 support", "Ticket triage", "Documentation"],
      },
      {
        period: "{{PERIODO_FACULDADE}}",
        role: "Computer Science",
        company: "Degree in progress",
        description:
          "The formal grounding for what I had been learning hands-on: programming logic, data structures, relational databases and networking fundamentals.",
        tags: ["Algorithms", "Data structures", "Databases"],
      },
      {
        period: "{{ANO_INICIO_ESTUDOS}} — now",
        role: "Moving into development",
        company: "Self-directed study",
        description:
          "Continuous study through my own projects and public notes: JavaScript and TypeScript, APIs with Node.js and Express, PostgreSQL, and now PHP and Laravel. This site is one of those projects — built from scratch to properly learn motion on the web.",
        tags: ["TypeScript", "Node.js", "PostgreSQL", "React"],
      },
    ],
  },

  projects: {
    label: "03 — Work",
    title: "What I have built",
    intro:
      "One, for now — but built from scratch, with the technical decisions documented rather than hidden. The next ones land here as I finish them.",
    items: [
      {
        name: "This portfolio",
        year: "2026",
        description:
          "Single-page landing with smooth scroll, scroll-driven animation and display typography. The most interesting decision was making Lenis and ScrollTrigger share a single animation loop: letting each keep its own requestAnimationFrame is what makes parallax jitter on most smooth-scroll sites. Every animation goes through gsap.matchMedia(), so anyone asking for reduced motion gets the site with no animation at all — and no text depends on JavaScript to be visible.",
        tags: ["React", "TypeScript", "GSAP", "Tailwind", "Vite"],
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
      "What I already use with confidence and what I am learning right now — marked differently, because the distinction matters to whoever is hiring.",
    groups: [
      {
        name: "Languages",
        items: ["JavaScript", "TypeScript", "PHP", "SQL"],
      },
      {
        name: "Back-end & data",
        items: ["Node.js", "Express", "PostgreSQL", "Laravel (learning)"],
      },
      {
        name: "Front-end",
        items: ["Semantic HTML", "CSS", "Tailwind", "React (learning)", "GSAP (learning)"],
      },
      {
        name: "Brought from support",
        items: [
          "Systematic debugging",
          "Log reading",
          "Technical communication",
          "Documentation",
          "Git · Linux",
        ],
      },
    ],
  },

  contact: {
    label: "05 — Contact",
    title: "Let's talk",
    invitation:
      "I am open to internships and to a first role as a developer — and to talking with anyone walking the same road. If it fits your team, write to me.",
    email: "julio.henriqu3@hotmail.com",
    links: [
      { label: "GitHub", handle: "@juliohgarcia", href: "https://github.com/juliohgarcia" },
      {
        label: "LinkedIn",
        handle: "in/juliohgarcia",
        href: "https://www.linkedin.com/in/juliohgarcia/",
      },
      {
        label: "Instagram",
        handle: "@juliohenriqu3",
        href: "https://www.instagram.com/juliohenriqu3/",
      },
    ],
  },

  footer: {
    note: "Júlio Henrique Garcia · Southern Brazil",
    builtWith: "Built with React, TypeScript and GSAP",
  },

  marquee: ["Support → Dev", "TypeScript", "Node.js", "PostgreSQL", "Open to internships"],
} satisfies SiteContent;
