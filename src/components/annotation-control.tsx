import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FinishConfirmationDialog } from "./finish-confirmation-dialog";
import { useTranslations } from "next-intl";

export default function AnnotationControl({
  step,
  setStep,
  range,
  onFinish
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  range: number;
  onFinish?: () => void;
}) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const t = useTranslations('annotation-control');

  const onClickPrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  const onClickNext = () => {
    if (step < range) {
      setStep(step + 1)
    }
  }

  const onClickFinish = () => {
    setIsConfirmDialogOpen(true);
  }

  const handleConfirmFinish = () => {
    if (onFinish) {
      onFinish()
    }
  }

  const isPrevDisabled = step <= 1
  const isLastStep = step >= range

  return (
    <>
      <div className="flex items-center justify-between w-full py-5">
        <button
          className={`p-2 md:px-40 mx-10 rounded-full transition-colors ${isPrevDisabled
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-gray-300 hover:bg-gray-200'
            }`}
          onClick={onClickPrev}
          disabled={isPrevDisabled}
        >
          <ChevronLeft className={`size-8 ${isPrevDisabled ? 'text-gray-400' : 'text-gray-700'}`} />
        </button>
        <div className="flex-1"></div>
        {isLastStep ? (
          <button
            className="px-8 py-2 md:px-40 mx-10 rounded-full transition-colors bg-green-600 hover:bg-green-700 text-white font-medium"
            onClick={onClickFinish}
          >
            {t('finish')}
          </button>
        ) : (
          <button
            className="p-2 md:px-40 mx-10 rounded-full transition-colors bg-black hover:bg-gray-800"
            onClick={onClickNext}
          >
            <ChevronRight className="size-8 text-white" />
          </button>
        )}
      </div>

      <FinishConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleConfirmFinish}
      />
    </>
  )
}