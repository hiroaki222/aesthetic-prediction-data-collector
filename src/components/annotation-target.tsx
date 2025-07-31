import Image from "next/image";
import { Card } from "./ui/card";
import { Expand, LoaderCircle, X } from "lucide-react";
import { useState } from "react";

export default function AnnotationTarget({ imageUrl }: { imageUrl: string }) {
  const wh = [300, 200];
  const [isExpanded, setIsExpanded] = useState(false);

  const onClickExpand = () => {
    setIsExpanded(true);
  }

  const onClickClose = () => {
    setIsExpanded(false);
  }

  return (
    <>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        {imageUrl ? (
          <Card className="p-0 overflow-hidden w-full flex items-center justify-center relative">
            <Image src={imageUrl} alt="Annotation Target" width={wh[0]} height={wh[1]} className="w-full" />
            <button onClick={onClickExpand} className="absolute top-2 right-2">
              <Expand className="text-white hover:text-white transition-colors drop-shadow-md bg-black/20 rounded p-1" />
            </button>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden flex items-center justify-center relative w-full]">
            <LoaderCircle className="animate-spin" />
          </Card>
        )}
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClickClose}
        >
          <div className="relative w-[90vw] h-[90vh]">
            <button
              onClick={onClickClose}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            <Image
              src={imageUrl}
              alt="Annotation Target Expanded"
              width={wh[0]}
              height={wh[1]}
              className="w-full h-full object-cover rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}