"use client";

import {usePathname} from "@/i18n/navigation";

export function ConditionalFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (
    pathname === "/about" ||
    pathname === "/projects" ||
    pathname === "/contact" ||
    pathname.startsWith("/dashboard")
  ) {
    return null;
  }

  return <>{children}</>;
}
