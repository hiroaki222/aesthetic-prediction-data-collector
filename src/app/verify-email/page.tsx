"use client"
import { useState } from "react"
import { FilePenLine } from "lucide-react"
import { EmailVerificationForm } from "@/components/email-verification-form"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)

  const type = "signup" // or "password-reset"
  const email = 'noreply@mail.app.supabase.io'

  const handleResend = async () => {
    setIsResending(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsResending(false)
  }



  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FilePenLine className="size-4" />
          </div>
          Aesthetic Prediction Data Collector
        </a>
        <EmailVerificationForm
          email={email}
          type={type as "signup" | "password-reset"}
          onResend={handleResend}
          isResending={isResending}
        />
      </div>
    </div>
  )
}
