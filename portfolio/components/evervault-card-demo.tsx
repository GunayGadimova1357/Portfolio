import React from "react";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { cn } from "@/lib/utils";

type EvervaultCardDemoProps = {
  className?: string;
  cardText?: string;
  title?: string;
  description?: string;
  badge?: string;
};

export default function EvervaultCardDemo({
  className,
  cardText = "about",
  title = "Profile signal",
  description = "Interactive card with dynamic encrypted texture.",
  badge = "Interactive",
}: EvervaultCardDemoProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-full w-full max-w-xl flex-col rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-sm",
        className
      )}
    >
      <Icon className="absolute -left-2 -top-2 h-5 w-5 text-white/70" />
      <Icon className="absolute -bottom-2 -left-2 h-5 w-5 text-white/70" />
      <Icon className="absolute -right-2 -top-2 h-5 w-5 text-white/70" />
      <Icon className="absolute -bottom-2 -right-2 h-5 w-5 text-white/70" />

      <div className="relative h-[18rem] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a0f13]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(156,180,169,0.18),transparent_40%),radial-gradient(circle_at_80%_78%,rgba(91,124,160,0.2),transparent_44%)]" />
        <EvervaultCard text={cardText} className="h-full w-full" />
      </div>

      <h2 className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-white/72">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
        {description}
      </p>
      <p className="mt-4 inline-flex w-fit rounded-full border border-white/20 bg-white/[0.03] px-3 py-1 text-xs tracking-[0.18em] text-white/75">
        {badge}
      </p>
    </div>
  );
}
