import { Metadata } from "next";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — Mustaraka Properties",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,76,0.07)_0%,transparent_70%)]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/assets/logo.png"
            alt="Mustaraka Properties"
            width={160}
            height={44}
            className="h-11 w-auto object-contain"
            priority
          />
        </div>

        {/* Card */}
        <div className="bg-brand-surface border border-gold/15 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-px w-6 bg-gold/40" />
              <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
                Admin Access
              </p>
            </div>
            <h1 className="font-heading font-light text-brand-text text-3xl">
              Sign In
            </h1>
          </div>

          <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
