"use client";

import {usePathname} from "@/i18n/navigation";
import {Link} from "@/i18n/navigation";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function SidebarNav({
  items,
  mobile = false,
}: {
  items: SidebarItem[];
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={
        mobile
          ? "flex gap-2 overflow-x-auto pb-1"
          : "space-y-1.5"
      }
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              mobile
                ? "inline-flex min-w-max items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors"
                : "flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-colors",
              isActive
                ? "border-white/12 bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                : "border-transparent bg-transparent text-white/55 hover:border-white/8 hover:bg-white/[0.035] hover:text-white",
            ].join(" ")}
          >
            <span className={isActive ? "text-white" : "text-white/38"}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
