import { Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { SignInButton } from "@/components/auth-buttons";
import { toneFor } from "@/lib/tag-colors";
import { TypingDots } from "@/components/typing-dots";

const examples = [
  {
    title: "Quick Start – React",
    host: "react.dev",
    summary: "An introduction to components, props and state, building a small product table step by step.",
    tags: ["react", "frontend"],
    tilt: "-rotate-1",
  },
  {
    title: "PostgreSQL: Indexes",
    host: "postgresql.org",
    summary: "How B-tree, GIN and GiST indexes speed up queries, and when each one is worth its write cost.",
    tags: ["postgres", "databases"],
    tilt: "rotate-1",
  },
];

export function Welcome() {
  return (
    <main className="grid flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="flex flex-col gap-8 px-6 pt-12 pb-10 sm:px-12 lg:justify-center lg:px-20 lg:py-14">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <span className="font-semibold tracking-tight">Smart Bookmarks</span>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="max-w-[14ch] text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
            Save it now. Find it in seconds.
          </h1>
          <p className="max-w-[46ch] text-lg leading-relaxed text-ink-2">
            Paste any link. Claude reads the page, writes a two-sentence summary and files it under tags
            you already use, so your collection stays tidy without you lifting a finger.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <SignInButton />
          <p className="text-sm text-ink-3">Your bookmarks are private to your GitHub account.</p>
        </div>
        <section aria-label="Example board" className="bg-dots -mx-6 flex flex-col gap-4 overflow-hidden border-y border-line px-6 py-8 sm:-mx-12 sm:px-12 lg:hidden">
          <ReadingSticky />
          <ExampleCard example={examples[0]} />
          <p className="self-center text-xs font-medium tracking-wide text-ink-3 uppercase">Example board</p>
        </section>
      </section>

      <section aria-label="Example board" className="bg-dots relative hidden overflow-hidden border-l border-line lg:block">
        <div className="absolute inset-0 flex flex-col justify-center gap-6 px-14">
          <div className="self-end">
            <ReadingSticky />
          </div>
          {examples.map((e, i) => (
            <div key={e.title} className={i % 2 ? "self-center" : "self-start"}>
              <ExampleCard example={e} />
            </div>
          ))}
          <p className="self-center text-xs font-medium tracking-wide text-ink-3 uppercase">Example board</p>
        </div>
      </section>
    </main>
  );
}

function ReadingSticky() {
  return (
    <div className="flex w-full max-w-md -rotate-2 flex-col gap-2 rounded-xl bg-sticky p-5 text-sticky-ink shadow-card">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="size-4" aria-hidden />
        Claude is reading this page
        <TypingDots />
      </p>
      <p className="truncate text-sm opacity-80">vercel.com/blog/understanding-react-server-components</p>
    </div>
  );
}

function ExampleCard({ example: e }: { example: (typeof examples)[number] }) {
  return (
    <article className={`w-full max-w-md rounded-xl border border-line bg-surface p-5 shadow-lift ${e.tilt}`}>
      <h2 className="font-semibold">{e.title}</h2>
      <p className="text-sm text-ink-3">{e.host}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{e.summary}</p>
      <ul className="mt-3 flex gap-1.5">
        {e.tags.map((t) => (
          <li key={t} className={`tone-${toneFor(t)} inline-flex items-center gap-1.5 rounded-md bg-(--t-bg) px-2 py-0.5 text-sm text-(--t-ink)`}>
            <span aria-hidden className="size-1.5 rounded-full bg-(--t-dot)" />
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}
