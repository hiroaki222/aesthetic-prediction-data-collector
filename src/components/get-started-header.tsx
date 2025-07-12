"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { GalleryVerticalEnd, X } from "lucide-react"

interface GetStartedHeaderProps {
  currentStep: number
  totalSteps: number
  onClose?: () => void
}

export function GetStartedHeader({ currentStep, totalSteps, onClose }: GetStartedHeaderProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
      <div className="container flex h-16 items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="font-semibold">Acme Inc.</span>
          </div>
          <div className="hidden sm:block text-sm text-muted-foreground">Getting Started</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Step</span>
            <span className="font-medium">
              {currentStep} of {totalSteps}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="justify-center flex">
        <Progress value={progress} className="h-1 justify-center" />
      </div>
    </header>
  )
}
