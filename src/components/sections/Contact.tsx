import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/motion";
import { hideStrokes } from "@/lib/draw";
import { useContent, useLocale } from "@/i18n/locale-context";
import { isPlaceholder, resolved } from "@/content/placeholders";
import { joinEmail, splitEmail } from "@/lib/email";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useElementSize } from "@/hooks/useElementSize";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { ContourField } from "@/components/ui/ContourField";
import { Signature, SIGNATURE_STROKE } from "@/components/ui/Signature";
import { Marquee } from "@/components/ui/Marquee";

/** Mesmo deslocamento do Header: o titulo da secao nao fica sob a barra. */
const HEADER_OFFSET = -88;

/** A elevacao no meio do topo do cartao. */
const BUMP_H = 40;
/** Os recortes nos cantos de baixo, onde fica o texto do rodape. */
const NOTCH_H = 44;
/** Raio dos cantos e largura das curvas que sobem e descem. */
const RADIUS = 32;
const CURVE = 56;
/**
 * Quando ha recortes. E a MESMA media query do `lg:` do Tailwind, que e
 * quando o Footer sobe para dentro deles (`lg:-mt-11`).
 *
 * Tem que ser a largura da TELA, nao a do cartao. A primeira versao media o
 * cartao (>= 1024px), mas a moldura lime come 20px de cada lado: entre 1024
 * e ~1064px de tela o Footer ja subia e o cartao ainda nao tinha recorte, e
 * o texto do rodape caia sobre o musgo, quase invisivel.
 */
const NOTCH_QUERY = "(width >= 64rem)";

/**
 * Contorno do cartao do rodape, inspirado no do landonorris.com: uma
 * elevacao suave no meio do topo e os dois cantos de baixo recortados, para
 * o texto do rodape morar no lime, dentro do recorte.
 *
 * O MESMO caminho serve de `clip-path` para o cartao inteiro. E isso que
 * deixa o fundo musgo e as curvas de nivel com o formato recortado — com
 * `border-radius` so daria para arredondar os cantos para fora.
 */
function cardShape(width: number, height: number): string {
  const center = width / 2;
  const bumpHalf = Math.min(260, width * 0.2);
  const bumpLeft = center - bumpHalf;
  const bumpRight = center + bumpHalf;

  // Lido a cada redesenho. O cartao muda de largura sempre que a tela muda,
  // entao o useElementSize ja provoca um redesenho na hora certa.
  const hasNotches = window.matchMedia(NOTCH_QUERY).matches;
  const notchW = hasNotches ? Math.min(520, Math.max(380, width * 0.3)) : 0;
  const floor = hasNotches ? height - NOTCH_H : height;

  const path = [
    `M ${RADIUS} ${BUMP_H}`,
    // Topo: sobe na elevacao do meio e desce de volta.
    `L ${bumpLeft - CURVE} ${BUMP_H}`,
    `C ${bumpLeft - CURVE / 2} ${BUMP_H} ${bumpLeft - CURVE / 2} 0 ${bumpLeft} 0`,
    `L ${bumpRight} 0`,
    `C ${bumpRight + CURVE / 2} 0 ${bumpRight + CURVE / 2} ${BUMP_H} ${bumpRight + CURVE} ${BUMP_H}`,
    `L ${width - RADIUS} ${BUMP_H}`,
    `Q ${width} ${BUMP_H} ${width} ${BUMP_H + RADIUS}`,
    `L ${width} ${floor - RADIUS}`,
    `Q ${width} ${floor} ${width - RADIUS} ${floor}`,
  ];

  if (hasNotches) {
    // Base: os cantos ficam no alto (recorte) e o meio desce ate o fim.
    path.push(
      `L ${width - notchW} ${floor}`,
      `C ${width - notchW - CURVE / 2} ${floor} ${width - notchW - CURVE / 2} ${height} ${width - notchW - CURVE} ${height}`,
      `L ${notchW + CURVE} ${height}`,
      `C ${notchW + CURVE / 2} ${height} ${notchW + CURVE / 2} ${floor} ${notchW} ${floor}`,
    );
  }

  path.push(
    `L ${RADIUS} ${floor}`,
    `Q 0 ${floor} 0 ${floor - RADIUS}`,
    `L 0 ${BUMP_H + RADIUS}`,
    `Q 0 ${BUMP_H} ${RADIUS} ${BUMP_H}`,
    "Z",
  );

  return path.join(" ");
}

/**
 * Contato + fechamento da pagina, na estetica do rodape do Lando: moldura
 * lime, cartao musgo recortado, rubrica sobre o titulo em duas vozes,
 * paginas a esquerda, redes a direita e o e-mail no centro.
 *
 * O <footer> de verdade (copyright) continua em Footer.tsx, fora do <main>,
 * pela semantica. Ele encosta neste cartao e ocupa os recortes de baixo.
 */
export function Contact() {
  const { contact, nav, marquee } = useContent();
  const { locale } = useLocale();
  const { scrollTo } = useSmoothScroll();
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(card);

  // O e-mail e remontado em tempo de execucao (ver src/lib/email.ts).
  const emailParts = isPlaceholder(contact.email) ? null : splitEmail(contact.email);
  const email = emailParts ? joinEmail(emailParts) : null;

  /** A rubrica se escreve conforme o cartao sobe na tela. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const strokes = gsap.utils.toArray<SVGPathElement>(".signature-stroke");
        hideStrokes(strokes, SIGNATURE_STROKE);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".contact-title",
            start: "top 85%",
            end: "top 35%",
            scrub: 0.8,
          },
        });
        // Um gesto depois do outro, na ordem em que foram tracados.
        strokes.forEach((path) => tl.to(path, { strokeDashoffset: 0, ease: "power1.inOut" }));

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [locale], scope: root },
  );

  return (
    <section
      ref={root}
      id="contato"
      // A secao E a moldura, de borda a borda e com o fundo preto das Skills
      // continuando: nao ha emenda entre as duas. Por cima, o `glow-lime`
      // (ver index.css) faz o lime subir pelos cantos em V, como o brilho do
      // rodape do Lando. O `pb` e a tira lime embaixo do cartao: a moldura
      // o contorna tambem por baixo, como la.
      className="bg-ink glow-lime relative px-3 pt-32 pb-3 md:px-5 md:pt-48 md:pb-5"
    >
      <div
        ref={card}
        // `isolate` para o `-z-10` das curvas de nivel ficar acima do fundo
        // do cartao. O clip-path recorta fundo E curvas no mesmo formato.
        // Antes da primeira medida (largura 0) nao ha recorte: o cartao
        // aparece retangular por um quadro, em vez de sumir.
        className="bg-moss relative isolate"
        style={width > 0 ? { clipPath: `path("${cardShape(width, height)}")` } : undefined}
      >
        <ContourField />

        <div className="container-page flex flex-col items-center pt-28 pb-12 text-center md:pt-36 lg:pb-16">
          <SectionLabel>{contact.label}</SectionLabel>

          {/* `mt-*` maior que o normal: e o espaco em que a rubrica mora,
              entre o rotulo e o titulo. */}
          <div className="contact-title relative mt-20 md:mt-28">
            {/* A rubrica cruza a primeira palavra PELO ALTO, como a do Lando
                sobre o "ALWAYS" — no meio do titulo ela se misturaria com a
                linha lime de baixo. Decorativa: o nome ja esta no logo. */}
            <Signature className="pointer-events-none absolute -top-16 left-1/2 w-24 -translate-x-[85%] md:-top-28 md:w-40" />

            <h2 className="text-display relative">
              <RevealText
                key={`${locale}-contact-sans`}
                as="span"
                className="text-expanded text-paper block"
              >
                {contact.title.sans}
              </RevealText>
              <RevealText
                key={`${locale}-contact-serif`}
                as="span"
                // 1.15em pelo mesmo motivo de Projetos: a serifa e mais
                // estreita e pareceria uma linha menor no mesmo tamanho.
                className="text-lime block font-serif text-[1.15em] uppercase"
              >
                {contact.title.serif}
              </RevealText>
            </h2>
          </div>

          <RevealText
            key={`${locale}-contact-invite`}
            className="text-lead text-paper-dim mt-8 max-w-xl"
          >
            {contact.invitation}
          </RevealText>

          <div className="mt-16 grid w-full gap-14 md:grid-cols-3 md:items-center">
            {/* Paginas */}
            <nav aria-label={contact.pagesLabel} className="md:order-1">
              <p className="text-label text-paper-dim">{contact.pagesLabel}</p>
              <ul className="mt-4 space-y-1">
                {nav.items.map((item) => (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.href, HEADER_OFFSET)}
                      className="text-expanded text-lead text-paper hover:text-lime min-h-11 leading-tight transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  {/* O item em lime, como o "STORE" do Lando. */}
                  <button
                    type="button"
                    onClick={() => scrollTo(0)}
                    className="text-expanded text-lead text-lime hover:text-paper mt-3 min-h-11 leading-tight transition-colors"
                  >
                    {nav.brand.backToTop}
                  </button>
                </li>
              </ul>
            </nav>

            {/* Redes */}
            <div className="md:order-3">
              <p className="text-label text-paper-dim">{contact.followLabel}</p>
              <ul className="mt-4 space-y-1">
                {contact.links.map((link) => {
                  const href = resolved(link.href);
                  return (
                    <li key={link.label}>
                      {href ? (
                        <MagneticLink
                          href={href}
                          external
                          cursorLabel={link.label}
                          className="text-expanded text-lead text-paper hover:text-lime inline-flex min-h-11 items-center leading-tight transition-colors"
                        >
                          {link.label}
                        </MagneticLink>
                      ) : (
                        // Sem URL preenchida, o rotulo sem link — nunca um
                        // <a> apontando para "{{GITHUB_URL}}".
                        <span className="text-expanded text-lead text-paper-dim">{link.label}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* E-mail no centro, como texto. O botao lime fica na base do
                cartao, sobre a faixa de logos (abaixo). No celular o endereco
                vem PRIMEIRO (`order-first`): e a acao principal da secao, e la
                ela ficaria no fim de duas listas. */}
            {email && (
              <div className="order-first md:order-2">
                <MagneticLink
                  href={`mailto:${email}`}
                  cursorLabel="e-mail"
                  // Fonte de texto e minusculas, nao a display expandida: um
                  // endereco de e-mail em caixa alta larga quebrava no meio
                  // ("...HOTMAIL.C / OM") e e mais dificil de ler e copiar.
                  className="text-lead text-paper hover:text-lime decoration-lime/60 inline-flex min-h-11 items-center underline underline-offset-8 transition-colors"
                >
                  {email}
                </MagneticLink>
              </div>
            )}
          </div>
        </div>

        {/* Base do cartao, como a do Lando: a faixa de logos correndo de
            borda a borda e o botao lime no meio, por cima dela. O `pb` deixa
            a faixa acima dos recortes dos cantos, onde mora o rodape. */}
        <div className="pb-8 lg:pb-16">
          <div className="relative">
            <Marquee items={marquee} className="py-6" />
            {email && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <MagneticLink
                  href={`mailto:${email}`}
                  cursorLabel="e-mail"
                  // O anel musgo separa o botao dos logos lime que passam por
                  // tras dele — lime sobre lime, sem o anel, viraria uma mancha.
                  className="bg-lime text-ink text-label ring-moss pointer-events-auto inline-flex min-h-14 items-center gap-3 rounded-xl px-7 font-bold ring-[14px]"
                >
                  {contact.emailButton}
                  <span aria-hidden="true">↗</span>
                </MagneticLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
