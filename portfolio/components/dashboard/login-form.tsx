"use client";

import {useState, useTransition} from "react";
import {signIn} from "next-auth/react";
import {useRouter} from "@/i18n/navigation";

export function LoginForm({locale}: {locale: string}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      setError("");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: `/${locale}/dashboard`,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/72">Email</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/30"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-white/72">Password</span>
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/30"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
