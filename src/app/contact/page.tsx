import { FilePenLine, MessageSquare } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Footer } from '@/components/footer'
import { ContactForm } from '@/components/contact-form'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const GITHUB_ISSUE_URL = "https://github.com/hiroaki222/aesthetic-prediction-data-collector/issues/new/choose"
const GITHUB_DISCUSSIONS_URL = "https://github.com/hiroaki222/aesthetic-prediction-data-collector/discussions/new/choose"

export default function ContactPage() {
  const t = useTranslations('contact')
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-col items-center gap-6 p-6 md:p-10">
        <a className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FilePenLine className="size-4" />
          </div>
          Aesthetic Prediction Data Collector
        </a>
        <div className="w-full max-w-2xl grid gap-6">
          <ContactForm />

          <Alert className="relative">
            <Image src="/icons/github-mark.svg" width="20" height="20" alt="GitHub" className="absolute top-1 right-1" />
            <AlertDescription className="flex flex-col gap-3 text-black">
              <span className='flex justify-center'>
                {t('github.description')}
              </span>
              <div className="flex flex-wrap  items-center gap-2 mx-2">
                <Button asChild variant="outline" className="bg-transparent">
                  <a href={GITHUB_ISSUE_URL} target="_blank" rel="noopener noreferrer">
                    {t('github.issue')}
                  </a>
                </Button>
                <div className="flex-grow"></div>
                <Button asChild variant="outline" className="bg-transparent">
                  <a href={GITHUB_DISCUSSIONS_URL} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('github.discussion')}
                  </a>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  )
}
