import { salonInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-8 border-t" style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-base" style={{ color: "var(--color-muted)" }}>
          <p>
            &copy; 2019–{new Date().getFullYear()} {salonInfo.fullName}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={salonInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors min-h-[48px] flex items-center hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-muted)" }}
            >
              Instagram
            </a>
            <a
              href="tel:+41216523227"
              className="transition-colors min-h-[48px] flex items-center hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-muted)" }}
            >
              {salonInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
