export default function StepConfirm({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-6">✓</div>
      <h3
        className="text-2xl sm:text-3xl font-bold mb-4"
        style={{ color: "var(--color-foreground)", fontFamily: "var(--heading-font)" }}
      >
        Rendez-vous confirmé !
      </h3>
      <p className="text-lg mb-2" style={{ color: "var(--color-muted)" }}>
        Nous vous avons envoyé une confirmation par email.
      </p>
      <p className="text-base mb-8" style={{ color: "var(--color-muted)" }}>
        Vous pouvez annuler à tout moment via le lien dans l&apos;email.
      </p>
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-lg text-white font-semibold min-h-[48px] hover:opacity-90 transition-opacity"
        style={{ background: "var(--color-accent)" }}
      >
        Nouveau rendez-vous
      </button>
    </div>
  );
}
