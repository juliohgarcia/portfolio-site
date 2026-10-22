import type { SiteContent } from "./types";
import portfolioShot from "@/assets/projects/portfolio-assinatura.webp";

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
    menuButton: "menu",
    closeButton: "close",
    mainNavLabel: "Main navigation",
    skipToContent: "Skip to content",
    brand: { firstName: "Júlio", lastName: "Garcia", backToTop: "Back to top" },
  },

  hero: {
    eyebrow: "Júlio Henrique Garcia · Erechim, Brazil",
    // A frase do README do GitHub do Julio, igual nos dois idiomas de
    // proposito: quem le o site e o GitHub ve a mesma pessoa (ver CLAUDE.md).
    titleLines: ["Developer", "in the", "making"],
    subtitle:
      "I work on API support and integrations at Autentique. Alongside it, I study Computer Science and learn to build the other side of the software.",
    // Dados reais: Ciencia da Computacao na URI (em andamento) e o inicio dos
    // estudos (fev/2025). Ver "Dados reais no conteudo" no CLAUDE.md.
    status: {
      label: "Current status",
      file: "status.ts",
      headline: "Computer Science",
      detail: "URI",
      footer: "In transition since 2025",
    },
    transition: { serif: "from support to code", sans: "from ticket to commit" },
    signatureLabel: "signed, Júlio",
  },

  about: {
    label: "01 — About",
    title: "Debugging in production teaches you fast",
    paragraphs: [
      "My first support job was in web infrastructure, at Astrus: WHM/cPanel, DNS that will not propagate, company email landing in spam because of a badly configured SPF record, an e-commerce integration losing the order halfway through the payment funnel. A problem that arrives like that does not come with a stack trace — it comes with “it stopped working”.",
      "That is where I learned to work backwards: start from the symptom the client describes and strip away one layer at a time — DNS, server, application, integration — until a single cause is left. And to write down what I found so the dev team could reproduce it without asking me anything. Half the job was technical; the other half was writing it properly.",
      "Today, at Autentique, support is the API itself: I help clients integrate an electronic signature platform. I spend my days reading malformed requests and explaining why the response is not the expected one — which is, essentially, reading other people's code.",
      "I started studying development before I got into support: the web track ran from February to October 2025, and the first job in the field came in November. The road from reading the code to writing it is the one I am on now.",
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
    title: { sans: "What I", serif: "have built" },
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
        image: {
          src: portfolioShot,
          alt: "Screenshot of this site at the end of the hero transition: the dimmed card reading “Developer in the making” with Júlio’s signature drawn over it in lime.",
          width: 1280,
          height: 800,
        },
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
    title: { sans: "Let's", serif: "talk." },
    invitation:
      "I am open to internships and to a first role as a developer — and to talking with anyone walking the same road. If it fits your team, write to me.",
    emailButton: "Send an email",
    pagesLabel: "Pages",
    followLabel: "Find me on",
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

  // Rotulos das tecnologias do carrossel: viram logos (ver Marquee.tsx) e
  // ficam como nome acessivel. So o que ja uso de verdade — o que ainda
  // estou aprendendo aparece marcado nas Skills, e o carrossel nao tem como
  // fazer essa distincao.
  marquee: [
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "PHP",
    "MongoDB",
    "Linux",
    "Git",
    "WordPress",
  ],
} satisfies SiteContent;
