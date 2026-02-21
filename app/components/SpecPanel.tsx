"use client";

export default function SpecPanel({
  title,
  items,
  footer,
}: {
  title: string;
  items: string[];
  footer: string;
}) {
  return (
    <aside className="bg-white border border-[var(--stroke)] ring-1 ring-black/[0.04]">
      <div className="px-6 py-4 border-b border-[var(--stroke-soft)]">
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] tracking-[0.22em] text-black/60 uppercase">
            {title}
          </div>
          <span className="inline-block h-[2px] w-10 bg-[var(--eth-petrol)] opacity-30" />
        </div>
      </div>

      <div className="px-6 py-5">
        <ul className="space-y-3">
          {items.map((t) => (
            <li key={t} className="text-[14px] leading-[1.6] text-black/80">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-6 py-4 border-t border-[var(--stroke-soft)]">
        <div className="font-mono text-[10px] tracking-[0.18em] text-black/45 uppercase">
          {footer}
        </div>
      </div>
    </aside>
  );
}
