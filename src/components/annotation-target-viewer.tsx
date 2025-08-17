import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export default function AnnotationTargetViewer({ url, setIsExpanded, isMobile, dataType, isFullScreen = false }: { url: string; setIsExpanded: (isExpanded: boolean) => void; isMobile: boolean; dataType: string; isFullScreen?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  /* url = "https://bvy3dtfuknsslhnc.public.blob.vercel-storage.com/__GEoXDwIjI_0089636_0091436.mp4"
  dataType = "video"; */
  const t = useTranslations('annotation');

  useEffect(() => {
    if (dataType === 'video' && videoRef.current && isFullScreen === true) {
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
    <div
      className={`${isFullScreen ? 'p-0 overflow-hidden w-full h-full flex items-center justify-center relative border-0 bg-transparent' : 'p-0 overflow-hidden w-full flex items-center justify-center flex-col relative'}`}
      onClick={(e) => e.stopPropagation()}
    >
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
                src={url}
                className={`${isFullScreen ? 'w-full h-full object-contain' : 'w-full h-auto max-h-[70vh] object-contain'}`}
                controls
                loop
                preload="metadata"
              />
            ) : null
          )
        }
      </div>
      {!isMobile ? (
        <Button className="m-5 w-1/4 font-bold" onClick={() => setIsExpanded(true)}>
          <a>{t('expand-button')}</a>
        </Button>
      ) : null}
    </div>
  )
}