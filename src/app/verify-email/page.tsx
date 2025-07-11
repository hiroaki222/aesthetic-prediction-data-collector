"use client"
import { Suspense, useEffect, useState } from "react"
import { FilePenLine } from "lucide-react"
import { EmailVerificationForm } from "@/components/email-verification-form"
import { useRouter, useSearchParams } from "next/navigation"

function VerifyEmailPageContent() {
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState<string>("")
  const [type, setType] = useState<"signup" | "password-reset" | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    const typeParam = searchParams.get("type")

    if (!emailParam || (typeParam !== "signup" && typeParam !== "password-reset")) {
      router.replace("/error/400")
      return
    }

    setEmail(emailParam)
    setType(typeParam)
  }, [searchParams, router])

  if (!email || !type) {
    return null
  }

  const handleResend = async () => {
    setIsResending(true)

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
          type={type}
          onResend={handleResend}
          isResending={isResending}
        />
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  )
}