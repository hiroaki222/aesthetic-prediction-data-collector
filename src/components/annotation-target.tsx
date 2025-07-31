import Image from "next/image";
import { Card } from "./ui/card";
import { Expand, LoaderCircle, X } from "lucide-react";

export default function AnnotationTarget({ imageUrl, isExpanded, setIsExpanded }: { imageUrl: string; isExpanded: boolean; onClickExpand: () => void }) {
  const wh = [300, 200];

  return (
    <>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        {imageUrl ? (
          <Card className="p-0 overflow-hidden w-full flex items-center justify-center relative">
            <Image src={imageUrl} alt="Annotation Target" width={wh[0]} height={wh[1]} className="w-full" />
            <button onClick={() => setIsExpanded(true)} className="absolute top-2 right-2">
              <Expand className="text-white hover:text-white transition-colors drop-shadow-md bg-black/20 rounded p-1" />
            </button>
          </Card>
        ) : (
          <Card className="p-0 overflow-hidden flex items-center justify-center relative w-full]">
            <LoaderCircle className="animate-spin" />
          </Card>
        )}
      </div>
    </>
  )
}