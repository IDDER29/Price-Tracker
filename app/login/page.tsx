"use client";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { FormEvent, use, useState } from "react";
import { createUser, loginUser } from "@/lib/actions";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessages("");

    // Validate inputs
    let errors = "";

    if (!email.trim()) {
      errors += "Email is required. ";
    }
    if (password.trim().length < 8) {
      errors += "Password must be longer than 8 characters. ";
    }

    // If there are any error messages, set them and return
    if (errors) {
      setErrorMessages(errors);
      alert(errors);
      return;
    }

    // If validation passes, log the data
    const response = await loginUser(email, password);

    alert(response);
    // Here you can also handle the signup logic (e.g., API call)
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              className="font-medium text-primary hover:underline"
              prefetch={false}
            >
              Sign up
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email address
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                name="remember-me"
                className="h-4 w-4 rounded"
              />
              <Label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-foreground"
              >
                Remember me
              </Label>
            </div>
            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-primary hover:underline"
                prefetch={false}
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
