"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import { Button } from "@hachi/ui/components/button";
import { Card, CardContent } from "@hachi/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@hachi/ui/components/field";
import { Input } from "@hachi/ui/components/input";
import { authClient } from "@hachi/auth/client";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  general?: string;
}

function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must include uppercase, lowercase, and a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
      });

      if (error) {
        setErrors({ general: error.message || "Failed to create account. Please try again." });
        return;
      }

      // Redirect to dashboard after successful signup
      router.push("/dashboard");
    } catch {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGitHubSignUp = async () => {
    setIsSubmitting(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch {
      setErrors({ general: "Failed to sign up with GitHub. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Get started with Hachi today
                </p>
              </div>
              {errors.general && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm" role="alert">
                  {errors.general}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="first-name">First name</FieldLabel>
                  <Input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? "first-name-error" : undefined}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p id="first-name-error" className="text-sm text-destructive" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last name</FieldLabel>
                  <Input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? "last-name-error" : undefined}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p id="last-name-error" className="text-sm text-destructive" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive" role="alert">
                    {errors.email}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive" role="alert">
                    {errors.password}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>
              <FieldSeparator>Or continue with</FieldSeparator>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleGitHubSignUp}
                >
                  <Github className="size-4" aria-hidden="true" />
                  Sign up with GitHub
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  H
                </div>
                <h2 className="text-xl font-semibold mb-2">Hachi</h2>
                <p className="text-muted-foreground text-sm">
                  The Agentic AI Coding Assistant Platform
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4">Terms of Service</Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-4">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <SignupForm />
    </div>
  );
}
