"use client";

import Image from "next/image";
import Link from "next/link";

export type Card = {
  index: string;
  title: string;
  text: string;
  href: string;
  img: string;
};

export default function ResearchCard({ c }: { c: Card }) {
  return (
    <article className="bg-white border border-[var(--stroke)] ring-1 ring-black/[0.04]">
      <div className="overflow-hidden border-b border-[var(--stroke-soft)]">
        <Image
          src={c.img}
          alt={c.title}
          width={1600}
          height={1000}
          className="block aspect-[16/10] w-full object-cover grayscale-[8%] contrast-[102%]"
        />
      </div>

      <div className="p-[var(--space-curve-40)]">
        <div className="mb-[var(--space-curve-16)] flex items-baseline justify-between">
          <div className="font-mono text-[10px] tracking-[0.18em] text-black/55 uppercase">
            Line {c.index}
          </div>
          <div className="font-mono text-[10px] tracking-[0.18em] text-black/40 uppercase">
            Active
          </div>
        </div>

        <h3 className="mb-[var(--space-curve-12)] font-sans text-[16px] font-semibold leading-snug text-black tracking-[-0.01em]">
          {c.title}
        </h3>

        <p className="mb-[var(--space-curve-40)] font-sans text-[14px] leading-[1.7] text-black/70">
          {c.text}
        </p>

        <Link href={c.href} className="eth-link inline-flex items-center gap-2">
          Explore <span aria-hidden>→</span>
        </Link>

        {/* structural petrol cue (non-interactive) */}
        <div className="mt-[var(--space-curve-16)] h-[2px] w-10 bg-[var(--eth-petrol)] opacity-25" />
      </div>
    </article>
  );
}
