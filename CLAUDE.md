# CLAUDE.md

Memória permanente do projeto. Leia antes de alterar código.

## 1. Projeto

Portfólio pessoal do Júlio Garcia: **uma única landing page** de alto impacto visual,
no estilo award-winning de `landonorris.com` (scroll suave, animação por scroll,
parallax, tipografia display grande, microinterações).

Serve a **dois objetivos simultâneos** — eles decidem empates de design:

1. **Portfólio** — provar capacidade técnica de front-end para recrutadores.
2. **Aprendizado** — o Júlio está em transição de analista de suporte para dev. O
   código é material de estudo: comente o **porquê** nos pontos não óbvios
   (GSAP, ScrollTrigger, Lenis, i18n), nunca o óbvio.

Narrativa da página: suporte → desenvolvimento. Seções na ordem:
Hero · Sobre · Experiência · Projetos · Skills · Contato.

Bilíngue **PT/EN** com toggle no header. Visual: dark monocromático + 1 acento.

## 2. Stack — versões fixas (sem `^`)

| Pacote                              | Versão    | Nota                                                |
| ----------------------------------- | --------- | --------------------------------------------------- |
| react / react-dom                   | 19.3.1    |                                                     |
| typescript                          | **6.0.3** | ⚠️ **NÃO subir para 7.x** — ver abaixo              |
| vite                                | 8.3.5     | roda sobre Rolldown                                 |
| @vitejs/plugin-react                | 6.1.2     |                                                     |
| tailwindcss / @tailwindcss/vite     | 4.3.3     | v4 = CSS-first, **sem** tailwind.config.js          |
| gsap                                | 3.15.0    | todos os plugins free desde 3.13 (inclui SplitText) |
| @gsap/react                         | 2.1.2     | hook `useGSAP`                                      |
| lenis                               | 1.3.27    | smooth scroll                                       |
| @fontsource-variable/archivo, inter | 5.3.0     | fontes auto-hospedadas                              |
| @fontsource/instrument-serif        | 5.3.0     | so no logo (Brand.tsx); arquivo estatico de 400     |
| eslint                              | 10.13.0   | flat config                                         |
| typescript-eslint                   | 8.72.0    |                                                     |

**⚠️ Travas conhecidas — não "corrija" sem checar:**

- **TypeScript fica em 6.0.3.** `typescript-eslint@8.72.0` exige
  `typescript >=4.8.4 <6.1.0`. Instalar TS 7 (o `latest` no npm) quebra o lint
  com type-awareness. Reavaliar só quando o `typescript-eslint` suportar TS 7.
- **`baseUrl` não existe no tsconfig.** Deprecado no TS 6, removido no TS 7.
  O alias `@/*` funciona via `paths` sozinho — não readicione `baseUrl`.
- **`manualChunks` só aceita função.** O Vite 8 usa Rolldown, que removeu a forma
  de objeto. Ver `vite.config.ts`.

## 3. Comandos

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # tsc -b && vite build (type-check + build de producao)
npm run preview    # serve o build — sempre confira aqui, nao so no dev
npm run lint       # eslint; deve terminar com zero erros
npm run typecheck  # so os tipos, sem build
npm run format     # prettier --write
```

Deploy: **Vercel**, automático no push para `main`. Configuração fixada em
`vercel.json`; passo a passo e checklist em [`DEPLOY.md`](./DEPLOY.md).

## 4. Estrutura

```
src/
├── main.tsx              entrypoint
├── App.tsx               Shell (decisoes de a11y/device) + composicao das secoes
├── styles/index.css      tokens @theme, @font-face, base, @utility
├── content/              UNICA fonte de texto (types.ts = contrato, pt.ts, en.ts)
│   └── placeholders.ts   isPlaceholder/resolved — campos {{...}} nao viram link
├── i18n/                 LocaleProvider, locale-context (useLocale/useContent), DocumentMeta
├── lib/gsap.ts           UNICO registerPlugin do projeto
├── lib/motion.ts         DURATION, EASE, MOTION_OK / MOTION_REDUCED / MOTION_OK_DESKTOP
├── lib/email.ts          remonta o e-mail em runtime
├── lib/noise.ts          ruido de Perlin 2D (terreno das curvas de nivel)
├── hooks/                useReducedMotion, useIsTouch, useSmoothScroll, useParallax, useIntro
├── components/layout/    SmoothScroll, Header, Brand (logo fixo), LocaleToggle, Footer
├── components/ui/        Preloader, Cursor, Marquee, RevealText, MagneticLink, SectionLabel,
│                         HeroField, ContourField, Scribble, TechIcon
└── components/sections/  Hero, About, Experience, Projects, ProjectCard, Skills, Contact
```

Texto do site **nunca** fica hardcoded em componente — vai para `src/content/`,
senão o bilíngue quebra.

## 5. Convenções

- Componentes `PascalCase.tsx`, um por arquivo, **named export**
  (default só em `App.tsx`).
- Hooks `useCamelCase.ts`, em `src/hooks/`.
- `type` em vez de `interface`. **`any` é erro de lint**, não aviso.
- Props tipadas inline: `function Card({ title }: { title: string })`.
  Extraia um `type` só quando passar de ~4 props.
- Import com alias: `@/lib/gsap`, nunca `../../lib/gsap`.
- `import type` para tipos (exigido por `verbatimModuleSyntax`).
- Estilo via utilities do Tailwind. CSS custom só em `index.css`, como `@utility`.
- Tokens, não valores soltos: `text-paper-dim`, não `text-[#8a8781]`.

## 6. Padrões de animação

**Registro de plugin só em `src/lib/gsap.ts`.** Importe sempre de lá:
`import { gsap, ScrollTrigger } from "@/lib/gsap"`. Nunca `gsap/all`
(arrasta o pacote inteiro para o bundle).

**Sempre `useGSAP`**, nunca `useEffect` com GSAP na mão — ele faz cleanup de
tweens e ScrollTriggers no unmount, o que evita triggers duplicados no Strict
Mode do React 19 (que monta duas vezes em dev).

**Toda animação dentro de `gsap.matchMedia()`:**

```ts
useGSAP(
  () => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      /* animacao completa */
    });
    mm.add(MOTION_REDUCED, () => {
      /* estado final, sem tween */
    });
    return () => mm.revert();
  },
  { scope: containerRef },
);
```

**Um único loop de animação.** O `raf` do Lenis é dirigido pelo `gsap.ticker`
em `SmoothScroll.tsx`, com `lagSmoothing(0)`. Nunca crie um segundo
`requestAnimationFrame` — dois loops disputando o scroll é o que faz parallax
tremer.

**Seções NÃO entram por `React.lazy`.** Já entraram (via um `LazySection`) e
foi removido no commit f37be26: os chunks tinham ~1 kB cada — o peso real é
React + GSAP — e a altura do documento mudando depois da primeira pintura é
exatamente o que quebra `sticky` e `scrub`. Carregar sob demanda só vale
quando o espaço é reservado desde o primeiro render e a altura da página não
muda (como os ícones em `useTechIcons`). Fase 2 (WebGL) continua candidata.

**SplitText e o toggle de idioma.** Trocar PT↔EN muda o texto e invalida os spans
do SplitText. Componentes de texto animado levam `key={locale}` para remontar
limpo, e `split.revert()` no cleanup.

**Secao clara = `theme-light`.** O utilitario em `index.css` so redefine os
tokens de cor (e o `color` do texto). Nunca escreva cor condicional em
componente: `bg-ink`/`text-paper` ja trocam sozinhos dentro dele. O Header
aplica a mesma classe no logo e na barra quando uma `.theme-light` passa
por baixo. O lime de verdade, fora do remapeamento, e `--color-brush`.

**Canvas de fundo com `sticky` exige `overflow-clip`.** `overflow-hidden`
transforma o ancestral em container de scroll e o sticky para de grudar na
tela (ver ContourField.tsx e Experience.tsx).

## 7. Regras obrigatórias

1. **`prefers-reduced-motion` em toda animação.** Sem exceção. Em modo reduzido:
   Lenis não é instanciado (scroll nativo), cursor custom e marquee não montam.
2. **Texto nunca nasce invisível.** Proibido `opacity: 0` em CSS para texto que
   depende de JS para aparecer. O estado inicial escondido é aplicado por JS,
   só quando a animação vai de fato rodar. Isso é o que mantém o site legível
   quando o JS falha.
3. **Mobile-first.** O estilo base é o do celular; `md:` e `lg:` só ampliam.
   Nunca `lg:`-primeiro com override para baixo. Alvos de toque ≥ 44px.
4. **Orçamento de bundle: < 170 kB gzip de JS.** Confira no `npm run build`
   somando os chunks. Estado atual: ~137 kB (os icones de tecnologia chegam
   depois, em ~14 kB, e nao contam). Não há code splitting das seções — ver
   §6.
5. **Foco visível sempre.** Nunca `outline: none` sem substituto.
6. **Contraste verificado, não estimado.** Valores medidos sobre `--color-ink`:
   `paper` 17.7:1 · `lime` 17.5:1 · `paper-dim` 5.53:1 — todos passam AA.
   Variantes com opacidade **não** passam: `paper-dim/70` dá 3.25:1, que só
   é aceitável em texto ≥ 24px. Em texto corrido use o token cheio.

## 8. Fase 1 vs Fase 2

**Fase 1 (atual):** as 6 seções, Lenis, GSAP/ScrollTrigger/SplitText, i18n PT/EN,
preloader com contador, cursor customizado, marquee infinito, deploy na Vercel.

**Fase 2 (não implementar ainda):** Three.js/WebGL no hero · migração para TS 7
quando der · projetos reais no lugar dos placeholders · avaliar `ScrollSmoother`
do GSAP como alternativa ao Lenis.

**Posicionamento (decidido em out/2026):** neutro — "analista de suporte em
transição para desenvolvimento", **sem** especialidade fixa. Não reposicione
como front-end ou fullstack sem o Júlio pedir: a stack real dele é
JS/TS, Node, Express, PostgreSQL e PHP (React e GSAP entram como "aprendendo").
O README do GitHub dele diz "developer in the making" — o site usa as mesmas
palavras de propósito, para os dois perfis lerem como a mesma pessoa.

**Dados reais no conteúdo** (GitHub out/2026 + prints do LinkedIn enviados
pelo Júlio): nome, Autentique (suporte a API, ago/2026 — hoje), Astrus Digital
(nov/2025 — ago/2026, infra web), Ciência da Computação na URI, 13 certificados
OneBitCode (fev—out/2025), Erechim/RS, e-mail e links.

O LinkedIn bloqueia acesso automatizado (HTTP 999 / 301 para login) — qualquer
dado novo de lá precisa vir do próprio Júlio, por print ou PDF.

**Placeholder restante:** `{{URL_REPO_PORTFOLIO}}`, que sai sozinho quando o
repositório for publicado. Confira com:
`grep -rn '"{{[A-Z_0-9]*}}"' src/content/*.ts`

**Nunca invente dado de trajetória.** Na primeira versão eu escrevi descrições
plausíveis para os empregos do Júlio; elas estavam erradas e eram exatamente o
que um entrevistador exploraria. Se faltar dado, use `{{PLACEHOLDER}}` — o
`isPlaceholder` cuida de não renderizar.
