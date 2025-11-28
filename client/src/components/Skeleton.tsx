export default function Skeleton({ className = 'h-6 w-full rounded-sm' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}
