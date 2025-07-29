import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AnnotationControl({ onClickPrev, onClickNext }: { onClickPrev: () => void; onClickNext: () => void }) {
  return (
    <div className="flex items-center justify-between w-full py-10">
      <button className="p-4 mx-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" onClick={onClickPrev}>
        <ChevronLeft className="size-8 text-gray-700" />
      </button>
      <div className="flex-1"></div>
      <button className="p-4 mx-10 bg-black hover:bg-gray-800 rounded-full transition-colors" onClick={onClickNext} >
        <ChevronRight className="size-8 text-white" />
      </button>
    </div >
  )
}