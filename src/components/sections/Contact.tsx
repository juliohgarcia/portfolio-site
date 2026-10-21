import { useRef } from "react";
import { useContent, useLocale } from "@/i18n/locale-context";
import { isPlaceholder, resolved } from "@/content/placeholders";
import { joinEmail, splitEmail } from "@/lib/email";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MagneticLink } from "@/components/ui/MagneticLink";

export function Contact() {
  const { contact } = useContent();
  const { locale } = useLocale();
  const root = useRef<HTMLElement>(null);

  // O e-mail e remontado em tempo de execucao (ver src/lib/email.ts).
  const emailParts = isPlaceholder(contact.email) ? null : splitEmail(contact.email);
  const email = emailParts ? joinEmail(emailParts) : null;

  return (
    <section ref={root} id="contato" className="container-page py-28 md:py-40">
      <SectionLabel>{contact.label}</SectionLabel>

      <RevealText
        key={`${locale}-contact-title`}
        as="h2"
        className="text-expanded text-hero text-paper mt-8"
      >
        {contact.title}
      </RevealText>

      <div className="mt-14 grid gap-14 md:grid-cols-12">
        <RevealText
          key={`${locale}-contact-invite`}
          className="text-lead text-paper-dim md:col-span-6"
        >
          {contact.invitation}
        </RevealText>

        <div className="md:col-span-5 md:col-start-8">
          {email && (
            <MagneticLink
              href={`mailto:${email}`}
              className="text-expanded text-title text-paper hover:text-lime inline-block break-all transition-colors"
              cursorLabel="e-mail"
            >
              {email}
            </MagneticLink>
          )}

          <ul className="mt-10 space-y-5">
            {contact.links.map((link) => {
              const href = resolved(link.href);
              const handle = resolved(link.handle);

              return (
                <li key={link.label} className="border-ink-line border-t pt-5">
                  {href ? (
                    <MagneticLink
                      href={href}
                      external
                      cursorLabel={link.label}
                      className="group flex min-h-11 items-baseline justify-between gap-4"
                    >
                      <span className="text-expanded text-paper group-hover:text-lime transition-colors">
                        {link.label}
                      </span>
                      <span className="text-paper-dim text-sm">{handle ?? ""}</span>
                    </MagneticLink>
                  ) : (
                    // Sem URL preenchida, mostramos o rotulo sem link —
                    // nunca um <a> apontando para "{{GITHUB_URL}}".
                    // Contraste cheio (5.53:1): o que diferencia do link ativo
                    // e a ausencia de sublinhado e de hover, nao texto apagado.
                    // text-paper-dim/70 daria 3.25:1 e reprovaria no AA em 16px.
                    <p className="flex items-baseline justify-between gap-4">
                      <span className="text-expanded text-paper-dim">{link.label}</span>
                      <span aria-hidden="true" className="text-paper-dim/50 text-sm">
                        —
                      </span>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
