export function FloatingGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-8 top-1/2 h-64 -translate-y-1/2 rounded-full bg-blue-500/18 blur-3xl" />
      <div className="absolute right-10 top-20 size-56 rounded-full bg-cyan-400/12 blur-3xl" />
    </div>
  );
}
