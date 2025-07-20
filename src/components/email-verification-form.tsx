"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, RefreshCw, ArrowLeft, Check } from "lucide-react"
import { useTranslations } from "next-intl"

interface EmailVerificationFormProps extends React.ComponentPropsWithoutRef<"div"> {
  email?: string
  type?: "signup" | "password-reset"
  onResend?: () => void
  isResending?: boolean
}

export function EmailVerificationForm({
  className,
  email = "user@example.com",
  type = "signup",
  onResend,
  isResending = false,
  ...props
}: EmailVerificationFormProps) {
  const isSignup = type === "signup"

  const t = useTranslations('email-verification-form')

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">
            {isSignup ? t('signup.title') : t('password-reset.title')}
          </CardTitle>
          <CardDescription>
            {isSignup ? t('signup.description') : t('password-reset.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <div>
                <strong>{t('sender-info.sender')} </strong>
                <a>{t('sender-info.sender-name')}</a>
              </div>
              <strong>{t('sender-info.email-from')}</strong> noreply@mail.app.supabase.io<br />
              <strong>{t('sender-info.email-sent-to')}</strong> {email}
            </AlertDescription>
          </Alert>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">{t('instructions.next-steps-title')}</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>{t('instructions.steps.check-inbox')}</li>
                <li>{t('instructions.steps.look-for-email')}</li>
                <li>{isSignup ? t('instructions.steps.click-verification-link') : t('instructions.steps.click-reset-link')}</li>
                {isSignup && <li>{t('instructions.steps.complete-setup')}</li>}
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">{t('instructions.no-email-title')}</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('instructions.troubleshooting.check-spam')}</li>
                <li>{t('instructions.troubleshooting.verify-email', { email })}</li>
                <li>{t('instructions.troubleshooting.wait-minutes')}</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onResend} disabled={isResending} variant="outline" className="w-full bg-transparent">
              {isResending ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t('buttons.email-sent')}
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t('buttons.resend-email')}
                </>
              )}
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <a href={isSignup ? "/signup" : "/forgot-password"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isSignup ? t('signup.back-button') : t('password-reset.back-button')}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground">
        {t('support.trouble-text')}{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          {t('support.support-team')}
        </a>{" "}
        {t('support.assistance')}
      </div>
    </div>
  )
}
