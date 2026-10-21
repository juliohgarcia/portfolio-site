import type { SiteContent } from "./types";

/**
 * Conteudo em portugues.
 *
 * Dados reais extraidos do perfil publico do GitHub (README de
 * github.com/juliohgarcia, outubro/2026). O LinkedIn bloqueia acesso
 * automatizado (HTTP 999), entao nada foi tirado de la.
 *
 * Marcadores {{MAIUSCULAS}} sao os campos que ainda faltam. Procure por
 * "{{" antes de publicar: nenhum deve sobrar no ar.
 */
export const pt = {
  meta: {
    title: "Júlio Henrique Garcia — Desenvolvedor em formação",
    description:
      "Analista de suporte na Autentique, com foco em suporte a API e integrações. Estudante de Ciência da Computação na URI, em transição para o desenvolvimento. TypeScript, Node.js, PostgreSQL e PHP.",
  },

  nav: {
    items: [
      { label: "Sobre", href: "#sobre" },
      { label: "Trajetória", href: "#trajetoria" },
      { label: "Projetos", href: "#projetos" },
      { label: "Skills", href: "#skills" },
      { label: "Contato", href: "#contato" },
    ],
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    mainNavLabel: "Navegação principal",
    skipToContent: "Pular para o conteúdo",
  },

  hero: {
    eyebrow: "Júlio Henrique Garcia · Erechim, RS",
    titleLines: ["Suporte", "vira", "código"],
    subtitle:
      "Trabalho com suporte a API e integrações na Autentique. Em paralelo, estudo Ciência da Computação e aprendo a construir o outro lado do software.",
    scrollHint: "role",
  },

  about: {
    label: "01 — Sobre",
    title: "Quem depura em produção aprende rápido",
    paragraphs: [
      "Trabalho com suporte técnico, no ponto exato em que o software encontra a vida real. Meu trabalho é receber o problema já acontecendo: o log confuso, a pessoa sem paciência do outro lado, o erro que só aparece em uma configuração específica.",
      "É ali que se aprende o que curso nenhum ensina bem — reproduzir um erro a partir de uma descrição vaga, isolar os problemas até sobrar uma causa só. E aprendi a traduzir: do que a pessoa relata para o que o sistema de fato fez.",
      "Em paralelo estou do outro lado, escrevendo o código. Trouxe comigo o hábito de perguntar “o que acontece quando isso falha?” antes de perguntar “como faço isso funcionar?”. É uma ordem de perguntas que o suporte ensina cedo, e que continua valendo de qualquer lado da stack.",
    ],
    highlights: [
      { value: "Suporte a API", label: "integrações de clientes na Autentique" },
      { value: "13 certificados", label: "OneBitCode · fev a out de 2025" },
      { value: "Erechim · RS", label: "disponível para remoto" },
    ],
  },

  experience: {
    label: "02 — Trajetória",
    title: "O caminho até aqui",
    items: [
      {
        period: "ago. 2026 — hoje",
        role: "Analista de Suporte",
        company: "Autentique",
        description:
          "Suporte a API numa plataforma de assinatura eletrônica: ajudo clientes a integrar o produto e a tirar proveito dele. É o ponto da operação mais próximo de quem escreve código — ler uma requisição malformada e explicar o porquê já é metade do trabalho de desenvolvimento.",
        tags: ["APIs REST", "Integrações", "Documentação técnica"],
      },
      {
        period: "nov. 2025 — ago. 2026",
        role: "Analista de Suporte",
        company: "Astrus Digital",
        description:
          "Suporte técnico e infraestrutura web: alto volume de chamados, de configuração a bugs de plataforma, com diagnóstico de erros de servidor e aplicação e escalonamento para o time de desenvolvimento com passos de reprodução. Administrei ambientes de hospedagem em WHM/cPanel, configurei DNS e e-mail corporativo (incluindo análise de SPF e entregabilidade), mantive sites WordPress, cuidei de integrações de e-commerce e monitorei a saúde dos sistemas no Datadog. Também traduzi telas do Figma para interface e contribuí com ajustes de front-end.",
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
        period: "Em andamento",
        role: "Ciência da Computação",
        company: "URI — Universidade Regional Integrada",
        description:
          "Base formal do que eu vinha aprendendo na prática: lógica de programação, estruturas de dados, bancos de dados relacionais e fundamentos de redes.",
        tags: ["Algoritmos", "Estruturas de dados", "Bancos de dados"],
      },
      {
        period: "fev. 2025 — out. 2025",
        role: "Formação em desenvolvimento web",
        company: "OneBitCode · 13 certificados",
        description:
          "Trilha concluída em sequência, de fevereiro a outubro: HTML5 e CSS3, JavaScript em seis módulos até ES6+, Git e GitHub, TypeScript, Node.js — incluindo aplicações web com JWT e bcrypt — e PostgreSQL. De fevereiro a outubro, sem pular etapa.",
        tags: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "Node.js", "PostgreSQL", "Git"],
      },
    ],
  },

  projects: {
    label: "03 — Projetos",
    title: "O que eu construí",
    intro:
      "Por enquanto, um só — mas construído do zero, com as decisões técnicas documentadas em vez de escondidas. Os próximos vêm aqui conforme eu terminar.",
    items: [
      {
        name: "Este portfólio",
        year: "2026",
        description:
          "Landing page de página única com smooth scroll, animação disparada por scroll e tipografia display. A decisão técnica mais interessante foi fazer o Lenis e o ScrollTrigger compartilharem um único loop de animação: cada um com seu próprio requestAnimationFrame é o que faz parallax tremer na maioria dos sites com scroll suave. Toda animação passa por gsap.matchMedia(), então quem pede “reduzir movimento” recebe o site sem animação nenhuma — e nenhum texto depende de JavaScript para ficar visível.",
        tags: ["React", "TypeScript", "GSAP", "Tailwind", "Vite"],
        repoUrl: "{{URL_REPO_PORTFOLIO}}",
      },
    ],
    viewRepo: "Código",
    viewLive: "Ver no ar",
  },

  skills: {
    label: "04 — Skills",
    title: "Com o que eu trabalho",
    intro:
      "O que já uso com confiança e o que estou aprendendo agora — marcados de forma diferente, porque a distinção importa para quem vai me contratar.",
    groups: [
      {
        name: "Linguagens",
        items: ["JavaScript (ES6+)", "TypeScript", "PHP", "SQL"],
      },
      {
        name: "Back-end & dados",
        items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Laravel (aprendendo)"],
      },
      {
        name: "Front-end",
        items: ["HTML5", "CSS3", "Tailwind", "Figma", "React (aprendendo)", "GSAP (aprendendo)"],
      },
      {
        name: "Infraestrutura & suporte",
        items: ["Linux", "WHM/cPanel", "DNS", "Datadog", "WordPress", "Git & GitHub"],
      },
    ],
  },

  contact: {
    label: "05 — Contato",
    title: "Vamos conversar",
    invitation:
      "Estou aberto a vagas de estágio e às primeiras oportunidades como desenvolvedor — e também a trocar ideia com quem está na mesma estrada. Se fizer sentido para o seu time, me escreva.",
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
    note: "Júlio Henrique Garcia · Rio Grande do Sul, Brasil",
    builtWith: "Construído com React, TypeScript e GSAP",
  },

  marquee: ["Suporte → Dev", "TypeScript", "Node.js", "PostgreSQL", "Aberto a estágio"],
} satisfies SiteContent;
