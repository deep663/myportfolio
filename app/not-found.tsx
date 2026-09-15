import Link from "next/link";

/**
 * Custom 404 page (STORY-1.3 AC3). Served for any unmatched route,
 * including a removed-project reference that might otherwise dangle
 * (STORY-3.3 AC2's "no orphaned references" concern resolves to this page
 * rather than a broken/blank one).
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-semibold">404 — Page not found</h1>
      <p className="text-gray-600">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="underline">
        Back to home
      </Link>
    </main>
  );
}
