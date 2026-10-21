import { createContext, useContext } from "react";

/**
 * Sinaliza quando a animacao de entrada (preloader) terminou.
 *
 * Existe porque o hero nao pode comecar a animar enquanto a cortina do
 * preloader esta na frente: as duas animacoes ficariam sobrepostas e a
 * entrada mais importante do site passaria escondida.
 *
 * `true` tambem e o valor quando NAO ha preloader (movimento reduzido),
 * entao os componentes nao precisam saber se ele existiu — so esperam o sinal.
 */
export const IntroContext = createContext<boolean>(true);

export function useIntroDone(): boolean {
  return useContext(IntroContext);
}
