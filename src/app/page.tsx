import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FilePenLine } from "lucide-react"
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home-page');
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">

          <div className="flex items-center gap-2 self-center font-medium text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FilePenLine className="size-5" />
            </div>
            Aesthetic Prediction Data Collector
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('title')}</CardTitle>
              <CardDescription>{t('description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <a href="/signin">{t('sign-in')}</a>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href="/research-guide">{t('sign-up')}</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
