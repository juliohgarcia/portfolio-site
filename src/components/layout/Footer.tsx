import { useContent } from "@/i18n/locale-context";

/**
 * A faixa final, sobre a moldura lime do Contato.
 *
 * No desktop ela SOBE para dentro dos recortes dos cantos de baixo do cartao
 * (ver `cardShape` em Contact.tsx): `-mt-11` e `h-11` sao a altura do
 * recorte (NOTCH_H, 44px), entao o texto fica centrado nele. Abaixo de `lg`
 * o cartao nao tem recortes e a faixa simplesmente vem depois dele.
 *
 * No desktop o fundo e TRANSPARENTE: a faixa ocupa a largura toda, e com
 * fundo lime ela cobriria tambem o meio da base do cartao, que e musgo. O
 * lime que aparece atras do texto e o da propria moldura.
 *
 * Texto `ink` sobre lime: 17.5:1.
 */
export function Footer() {
  const { footer } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lime text-ink relative lg:bg-transparent">
      <div className="flex flex-col gap-2 px-6 py-6 text-xs font-semibold md:px-10 lg:-mt-11 lg:h-11 lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <p>
          © {year} · {footer.note}
        </p>
        <p>{footer.builtWith}</p>
      </div>
    </footer>
  );
}
