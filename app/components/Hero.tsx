import Link from "next/link";

export default function Hero() {
  return (
    <div
      id="top"
      className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50 pt-16"
    >
      <main className="w-full max-w-4xl px-6 py-24 sm:px-10 md:py-32">
        <section className="flex flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <p className="text-sm font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
            Hello! My name is
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Jake Armijo.
          </h1>
          <h2 className="text-2xl font-normal text-zinc-700 dark:text-zinc-300 sm:text-3xl">
            I&apos;m a software engineer.
          </h2>
          <div id="projectButton" className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              href="https://calendly.com/armijojake/meeting"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule time with me
            </a>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              href="#projects"
            >
              View Portfolio
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              href="/blog"
            >
              View Blog
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
