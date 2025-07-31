import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AnnotationControl({ step, setStep, range }: { step: number; setStep: React.Dispatch<React.SetStateAction<number>>; range: number }) {

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

  const isPrevDisabled = step <= 1
  const isNextDisabled = step >= range

  return (
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
      <button
        className={`p-2 md:px-40 mx-10 rounded-full transition-colors ${isNextDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-black hover:bg-gray-800'
          }`}
        onClick={onClickNext}
        disabled={isNextDisabled}
      >
        <ChevronRight className={`size-8 ${isNextDisabled ? 'text-gray-600' : 'text-white'}`} />
      </button>
    </div >
  )
}