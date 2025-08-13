import Image from "next/image";
import { Expand } from "lucide-react";
import { useEffect, useRef } from "react";

export default function AnnotationTargetViewer({ url, setIsExpanded, isMobile, dataType, isFullScreen = false }: { url: string; setIsExpanded: (isExpanded: boolean) => void; isMobile: boolean; dataType: string; isFullScreen?: boolean }) {
  const videoUrl = 'https://bvy3dtfuknsslhnc.public.blob.vercel-storage.com/__GEoXDwIjI_0089636_0091436.mp4';
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (dataType === 'video' && videoRef.current) {
      const video = videoRef.current;

      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.warn('Auto-play failed:', error);
        }
      };

      if (video.readyState >= 3) {
        playVideo();
      } else {
        video.addEventListener('loadeddata', playVideo);
      }

      return () => {
        video.removeEventListener('loadeddata', playVideo);
      };
    }
  }, [dataType]);

  if (dataType === 'video') isMobile = true;
  return (
    <div className={`${isFullScreen ? 'p-0 overflow-hidden w-full h-full flex items-center justify-center relative border-0 bg-transparent' : 'p-0 overflow-hidden w-full flex items-center justify-center relative'}`}>
      <div className={`relative ${isFullScreen ? 'w-full h-full' : 'w-full'} flex items-center justify-center`}>
        {
          dataType === 'Img' ? (
            <Image
              src={url}
              alt="Annotation Target"
              width={1920}
              height={1080}
              className={`${isFullScreen ? 'max-w-full max-h-full object-contain' : 'w-full h-auto max-h-[70vh] object-contain'}`}
              priority={true}
            />
          ) : (
            dataType === 'video' ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className={`${isFullScreen ? 'w-full h-full object-contain' : 'w-full h-auto max-h-[70vh] object-contain'}`}
                controls
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            ) : null
          )
        }
      </div>
      {!isMobile ? (
        <button onClick={() => setIsExpanded(true)} className="absolute top-2 right-2 z-10">
          <Expand className="text-white hover:text-white transition-colors drop-shadow-md bg-black/20 rounded p-1" />
        </button>
      ) : null}
    </div>
  )
}