"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const SignUpForm = () => {
  const [error, submitAction, isPending] = useActionState(signUpUser, null);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    return (
      <Button disabled={isPending} className="w-full" variant="default">
        {isPending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={submitAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
          ></Input>
        </div>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
          ></Input>
        </div>
        <div>
          <SignUpButton></SignUpButton>
        </div>

        {error && !error.success && (
          <div className="text-center text-destructive">{error.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" target="_self" className="underline">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
