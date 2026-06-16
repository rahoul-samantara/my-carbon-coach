export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground ring-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" opacity="0.4" />
          <path d="M16 8l-5 5-3-3" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">Carbon Compass</span>
    </div>
  );
}
