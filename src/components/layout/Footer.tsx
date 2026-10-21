import { useContent } from "@/i18n/locale-context";

export function Footer() {
  const { footer } = useContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-ink-line border-t">
      <div className="container-page text-label text-paper-dim flex flex-col gap-3 py-10 md:flex-row md:items-center md:justify-between">
        <p>
          © {year} · {footer.note}
        </p>
        <p>{footer.builtWith}</p>
      </div>
    </footer>
  );
}
