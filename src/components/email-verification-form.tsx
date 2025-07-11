"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft } from "lucide-react"

interface EmailVerificationFormProps extends React.ComponentPropsWithoutRef<"div"> {
  email?: string
  type?: "signup" | "password-reset"
}

export function EmailVerificationForm({
  className,
  email = "user@example.com",
  type = "signup",

}: EmailVerificationFormProps) {
  const isSignup = type === "signup"

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">{isSignup ? "Check your email" : "Reset link sent"}</CardTitle>
          <CardDescription>
            {isSignup
              ? "We've sent a verification link to your email address"
              : "We've sent a password reset link to your email address"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <strong>Email sent to:</strong> {email}
            </AlertDescription>
          </Alert>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">What to do next:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check your email inbox</li>
                <li>Look for an email from Acme Inc.</li>
                <li>Click the {isSignup ? "verification" : "reset"} link in the email</li>
                {isSignup && <li>Complete your account setup</li>}
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">{"Didn't receive the email?"}</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spam or junk folder</li>
                <li>Make sure {email} is correct</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-transparent"
            >
              Resend Email
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground">
        Having trouble? Contact our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          support team
        </a>{" "}
        for assistance.
      </div>
    </div>
  )
}
