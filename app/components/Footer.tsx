export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        © {new Date().getFullYear()} Jake Armijo
      </div>
    </footer>
  );
}
