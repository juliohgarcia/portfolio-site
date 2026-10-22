# portfolio-site

Portfólio pessoal de Júlio Garcia — landing page única, bilíngue (PT/EN), que
conta a transição de analista de suporte para desenvolvedor: _developer in the
making_.

Seções: Hero · Sobre · Experiência · Projetos · Skills · Contato.

## Stack

Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 · GSAP (ScrollTrigger +
SplitText) · Lenis. Deploy na Vercel.

## Rodando localmente

```bash
npm install
npm run dev
```

## Scripts

| Comando             | O que faz                                 |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | servidor de desenvolvimento               |
| `npm run build`     | type-check + build de produção em `dist/` |
| `npm run preview`   | serve o build de produção                 |
| `npm run lint`      | ESLint                                    |
| `npm run lint:fix`  | ESLint com correção automática            |
| `npm run typecheck` | apenas verificação de tipos               |
| `npm run format`    | Prettier                                  |

## Acessibilidade

O site respeita `prefers-reduced-motion`: com a preferência ativa, o smooth
scroll, o preloader e o cursor customizado são desligados, e as animações são
substituídas pelo estado final. Nenhum texto depende de JavaScript para ficar
visível.

---

Detalhes de arquitetura e convenções em [`CLAUDE.md`](./CLAUDE.md); deploy em
[`DEPLOY.md`](./DEPLOY.md).
