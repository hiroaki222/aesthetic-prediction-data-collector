import { Card } from "./ui/card";
import { LoaderCircle } from "lucide-react";
import AnnotationTargetViewer from "./annotation-target-viewer";

export default function AnnotationTarget({ url, setIsExpanded, isMobile }: { url: string; isExpanded: boolean; setIsExpanded: (isExpanded: boolean) => void; isMobile: boolean }) {
  return (
    <>
      <div className="w-full md:w-1/3 flex items-center justify-center">
        {url ? (
          <AnnotationTargetViewer url={url} setIsExpanded={setIsExpanded} isMobile={isMobile} />
        ) : (
          <Card className="p-0 overflow-hidden flex items-center justify-center relative w-full]">
            <LoaderCircle className="animate-spin" />
          </Card>
        )}
      </div>
    </>
  )
}