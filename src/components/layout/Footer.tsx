import { useContent } from "@/i18n/locale-context";

/**
 * A faixa final, sobre a moldura do Contato.
 *
 * No desktop ela SOBE para dentro dos recortes dos cantos de baixo do cartao
 * (ver `cardShape` em Contact.tsx). `h-11` e a altura do recorte (NOTCH_H,
 * 44px). `-mt-16` = recorte (44px) + a tira lime embaixo do cartao (o
 * `md:pb-5` do Contato, 20px): a faixa sobe o bastante para ficar centrada
 * no recorte, e nao na tira. Abaixo de `lg`
 * o cartao nao tem recortes e a faixa simplesmente vem depois dele.
 *
 * No desktop o fundo e TRANSPARENTE: a faixa ocupa a largura toda, e com
 * fundo lime ela cobriria tambem o meio da base do cartao, que e musgo. O
 * lime que aparece atras do texto e o dos cantos de baixo da moldura, onde o
 * brilho radial ja chegou no lime cheio.
 *
 * Texto `ink` sobre lime: 17.5:1.
 */
export function Footer() {
  const { footer } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-lime text-ink relative lg:bg-transparent">
      <div className="flex flex-col gap-2 px-6 py-6 text-xs font-semibold md:px-10 lg:-mt-16 lg:h-11 lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <p>
          © {year} · {footer.note}
        </p>
        <p>{footer.builtWith}</p>
      </div>
    </footer>
  );
}
