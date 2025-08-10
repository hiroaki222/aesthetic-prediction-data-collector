'use client'
import type React from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/utils/supabase/actions"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations('signup-form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)

    if (isCheckboxChecked) {
      const emailInput = formData.get('email') as string
      if (emailInput && !emailInput.includes('@')) {
        formData.set('email', `${emailInput}@jaist.ac.jp`)
      }
    }

    setIsSubmitting(true)
    await signup(formData)
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          {/* <CardDescription>Sign up with your Apple or Google account</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                Sign up with Apple
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Sign up with Google
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
            </div> */}
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className='flex flex-col'>
                  <Label htmlFor="email">{t('labels.email')}</Label>
                  <div className="m-1 flex items-center">
                    <a className="text-xs mr-1">{t('labels.is-jaist-student')}</a>
                    <Checkbox
                      checked={isCheckboxChecked}
                      onCheckedChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                      name="isJaistStudent"
                      id="jaist-student-checkbox"
                    />
                  </div>
                </div>
                {isCheckboxChecked ? (<div className='flex items-center'>
                  <Input id="email" type="string" placeholder={t('placeholders.jaist-user')} name="email" required />
                  <a className="ml-1">@jaist.ac.jp</a>
                </div>) : (<Input id="email" type="email" placeholder={t('placeholders.email')} name="email" required />)}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('labels.password')}</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">{t('labels.confirm-password')}</Label>
                <Input id="confirm-password" type="password" name="password" required />
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('buttons.submitting') : t('buttons.create-account')}
              </Button>
            </form >
            <div className="text-center text-sm">
              {t('sign-in.text')}{" "}
              <a href="/signin" className="underline underline-offset-4">
                {t('sign-in.link')}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
