"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const t = useTranslations('contact')

  const validate = (): boolean => {
    const newErrors: FieldErrors = {}
    if (!name.trim()) newErrors.name = t('form.errors.name')
    if (!email.trim()) newErrors.email = t('form.errors.email')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t('form.errors.email.invalid')
    if (!subject.trim()) newErrors.subject = t('form.errors.subject')
    if (!message.trim()) newErrors.message = t('form.errors.message')
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    toast.success(t('form.success'))
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Contact us</CardTitle>
        <CardDescription>{t('form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contact-name">{t('form.labels.name')}</Label>
            <Input
              id="contact-name"
              placeholder={t('form.placeholders.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && (
              <p id="contact-name-error" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-email">{t('form.labels.email')}</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder={t('form.placeholders.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email && (
              <p id="contact-email-error" className="text-xs text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-subject">{t('form.labels.subject')}</Label>
            <Input
              id="contact-subject"
              placeholder={t('form.placeholders.subject')}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            />
            {errors.subject && (
              <p id="contact-subject-error" className="text-xs text-destructive">
                {errors.subject}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact-message">{t('form.labels.message')}</Label>
            <Textarea
              id="contact-message"
              placeholder={t('form.placeholders.message')}
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
            />
            {errors.message && (
              <p id="contact-message-error" className="text-xs text-destructive">
                {errors.message}
              </p>
            )}
          </div>

          {/* <Button type="submit" disabled={submitting} className="w-full"> */}
          <Button type="submit" disabled={true} className="w-full">
            {submitting ? t('form.buttons.sending') : t('form.buttons.send')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
