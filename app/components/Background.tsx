export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(47,128,255,.22),transparent_28%),radial-gradient(circle_at_92%_10%,rgba(91,163,255,.16),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(22,199,132,.08),transparent_36%)]" />
      <div className="bg-orb absolute left-[-12%] top-[18%] h-[560px] w-[560px] rounded-full bg-[#2F80FF]/25 blur-[150px]" />
      <div className="bg-orb absolute right-[-14%] top-[8%] h-[560px] w-[560px] rounded-full bg-[#5BA3FF]/20 blur-[165px]" />
      <div className="absolute inset-0 opacity-[.18] [background-image:linear-gradient(rgba(255,255,255,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.10)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_42%,rgba(47,128,255,.08)_45%,transparent_48%),linear-gradient(138deg,transparent_52%,rgba(91,163,255,.08)_55%,transparent_58%)]" />
    </div>
  );
}
