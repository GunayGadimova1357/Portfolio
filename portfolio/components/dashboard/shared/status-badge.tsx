export function DashboardStatusBadge({
  children,
  className = "text-sm text-white/72",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`rounded-full border border-white/10 px-3 py-2 ${className}`}>
      {children}
    </span>
  );
}
