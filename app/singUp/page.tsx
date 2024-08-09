/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CK40JfKqKMR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { createUser } from "@/lib/actions";

export default function Component() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessages("");

    // Validate inputs
    let errors = "";
    if (name.trim().length < 3) {
      errors += "Name must be longer than 3 characters. ";
    }
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
    const response = await createUser(name, email, password);

    alert(response);
    // Here you can also handle the signup logic (e.g., API call)
  };
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign Up
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="#"
              className="font-medium text-primary hover:underline"
              prefetch={false}
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Name
            </Label>
            <div className="mt-1">
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>
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
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
