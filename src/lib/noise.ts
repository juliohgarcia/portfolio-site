/**
 * Ruido de Perlin 2D (versao "improved", Ken Perlin, 2002).
 *
 * Por que ruido e nao `Math.random()`: o aleatorio puro da um valor sem
 * relacao com o vizinho — vira chuvisco de TV. O ruido de Perlin e CONTINUO:
 * pontos proximos tem valores proximos. E isso que gera formas organicas,
 * como relevo de terreno, que e exatamente o que as curvas de nivel desenham.
 *
 * Como funciona, em uma frase: o plano e dividido numa grade; cada canto
 * recebe uma direcao (gradiente) pseudoaleatoria, e o valor de um ponto e a
 * mistura suave da "influencia" dos quatro cantos ao redor dele.
 *
 * Retorna valores aproximadamente entre -1 e 1.
 */

/** Tabela de permutacao: embaralha 0..255 de forma deterministica pela semente. */
function buildPermutation(seed: number): Uint8Array {
  const table = new Uint8Array(256);
  for (let i = 0; i < 256; i++) table[i] = i;

  // Gerador linear congruente: deterministico, entao a mesma semente desenha
  // sempre o mesmo "terreno" — util para depurar.
  let state = seed >>> 0 || 1;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let i = 255; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    const swap = table[i]!;
    table[i] = table[j]!;
    table[j] = swap;
  }

  // Duplicada para 512: evita `% 256` no laco quente.
  const doubled = new Uint8Array(512);
  for (let i = 0; i < 512; i++) doubled[i] = table[i & 255]!;
  return doubled;
}

/** Curva 6t^5 - 15t^4 + 10t^3: suaviza a mistura para nao aparecer a grade. */
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Produto escalar com um de 8 gradientes fixos, escolhido pelo hash. */
function grad(hash: number, x: number, y: number): number {
  switch (hash & 7) {
    case 0:
      return x + y;
    case 1:
      return -x + y;
    case 2:
      return x - y;
    case 3:
      return -x - y;
    case 4:
      return x;
    case 5:
      return -x;
    case 6:
      return y;
    default:
      return -y;
  }
}

export function createNoise2D(seed = 1): (x: number, y: number) => number {
  const perm = buildPermutation(seed);

  return (x, y) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[xi]! + yi]!;
    const ab = perm[perm[xi]! + yi + 1]!;
    const ba = perm[perm[xi + 1]! + yi]!;
    const bb = perm[perm[xi + 1]! + yi + 1]!;

    return lerp(
      lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
      lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
      v,
    );
  };
}
