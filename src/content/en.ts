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
      "Support analyst at Autentique, focused on API support and integrations. Computer Science student at URI, moving into development. TypeScript, Node.js, PostgreSQL and PHP.",
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
      "I work on API support and integrations at Autentique. Alongside it, I study Computer Science and learn to build the other side of the software.",
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
      { value: "API support", label: "client integrations at Autentique" },
      { value: "13 certificates", label: "OneBitCode · Feb to Oct 2025" },
      { value: "Erechim · Brazil", label: "open to remote roles" },
    ],
  },

  experience: {
    label: "02 — Path",
    title: "How I got here",
    items: [
      {
        period: "Aug 2026 — now",
        role: "Support Analyst",
        company: "Autentique",
        description:
          "API support at a Brazilian electronic signature platform: I help clients integrate the product and get the most out of it. It is the point of the operation closest to the people writing code — reading a malformed request and explaining why is already half of development work.",
        tags: ["REST APIs", "Integrations", "Technical documentation"],
      },
      {
        period: "Nov 2025 — Aug 2026",
        role: "Support Analyst",
        company: "Astrus Digital",
        description:
          "Technical support and web infrastructure: a high volume of tickets, from configuration to platform bugs, diagnosing server and application errors and escalating to the dev team with reproduction steps. I administered hosting environments on WHM/cPanel, configured DNS and custom-domain email (including SPF and deliverability analysis), maintained WordPress sites, handled e-commerce integrations and monitored system health on Datadog. I also translated Figma designs into live interfaces and contributed to front-end adjustments.",
        tags: [
          "Linux",
          "WHM/cPanel",
          "DNS",
          "Datadog",
          "WordPress",
          "phpMyAdmin",
          "Figma",
          "E-commerce",
        ],
      },
      {
        period: "In progress",
        role: "Computer Science",
        company: "URI — Universidade Regional Integrada",
        description:
          "The formal grounding for what I had been learning hands-on: programming logic, data structures, relational databases and networking fundamentals.",
        tags: ["Algorithms", "Data structures", "Databases"],
      },
      {
        period: "Feb 2025 — Oct 2025",
        role: "Web development track",
        company: "OneBitCode · 13 certificates",
        description:
          "A track completed in sequence, from February to October: HTML5 and CSS3, JavaScript across six modules up to ES6+, Git and GitHub, TypeScript, Node.js — including web applications with JWT and bcrypt — and PostgreSQL. February to October, without skipping a step.",
        tags: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "Node.js", "PostgreSQL", "Git"],
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
        items: ["JavaScript (ES6+)", "TypeScript", "PHP", "SQL"],
      },
      {
        name: "Back-end & data",
        items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Laravel (learning)"],
      },
      {
        name: "Front-end",
        items: ["HTML5", "CSS3", "Tailwind", "Figma", "React (learning)", "GSAP (learning)"],
      },
      {
        name: "Infrastructure & support",
        items: ["Linux", "WHM/cPanel", "DNS", "Datadog", "WordPress", "Git & GitHub"],
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
