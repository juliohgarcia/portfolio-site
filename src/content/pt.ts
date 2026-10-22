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
    menuButton: "menu",
    closeButton: "fechar",
    mainNavLabel: "Navegação principal",
    skipToContent: "Pular para o conteúdo",
    brand: { firstName: "Júlio", lastName: "Garcia", backToTop: "Voltar ao topo" },
  },

  hero: {
    eyebrow: "Júlio Henrique Garcia · Erechim, RS",
    // A frase do README do GitHub do Julio, igual nos dois idiomas de
    // proposito: quem le o site e o GitHub ve a mesma pessoa (ver CLAUDE.md).
    titleLines: ["Developer", "in the", "making"],
    subtitle:
      "Trabalho com suporte a API e integrações na Autentique. Em paralelo, estudo Ciência da Computação e aprendo a construir o outro lado do software.",
    // Dados reais: Ciencia da Computacao na URI (em andamento) e o inicio dos
    // estudos (fev/2025). Ver "Dados reais no conteudo" no CLAUDE.md.
    status: {
      label: "Status atual",
      file: "status.ts",
      headline: "Ciência da Computação",
      detail: "URI",
      footer: "Em transição desde 2025",
    },
    transition: { serif: "do suporte ao código", sans: "do chamado ao commit" },
    signatureLabel: "assinado, Júlio",
  },

  about: {
    label: "01 — Sobre",
    title: "Quem depura em produção aprende rápido",
    paragraphs: [
      "Meu primeiro emprego em suporte foi em infraestrutura web, na Astrus: WHM/cPanel, DNS que não propaga, e-mail corporativo caindo no spam por um registro SPF mal configurado, integração de e-commerce que perde o pedido no meio do funil de pagamento. Problema que chega assim não vem com stack trace — vem com “parou de funcionar”.",
      "Foi ali que aprendi a trabalhar de trás para frente: partir do sintoma que o cliente descreve e eliminar camada por camada — DNS, servidor, aplicação, integração — até sobrar uma causa só. E a registrar o que encontrei de um jeito que o time de desenvolvimento conseguisse reproduzir sem precisar me perguntar nada. Metade do trabalho era técnica; a outra metade era escrever direito.",
      "Hoje, na Autentique, o suporte é a própria API: ajudo clientes a integrar uma plataforma de assinatura eletrônica. Passo os dias lendo requisição malformada e explicando por que a resposta não é a esperada — que é, no fundo, ler o código dos outros.",
      "Comecei a estudar desenvolvimento antes de entrar no suporte: a trilha de web foi de fevereiro a outubro de 2025, e o primeiro emprego na área veio em novembro. O caminho de quem lê o código para quem escreve é o que estou percorrendo agora.",
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
