import Image from "next/image";
import { Expand } from "lucide-react";

export default function AnnotationTargetViewer({ url, setIsExpanded, isMobile, isFullScreen = false }: { url: string; setIsExpanded: (isExpanded: boolean) => void; isMobile: boolean; isFullScreen?: boolean }) {
  return (
    <div className={`${isFullScreen ? 'p-0 overflow-hidden w-full h-full flex items-center justify-center relative border-0 bg-transparent' : 'p-0 overflow-hidden w-full flex items-center justify-center relative'}`}>
      <div className={`relative ${isFullScreen ? 'w-full h-full' : 'w-full'} flex items-center justify-center`}>
        <Image
          src={url}
          alt="Annotation Target"
          width={1920}
          height={1080}
          className={`${isFullScreen ? 'max-w-full max-h-full object-contain' : 'w-full h-auto max-h-[70vh] object-contain'}`}
          priority={true}
        />
      </div>
      {!isMobile ? (
        <button onClick={() => setIsExpanded(true)} className="absolute top-2 right-2 z-10">
          <Expand className="text-white hover:text-white transition-colors drop-shadow-md bg-black/20 rounded p-1" />
        </button>
      ) : null}
    </div>
  )
}