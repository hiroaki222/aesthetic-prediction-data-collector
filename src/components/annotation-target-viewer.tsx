import Image from "next/image";
import { Card } from "./ui/card";
import { Expand } from "lucide-react";

export default function AnnotationTargetViewer({ url, setIsExpanded, isMobile }: { url: string; setIsExpanded: (isExpanded: boolean) => void; isMobile: boolean }) {
  return (
    <Card className="p-0 overflow-hidden w-full flex items-center justify-center relative">
      <Image src={url} alt="Annotation Target" width={1920} height={1080} className="w-full" priority={true} />
      {!isMobile ? (
        <button onClick={() => setIsExpanded(true)} className="absolute top-2 right-2">
          <Expand className="text-white hover:text-white transition-colors drop-shadow-md bg-black/20 rounded p-1" />
        </button>
      ) : null}
    </Card>
  )
}