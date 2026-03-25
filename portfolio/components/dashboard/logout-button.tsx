"use client";

import {LogOut} from "lucide-react";
import {signOut} from "next-auth/react";

export function LogoutButton({callbackUrl}: {callbackUrl: string}) {
  return (
    <button
      type="button"
      onClick={() => signOut({callbackUrl})}
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/78 transition-colors hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
