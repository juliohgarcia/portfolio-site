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
    title: "Júlio Garcia — Desenvolvedor em formação",
    description:
      "Analista de suporte de TI na Autentique e estudante de Ciência da Computação, em transição para o desenvolvimento. TypeScript, Node.js e PostgreSQL.",
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
    eyebrow: "Júlio Henrique Garcia · Rio Grande do Sul",
    titleLines: ["Suporte", "vira", "código"],
    subtitle:
      "Analista de suporte de TI na Autentique, estudante de Ciência da Computação. Passo os dias resolvendo problemas de quem usa o software — e as noites aprendendo a construí-lo.",
    scrollHint: "role",
  },

  about: {
    label: "01 — Sobre",
    title: "Quem depura em produção aprende rápido",
    paragraphs: [
      "Trabalho com suporte técnico, no ponto exato em que o software encontra a vida real. Meu trabalho é receber o problema já acontecendo: o log confuso, a pessoa sem paciência do outro lado, o erro que só aparece em uma configuração específica.",
      "É ali que se aprende o que curso nenhum ensina bem — reproduzir uma falha a partir de uma descrição vaga, ler stack trace sem entrar em pânico, isolar variáveis até sobrar uma causa só. E traduzir: do que a pessoa relata para o que o sistema de fato fez.",
      "Agora estou aprendendo o outro lado, escrevendo o código. Trouxe comigo o hábito de perguntar “o que acontece quando isso falha?” antes de perguntar “como faço isso funcionar?”. É uma ordem de perguntas que o suporte ensina cedo, e que continua valendo de qualquer lado da stack.",
    ],
    highlights: [
      { value: "Autentique", label: "Analista de Suporte de TI" },
      { value: "Ciência da Computação", label: "graduação em andamento" },
      { value: "RS · GMT-3", label: "aberto a vagas remotas" },
    ],
  },

  experience: {
    label: "02 — Trajetória",
    title: "O caminho até aqui",
    items: [
      {
        period: "{{PERIODO_AUTENTIQUE}}",
        role: "Analista de Suporte de TI",
        company: "Autentique",
        description:
          "Atendimento de incidentes de ponta a ponta: reprodução do problema, análise de logs, escalonamento para a engenharia e comunicação com quem reportou. Sou a ponte entre o relato de quem usa e a causa técnica.",
        tags: ["Análise de logs", "SQL", "APIs REST", "Documentação"],
      },
      {
        period: "{{PERIODO_FACULDADE}}",
        role: "Ciência da Computação",
        company: "Graduação em andamento",
        description:
          "Base formal do que eu vinha aprendendo na prática: lógica de programação, estruturas de dados, bancos de dados relacionais e fundamentos de redes.",
        tags: ["Algoritmos", "Estruturas de dados", "Bancos de dados"],
      },
      {
        period: "{{ANO_INICIO_ESTUDOS}} — hoje",
        role: "Transição para desenvolvimento",
        company: "Estudo autodirigido",
        description:
          "Estudo contínuo com projetos próprios e anotações públicas: JavaScript e TypeScript, APIs com Node.js e Express, PostgreSQL, e agora PHP e Laravel. Este site é um desses projetos — construído do zero para aprender animação na web de verdade.",
        tags: ["TypeScript", "Node.js", "PostgreSQL", "React"],
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
        items: ["JavaScript", "TypeScript", "PHP", "SQL"],
      },
      {
        name: "Back-end & dados",
        items: ["Node.js", "Express", "PostgreSQL", "Laravel (aprendendo)"],
      },
      {
        name: "Front-end",
        items: ["HTML semântico", "CSS", "Tailwind", "React (aprendendo)", "GSAP (aprendendo)"],
      },
      {
        name: "Trazidas do suporte",
        items: [
          "Depuração sistemática",
          "Leitura de log",
          "Comunicação técnica",
          "Documentação",
          "Git · Linux",
        ],
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
