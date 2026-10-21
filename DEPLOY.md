# Deploy

## Vercel (recomendado)

1. Suba o repositório para o GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detecta Vite automaticamente; o `vercel.json` já fixa build e output.
4. Cada push para `main` publica uma nova versão.

### O que o `vercel.json` faz

| Regra                                           | Motivo                                                                                                          |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `rewrites` para `/index.html`                   | Qualquer rota cai na SPA em vez de 404 da Vercel                                                                |
| `/assets/*` com `immutable`, 1 ano              | O Vite põe hash de conteúdo no nome; o arquivo nunca muda sem mudar de nome, então cachear para sempre é seguro |
| `/index.html` com `must-revalidate`             | É o arquivo que aponta para os assets novos — se ele ficar em cache, o deploy não chega a quem já visitou       |
| `nosniff`, `Referrer-Policy`, `X-Frame-Options` | Cabeçalhos básicos; sem custo e evitam alertas em auditoria                                                     |

## Antes de publicar

```bash
npm run lint && npm run typecheck && npm run build && npm run preview
```

E confira que **nenhum `{{PLACEHOLDER}}` sobrou**. O `grep` simples também
acha as menções em comentários, então filtre por linhas que são de fato valor:

```bash
grep -rn '"{{[A-Z_0-9]*}}"' src/content/*.ts
```

Restantes hoje: `{{PERIODO_AUTENTIQUE}}`, `{{PERIODO_FACULDADE}}`,
`{{ANO_INICIO_ESTUDOS}}` e `{{URL_REPO_PORTFOLIO}}` (este sai sozinho quando o
repositório for publicado no GitHub).

Em desenvolvimento, o console do navegador já lista os campos pendentes.

## Domínio próprio

Depois de apontar o domínio na Vercel, atualize em `index.html`:

- `<meta property="og:url">` (ainda não existe — adicione com a URL final)
- confira se `og:image` resolve em `https://seu-dominio/og-image.png`
