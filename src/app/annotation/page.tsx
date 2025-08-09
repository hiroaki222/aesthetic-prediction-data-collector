'use client'

import { AnnotationHeader } from "@/components/annotation-header";
import AnnotationTarget from "@/components/annotation-target";
import AnnotationInput from "@/components/annotation.input";
import { Card } from "@/components/ui/card";
import { UserTasks } from "@/types/annotation";
import { fetchAnnotation, saveAnnotation } from "@/utils/annotation";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react"
import AnnotationControl from "@/components/annotation-control";
import Image from "next/image";
import { LoaderCircle, X } from "lucide-react";
import { fetchUser } from "@/utils/supabase/actions";

function AnnotationContent() {
  const [annotationTargets, setAnnotationTargets] = useState<UserTasks>();
  const [annotationResult, setAnnotationResult] = useState<number[][]>();
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(1)
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const taskId = searchParams.get('taskId');
    if (!taskId) {
      router.replace('/error/400');
      return;
    }
    (async () => {
      const data = await fetchAnnotation(taskId);
      setAnnotationTargets(data);
    })();

    const checkIsMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [router, searchParams])

  useEffect(() => {
    if (!annotationTargets) return;
    if (annotationTargets.step == 0) {
      setStep(annotationTargets.step + 1)
    } else {
      setStep(annotationTargets.step)
    }
    setAnnotationResult(annotationTargets.data.result);
    if (annotationTargets.data.tag === 'audio') {
      setIsExpanded(false);
      setIsMobile(true)
    }
  }, [annotationTargets]);

  useEffect(() => {
    if (!annotationTargets) return;
    if (annotationTargets.data.urls.length < step) {
      router.replace('/dashboard');
      return;
    }
    setUrl(annotationTargets.data.urls[step - 1]);
  }, [annotationTargets, step, router]);

  useEffect(() => {
    if (!annotationTargets) return;
    (async () => {
      const uuid = await fetchUser('id');
      if (!uuid) {
        router.replace('/error/400');
        return;
      }
      if (!annotationResult) return;
      saveAnnotation(annotationTargets.task_id, annotationResult, annotationTargets, step, uuid);
    })();
  }, [annotationTargets, annotationResult, router, step]);

  useEffect(() => {
    if (!annotationTargets) return;
  }, [annotationTargets, annotationResult])

  const handleFinish = () => {
    router.push('/dashboard');
  };

  useEffect(() => {
    setIsExpanded(isMobile ? false : true);
  }, [annotationTargets, step, isMobile]);

  return (
    <>
      {
        annotationTargets ? (
          <div className="min-h-screen bg-background flex flex-col">
            <AnnotationHeader currentStep={step} totalSteps={Object.keys(annotationTargets.data.urls).length} taskName={annotationTargets.data.title} />
            <Card className="flex-1 mx-5 mt-5 flex flex-col md:flex-row items-center justify-center p-5">
              <AnnotationTarget
                url={url}
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
            <AnnotationControl
              step={step}
              setStep={setStep}
              range={Object.keys(annotationTargets.data.urls).length}
              onFinish={handleFinish}
            />
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
                    style={{ position: 'fixed' }}
                  >
                    <X size={24} />
                  </button>
                  {url ? (
                    <Image
                      src={url}
                      alt="Annotation Target Expanded"
                      fill
                      sizes="100vw"
                      className="object-contain pointer-events-auto"
                      onClick={(e) => e.stopPropagation()}
                      priority={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full pointer-events-none">
                      <LoaderCircle className="animate-spin size-20" />
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen w-full">
            <LoaderCircle className="animate-spin size-20" />
          </div>
        )
      }
    </>

  )
}

export default function AnnotationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen w-full">
        <LoaderCircle className="animate-spin size-20" />
      </div>
    }>
      <AnnotationContent />
    </Suspense>
  )
}