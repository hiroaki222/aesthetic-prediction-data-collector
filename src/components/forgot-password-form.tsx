'use client'
import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { passwordResetEmail } from "@/utils/supabase/actions"

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    if (isSubmitting || isSubmitted) return

    setIsSubmitting(true)
    try {
      await passwordResetEmail(formData)
      setIsSubmitted(true)
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter your email address and we&apos;ll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isSubmitting || isSubmitted} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || isSubmitted}>
                {isSubmitting ? "Sending..." : isSubmitted ? "Link sent!" : "Send reset link"}
              </Button>
              {isSubmitted && (
                <div className="text-center text-sm text-green-600">
                  Reset link has been sent to your email address.
                </div>
              )}
              <div className="text-center text-sm">
                Remember your password?{" "}
                <a href="/signin" className="underline underline-offset-4">
                  Back to sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
