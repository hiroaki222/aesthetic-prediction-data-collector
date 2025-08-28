import { useTranslations } from "next-intl"
import { Progress } from "@/components/ui/progress"
import { FilePenLine } from "lucide-react"
import { X } from 'lucide-react';
import { useState } from "react";
import { FinishConfirmationDialog } from "./finish-confirmation-dialog";

interface AnnotationHeaderProps {
  currentStep: number
  totalSteps: number
  taskName: string
  handleClose: () => void;
}

export function AnnotationHeader({ currentStep, totalSteps, taskName, handleClose }: AnnotationHeaderProps) {
  const t = useTranslations('annotation-header')
  const progress = (currentStep / totalSteps) * 100
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const onClickClose = () => {
    setIsConfirmDialogOpen(true);
  }

  const handleConfirmFinish = () => {
    handleClose()
  }


  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col">
        <div className="flex h-16 items-center justify-center px-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <FilePenLine className="size-4" />
              </div>
              <span className="font-semibold">{t('title')}</span>
            </div>
            <div className="hidden sm:block text-sm text-muted-foreground">{t('task', { taskName })}</div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 text-sm">
              {/* <span className="text-muted-foreground hidden md:inline">{t('step-label')}</span> */}
              <span className="font-medium">
                {t('step-counter', { currentStep, totalSteps })}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center pl-10">
            <button className="border border-black rounded" onClick={onClickClose}>
              <X className="size-7" />
            </button>
          </div>
        </div>
        <div className="justify-center flex">
          <Progress value={progress} className="h-1 justify-center" />
        </div>
      </header>

      <FinishConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmFinish}
        title={t('exit-confirmation.title')}
        description={t('exit-confirmation.description')}
        confirmButtonText={t('exit-confirmation.confirm-button')}
      />
    </>
  )
}
