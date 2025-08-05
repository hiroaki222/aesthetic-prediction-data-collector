'use client'
import AnnotationControl from "@/components/annotation-control";
import { AnnotationHeader } from "@/components/annotation-header";
import AnnotationTarget from "@/components/annotation-target";
import AnnotationInput from "@/components/annotation.input";
import { Card } from "@/components/ui/card";
import { fetchAnnotation } from "@/utils/annotation";
import { LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { AnnotationData } from "@/components/annotation.input";


interface AnnotationTargetData {
  imageUrl: string;
  [key: string]: unknown;
}



export default function AnnotationPage() {
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [annotationTargets, setAnnotationTargets] = useState<{ [key: string]: AnnotationTargetData }>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [annotationResult, setAnnotationResult] = useState<AnnotationData[]>([[5, 5, 5, 5, 5, 5, 5, 5]]);
  const wh = [300, 200];

  useEffect(() => {
    const loadAnnotations = async () => {
      const data = await fetchAnnotation('1');
      setAnnotationTargets(data);
    };
    loadAnnotations();
  }, [])

  useEffect(() => {
    const format = Object.keys(annotationTargets).map(() => ([5, 5, 5, 5, 5, 5, 5, 5] as AnnotationData));
    setAnnotationResult(format);
  }, [annotationTargets])

  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    setImageUrl(annotationTargets[step]?.imageUrl);
    setIsExpanded(isMobile ? false : true);
  }, [annotationTargets, step, isMobile]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnotationHeader currentStep={step} totalSteps={Object.keys(annotationTargets).length} taskName={"タスク名"} />
      <Card className="flex-1 mx-5 mt-5 flex flex-col md:flex-row items-center justify-center p-5">
        <AnnotationTarget
          imageUrl={imageUrl}
          isExpanded={isExpanded}
          setIsExpanded={isMobile ? () => { } : setIsExpanded}
          isMobile={isMobile}
        />
        <AnnotationInput
          annotationResult={annotationResult}
          setAnnotationResult={setAnnotationResult}
          step={step}
        />
      </Card>
      <AnnotationControl step={step} setStep={setStep} range={Object.keys(annotationTargets).length} />
      {isExpanded && !isMobile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto"
          onClick={() => setIsExpanded(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsExpanded(false);
            }
          }}
          tabIndex={-1}
        >
          <div className="relative w-[90vw] h-[90vh] pointer-events-none">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors pointer-events-auto"
            >
              <X size={24} />
            </button>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Annotation Target Expanded"
                width={wh[0]}
                height={wh[1]}
                className="w-full h-full object-cover rounded-lg pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full pointer-events-none">
                <LoaderCircle className="animate-spin size-20" />
              </div>
            )}

          </div>
        </div>
      )}
    </div >
  )
}