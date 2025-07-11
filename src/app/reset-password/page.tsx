'use client'
import { FilePenLine } from "lucide-react"
import { Suspense } from "react"

import { ResetPasswordForm } from "@/components/reset-password-form"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get("code")
    if (!code) {
      const redirectTimeout = setTimeout(() => {
        router.replace("/error/400")
      }, 0)

      return () => clearTimeout(redirectTimeout)
    }
  }, [searchParams, router])

  if (!searchParams.get("code")) {
    return null
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
        <ResetPasswordForm />
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
