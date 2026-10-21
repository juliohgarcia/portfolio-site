import { useCallback, useState } from "react";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { DocumentMeta } from "@/i18n/DocumentMeta";
import { useContent } from "@/i18n/locale-context";
import { SmoothScroll, ScrollRefreshOnFontsReady } from "@/components/layout/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/ui/Preloader";
import { Cursor } from "@/components/ui/Cursor";
import { Marquee } from "@/components/ui/Marquee";
import { IntroContext } from "@/hooks/useIntro";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouch } from "@/hooks/useIsTouch";

/**
 * Shell do site: decide o que montar com base nas preferencias da pessoa.
 *
 * Centralizar essas decisoes aqui tem um motivo: Preloader, Cursor e Marquee
 * nao precisam saber nada sobre acessibilidade ou tipo de dispositivo. Eles so
 * recebem a decisao de existir ou nao. Isso mantem a regra em um lugar unico,
 * em vez de repetida (e esquecida) em cada componente.
 */
function Shell() {
  const prefersReduced = useReducedMotion();
  const isTouch = useIsTouch();
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Sem preloader (movimento reduzido), a entrada ja esta "concluida" —
  // derivado, nao em estado, para continuar correto se a preferencia mudar
  // com a pagina aberta.
  const introDone = prefersReduced || preloaderDone;

  const showPreloader = !prefersReduced && !preloaderDone;
  // O cursor customizado precisa de mouse E de permissao para animar.
  const showCursor = !isTouch && !prefersReduced;

  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      {showCursor && <Cursor />}

      <SmoothScroll>
        <ScrollRefreshOnFontsReady />
        <IntroContext.Provider value={introDone}>
          <Header />
          <PageContent />
          <Footer />
        </IntroContext.Provider>
      </SmoothScroll>
    </>
  );
}

/**
 * Conteudo da pagina.
 *
 * FASE 1C: ainda com secoes de rascunho. A Fase 1D/1E substitui por
 * Hero, About, Experience, Projects, Skills e Contact.
 */
function PageContent() {
  const { hero, about, marquee } = useContent();

  return (
    // `id` e o alvo do "pular para o conteudo" do Header.
    <main id="conteudo">
      <section className="container-page flex min-h-screen flex-col justify-center pt-22">
        <p className="text-label text-paper-dim mb-6">{hero.eyebrow}</p>
        <h1 className="text-expanded text-hero">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="text-lead text-paper-dim mt-8 max-w-xl">{hero.subtitle}</p>
      </section>

      <Marquee items={marquee} />

      <section id="sobre" className="container-page py-32">
        <p className="text-label text-lime mb-8">{about.label}</p>
        <h2 className="text-display text-expanded mb-12 max-w-4xl">{about.title}</h2>
        {about.paragraphs.map((text) => (
          <p key={text.slice(0, 24)} className="text-lead text-paper-dim mb-8 max-w-2xl">
            {text}
          </p>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <DocumentMeta />
      <Shell />
    </LocaleProvider>
  );
}
