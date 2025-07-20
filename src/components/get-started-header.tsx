"use client"

import { useTranslations } from "next-intl"
import { Progress } from "@/components/ui/progress"
import { FilePenLine } from "lucide-react"

interface GetStartedHeaderProps {
  currentStep: number
  totalSteps: number
}

export function GetStartedHeader({ currentStep, totalSteps }: GetStartedHeaderProps) {
  const t = useTranslations('get-started-header')
  const progress = (currentStep / totalSteps) * 100

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
      <div className="flex h-16 items-center justify-center px-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FilePenLine className="size-4" />
            </div>
            <span className="font-semibold">{t('app-title')}</span>
          </div>
          <div className="hidden sm:block text-sm text-muted-foreground">{t('getting-started')}</div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t('step-label')}</span>
            <span className="font-medium">
              {t('step-counter', { currentStep, totalSteps })}
            </span>
          </div>
        </div>
      </div>
      <div className="justify-center flex">
        <Progress value={progress} className="h-1 justify-center" />
      </div>
    </header>
  )
}
