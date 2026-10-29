import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="text-sm text-slate-600 mt-2 mb-6">Page not found.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
      >
        Back to Downloader
      </Link>
    </div>
  );
}
