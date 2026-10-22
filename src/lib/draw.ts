import { gsap } from "@/lib/gsap";

/**
 * Deixa caminhos SVG prontos para "se desenhar" com stroke-dashoffset.
 *
 * O mecanismo (explicado em detalhe no Scribble.tsx): um tracejado com traco
 * do tamanho do caminho e offset igual a esse tamanho mostra so o ESPACO —
 * o caminho fica invisivel. Animar o offset ate 0 faz o traco deslizar para
 * dentro, como uma caneta escrevendo.
 *
 * A folga de uma espessura evita um defeito real: com espaco e offset
 * exatamente iguais ao comprimento, sobra um traco de comprimento ZERO na
 * ponta, e a ponta arredondada dele vira um ponto solto na tela.
 *
 * Chame dentro de um bloco `MOTION_OK`: e o estado inicial escondido, que so
 * deve existir quando a animacao vai de fato rodar.
 *
 * Retorna o comprimento de cada caminho, para a timeline dosar a duracao.
 */
export function hideStrokes(paths: readonly SVGPathElement[], strokeWidth: number): number[] {
  return paths.map((path) => {
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: `${length} ${length + strokeWidth * 2}`,
      strokeDashoffset: length + strokeWidth,
    });
    return length;
  });
}
