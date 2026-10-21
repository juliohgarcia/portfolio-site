/**
 * Ponto ÚNICO de registro dos plugins do GSAP.
 *
 * Por que centralizar:
 * 1. `gsap.registerPlugin()` chamado em varios arquivos e a causa mais comum de
 *    "plugin not found" em build de producao — o bundler faz tree-shaking do
 *    plugin se o registro mora longe do uso.
 * 2. Importamos plugin por plugin (`gsap/ScrollTrigger`), nunca `gsap/all`.
 *    `gsap/all` arrasta o pacote inteiro (~6 MB desempacotado) para o bundle.
 *
 * REGRA DO PROJETO: nenhum outro arquivo chama registerPlugin. Para animar,
 * importe daqui:  import { gsap, ScrollTrigger } from "@/lib/gsap";
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * `lagSmoothing(0)` desliga a correcao automatica de lag do GSAP.
 *
 * Por padrao o GSAP "pula" quadros quando detecta travamento, para a animacao
 * nao atrasar. Com smooth scroll isso briga com o Lenis: o salto dessincroniza
 * a posicao interpolada do scroll da posicao real, e o parallax treme.
 * Com smooth scroll, esta linha e obrigatoria.
 */
gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger, SplitText };
