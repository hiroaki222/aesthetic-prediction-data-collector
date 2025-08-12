import Image from "next/image";
import { Card } from "./ui/card";
import { Expand, LoaderCircle } from "lucide-react";

export default function AnnotationTarget({ url, setIsExpanded, isMobile }: { url: string; isExpanded: boolean; setIsExpanded: (isExpanded: boolean) => void; isMobile: boolean }) {
  return (
    <>
      <div className="w-full md:w-1/3 flex items-center justify-center">
        {url ? (
          <Card className="p-0 overflow-hidden w-full flex items-center justify-center relative">
            <Image src={url} alt="Annotation Target" width={1920} height={1080} className="w-full" priority={true} />
            {!isMobile ? (
              <button onClick={() => setIsExpanded(true)} className="absolute top-2 right-2">
                <Expand className="text-white hover:text-white transition-colors drop-shadow-md bg-black/20 rounded p-1" />
              </button>
            ) : null}
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