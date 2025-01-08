"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const CredentialsSignInForm = () => {
  const [error, submitAction, isPending] = useActionState(
    signInWithCredentials,
    null
  );

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    return (
      <Button disabled={isPending} className="w-full" variant="default">
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  return (
    <form action={submitAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          ></Input>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
          ></Input>
        </div>
        <div>
          <SignInButton></SignInButton>
        </div>

        {error && !error.success && (
          <div className="text-center text-destructive">{error.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
