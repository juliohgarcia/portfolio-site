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
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
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
 * FASE 1D: Hero e About prontos. A Fase 1E adiciona Experience, Projects,
 * Skills e Contact.
 */
function PageContent() {
  const { marquee } = useContent();

  return (
    // `id` e o alvo do "pular para o conteudo" do Header.
    <main id="conteudo">
      <Hero />
      <Marquee items={marquee} />
      <About />
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
