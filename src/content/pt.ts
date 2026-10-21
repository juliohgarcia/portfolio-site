import type { SiteContent } from "./types";

/**
 * Conteudo em portugues.
 *
 * Marcadores {{MAIUSCULAS}} sao dados que o Julio ainda vai preencher.
 * Procure por "{{" antes de publicar: nenhum deve sobrar no ar.
 */
export const pt = {
  meta: {
    title: "Júlio Garcia — Desenvolvedor Front-end",
    description:
      "Analista de suporte em transição para o desenvolvimento front-end. React, TypeScript e animação na web.",
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
  },

  hero: {
    eyebrow: "Júlio Garcia · Front-end",
    titleLines: ["Suporte", "vira", "código"],
    subtitle:
      "Passei {{ANOS_SUPORTE}} anos resolvendo os problemas de quem usa o software. Agora eu construo o software.",
    scrollHint: "role",
  },

  about: {
    label: "01 — Sobre",
    title: "Quem depura em produção aprende rápido",
    paragraphs: [
      "Comecei no suporte técnico, no ponto exato em que o software encontra a vida real. Meu trabalho era receber o problema já acontecendo: o log confuso, a pessoa sem paciência do outro lado, o bug que só aparece em uma máquina específica.",
      "Aprendi ali o que curso nenhum ensina bem — reproduzir um erro a partir de uma descrição vaga, ler stack trace sem entrar em pânico, isolar variáveis até sobrar uma causa só. E aprendi a traduzir: do que a pessoa relata para o que o sistema de fato fez.",
      "Hoje estou do outro lado, escrevendo o código. Trouxe comigo o hábito de perguntar “o que acontece quando isso falha?” antes de perguntar “como faço isso funcionar?”. Para quem constrói interface, essa ordem muda o resultado.",
    ],
    highlights: [
      { value: "{{ANOS_SUPORTE}}+", label: "anos depurando sistemas em produção" },
      { value: "React", label: "foco atual de estudo" },
      { value: "{{CIDADE}}", label: "disponível para remoto" },
    ],
  },

  experience: {
    label: "02 — Trajetória",
    title: "O caminho até aqui",
    items: [
      {
        period: "{{PERIODO_ATUAL}}",
        role: "Analista de Suporte Técnico",
        company: "{{EMPRESA_ATUAL}}",
        description:
          "Atendimento de incidentes de ponta a ponta: reprodução do problema, análise de logs, escalonamento para engenharia e comunicação com quem reportou. Virei a ponte entre o relato do usuário e a causa técnica.",
        tags: ["SQL", "Análise de logs", "APIs REST", "Documentação"],
      },
      {
        period: "{{PERIODO_ANTERIOR}}",
        role: "{{CARGO_ANTERIOR}}",
        company: "{{EMPRESA_ANTERIOR}}",
        description:
          "{{DESCRICAO_ANTERIOR — o que você fazia e o que isso te ensinou que ainda usa hoje}}",
        tags: ["{{TAG}}", "{{TAG}}"],
      },
      {
        period: "{{ANO_INICIO_ESTUDOS}} — hoje",
        role: "Transição para desenvolvimento",
        company: "Estudo autodirigido",
        description:
          "Estudo contínuo de front-end com projetos próprios: JavaScript e TypeScript, React, acessibilidade e performance. Este site é um deles — construído do zero para aprender animação na web de verdade.",
        tags: ["TypeScript", "React", "GSAP", "Acessibilidade"],
      },
    ],
  },

  projects: {
    label: "03 — Projetos",
    title: "O que eu construí",
    intro: "Projetos onde eu decidi a arquitetura, errei e corrigi. Em ordem de aprendizado.",
    items: [
      {
        name: "{{NOME_DO_PROJETO_1}}",
        year: "{{ANO}}",
        description:
          "{{Em uma ou duas frases: que problema resolve e qual foi a decisão técnica difícil}}",
        tags: ["{{TECNOLOGIA}}", "{{TECNOLOGIA}}"],
        repoUrl: "{{URL_REPO}}",
        liveUrl: "{{URL_DEMO}}",
      },
      {
        name: "{{NOME_DO_PROJETO_2}}",
        year: "{{ANO}}",
        description: "{{Em uma ou duas frases}}",
        tags: ["{{TECNOLOGIA}}", "{{TECNOLOGIA}}"],
        repoUrl: "{{URL_REPO}}",
      },
      {
        name: "Este portfólio",
        year: "2026",
        description:
          "Landing page de página única com smooth scroll, animação por scroll e tipografia display. Construída para estudar GSAP e ScrollTrigger a fundo — incluindo fazer o Lenis e o ScrollTrigger compartilharem um único loop de animação.",
        tags: ["React", "TypeScript", "GSAP", "Tailwind"],
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
      "O que já uso com confiança e o que estou aprendendo agora — separados, porque a diferença importa.",
    groups: [
      {
        name: "Front-end",
        items: ["HTML semântico", "CSS / Tailwind", "JavaScript", "TypeScript", "React"],
      },
      {
        name: "Animação & interação",
        items: ["GSAP", "ScrollTrigger", "Lenis", "Acessibilidade de movimento"],
      },
      {
        name: "Ferramentas",
        items: ["Git", "Vite", "ESLint", "Chrome DevTools", "Figma"],
      },
      {
        name: "Trazidas do suporte",
        items: [
          "Depuração sistemática",
          "Leitura de log",
          "SQL",
          "Comunicação técnica",
          "Documentação",
        ],
      },
    ],
  },

  contact: {
    label: "05 — Contato",
    title: "Vamos conversar",
    invitation:
      "Estou procurando minha primeira oportunidade como desenvolvedor front-end. Se o que você leu aqui faz sentido para o seu time, me escreva.",
    email: "{{EMAIL}}",
    links: [
      { label: "GitHub", handle: "{{GITHUB_HANDLE}}", href: "{{GITHUB_URL}}" },
      { label: "LinkedIn", handle: "{{LINKEDIN_HANDLE}}", href: "{{LINKEDIN_URL}}" },
    ],
  },

  footer: {
    note: "Júlio Garcia · {{CIDADE}}",
    builtWith: "Construído com React, TypeScript e GSAP",
  },

  marquee: ["Suporte → Dev", "React", "TypeScript", "Disponível para projetos", "GSAP"],
} satisfies SiteContent;
