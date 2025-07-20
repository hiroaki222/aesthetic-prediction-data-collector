'use client'
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@/utils/supabase/client'
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export function StepSigninForm({
  className,
  onSignInSuccess,
  ...props
}: React.ComponentProps<"div"> & {
  onSignInSuccess?: () => void
}) {
  const t = useTranslations('step-signin-form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message || t('errors.incorrect-credentials'))
        return
      }

      setShowSuccess(true)

      onSignInSuccess?.()

    } catch (error) {
      console.error("Sign in error:", error)
      setError(t('errors.unexpected-error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center px-4">
      <div className={cn("flex flex-col gap-6 relative w-full max-w-md sm:max-w-lg lg:max-w-xl", className)} {...props}>
        {showSuccess && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-4">{t('success')}</div>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{t('error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mx-auto w-full">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full text-sm sm:text-base" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  {t('social-buttons.sign-in-with-apple')}
                </Button>
                <Button variant="outline" className="w-full text-sm sm:text-base" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {t('social-buttons.sign-in-with-google')}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t('divider')}
                </span>
              </div>
              <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-3">
                  <Label htmlFor="email">{t('labels.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('placeholders.email')}
                    name="email"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t('labels.password')}</Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      {t('links.forgot-password')}
                    </a>
                  </div>
                  <Input id="password" type="password" name="password" required />
                </div>
                <Button className="w-full text-sm sm:text-base" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t('buttons.submitting') : t('buttons.sign-in')}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
