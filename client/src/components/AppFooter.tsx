export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <div>
          Sonko © {currentYear}
        </div>
        <div>
          Version {version}
        </div>
      </div>
    </footer>
  );
}
