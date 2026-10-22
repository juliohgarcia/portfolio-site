/**
 * A rubrica do Julio, que se desenha no fim do hero.
 *
 * Tracada a mao em cima da foto da assinatura que ele enviou: cinco gestos,
 * na ordem em que uma mao faria — o laco grande, o pequeno cruzamento, as
 * duas hastes e, por ultimo, o traco horizontal que corta tudo.
 *
 * O componente so desenha. QUEM anima e o Hero, porque o desenho faz parte
 * da timeline dele (a rubrica entra depois de o cartao encolher). O
 * mecanismo e o mesmo do Scribble: stroke-dasharray + stroke-dashoffset,
 * explicado la. Cada caminho tem a classe `signature-stroke` para o Hero
 * encontra-los na ordem.
 *
 * Sem JavaScript, ou em movimento reduzido, a rubrica aparece inteira.
 */
const STROKES = [
  // Laco: comeca no alto a direita, desce pela esquerda e sobe na diagonal.
  "M 560 306 C 520 285 470 266 410 262 C 360 259 322 276 308 305 C 292 340 292 420 298 480 " +
    "C 302 520 308 545 322 552 C 345 556 385 515 418 462 C 450 410 478 350 496 290 " +
    "C 506 255 516 215 525 186",
  "M 372 318 C 405 326 440 334 482 342",
  "M 456 283 C 438 300 418 316 398 330",
  "M 496 270 C 488 320 478 370 470 415",
  "M 585 150 C 572 250 558 350 545 450",
  "M 290 362 C 350 348 410 338 470 338 C 520 338 565 348 606 358",
];

/** Espessura, em unidades do viewBox. Exportada: o Hero usa na folga do tracejado. */
export const SIGNATURE_STROKE = 9;

export function Signature({ className = "" }: { className?: string }) {
  return (
    <svg
      // Recorte da foto original so com a assinatura, com margem para as
      // pontas arredondadas.
      viewBox="270 130 360 440"
      aria-hidden="true"
      focusable="false"
      className={`overflow-visible ${className}`}
    >
      <g
        fill="none"
        stroke="var(--color-brush)"
        strokeWidth={SIGNATURE_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {STROKES.map((d) => (
          <path key={d} d={d} className="signature-stroke" />
        ))}
      </g>
    </svg>
  );
}
