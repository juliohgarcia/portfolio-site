# juliohgarcia

Portfólio pessoal — landing page única, da transição de suporte técnico para
desenvolvimento front-end.

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger + SplitText) · Lenis

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
| `npm run typecheck` | apenas verificação de tipos               |
| `npm run format`    | Prettier                                  |

## Acessibilidade

O site respeita `prefers-reduced-motion`: com a preferência ativa, o smooth scroll
é desligado e as animações são substituídas pelo estado final. Nenhum texto depende
de JavaScript para ficar visível.

---

Detalhes de arquitetura e convenções em [`CLAUDE.md`](./CLAUDE.md).
