'use client'
import type React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { passwordResetEmail } from "@/utils/supabase/actions"

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations('forgot-password-form')
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
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email-label')}</Label>
                <Input id="email" name="email" type="email" placeholder={t('email-placeholder')} required disabled={isSubmitting || isSubmitted} />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || isSubmitted}>
                {isSubmitting ? t('buttons.sending') : isSubmitted ? t('buttons.sent') : t('buttons.send-reset-link')}
              </Button>
              {isSubmitted && (
                <div className="text-center text-sm text-green-600">
                  {t('success-message')}
                </div>
              )}
              <div className="text-center text-sm">
                {t('back-to-signin.text')}{" "}
                <a href="/signin" className="underline underline-offset-4">
                  {t('back-to-signin.link')}
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
