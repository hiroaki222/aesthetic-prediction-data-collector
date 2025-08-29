'use client'

import { AnnotationHeader } from "@/components/annotation-header";
import AnnotationTarget from "@/components/annotation-target";
import AnnotationInput from "@/components/annotation-input";
import { Card } from "@/components/ui/card";
import { UserTasks } from "@/types/annotation";
import { fetchAnnotation, saveAnnotation } from "@/utils/annotation";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense, useRef } from "react"
import AnnotationControl from "@/components/annotation-control";
import AnnotationTargetViewer from "@/components/annotation-target-viewer";
import { LoaderCircle, TriangleAlert, X } from "lucide-react";
import { fetchUser } from "@/utils/supabase/actions";
import { toast } from "sonner";

function WarnToShortTime(duration: number) {
  return (
    toast((
      <div
        className="flex items-start whitespace-normal text-white bg-red-600 rounded-lg p-4 border-l-4 border-red-800"
        style={{ maxWidth: 'min(90vw, 760px)' }}
      >
        <TriangleAlert className="mr-3 mt-1 animate-pulse" size={28} />
        <div>
          <p className="text-lg font-bold leading-tight">入力が非常に短時間で行われました ({duration.toFixed(2)}秒)．</p>
          <p className="text-sm leading-snug opacity-95">提示された刺激を十分に確認してから評価してください．</p>
        </div>
      </div>
    ), {
      duration: 20000,
      position: 'top-center',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        minWidth: '520px',
        maxWidth: '90vw',
        border: 'none',
        outline: 'none',
        overflow: 'visible',
        WebkitBoxShadow: 'none',
        WebkitTapHighlightColor: 'transparent',
        backgroundClip: 'padding-box'
      },
    })
  )
}

function AnnotationContent() {
  const [annotationTargets, setAnnotationTargets] = useState<UserTasks>();
  const [annotationResult, setAnnotationResult] = useState<number[][]>();
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(1)
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [uuid, setUuid] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(performance.now() / 1000);
  const [finishFlag, setFinishFlag] = useState<boolean[]>([false, false]);
  const prevStepRef = useRef<number>(1);
  const dataType = useRef<string>('');

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
    dataType.current = annotationTargets.data.tag;
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
      const uuidValue = await fetchUser('id');
      setUuid(uuidValue);
      if (!uuidValue) {
        router.replace('/error/400');
        return;
      }
      if (!annotationResult) return;
    })();
  }, [annotationTargets, annotationResult, router, step]);

  useEffect(() => {
    if (!annotationTargets) return;
  }, [annotationTargets, annotationResult])

  const handleFinish = () => {
    setFinishFlag([true, false]);
  };

  const handleClose = () => {
    if (!annotationTargets || !annotationResult || !uuid) return;
    saveAnnotation(annotationTargets.task_id, annotationResult, annotationTargets, step, uuid);
    router.push('/dashboard');
  }

  useEffect(() => {
    setIsExpanded(isMobile ? false : true);
  }, [annotationTargets, step, isMobile]);

  useEffect(() => {
    if (prevStepRef.current !== step) {
      const duration = performance.now() / 1000 - startTime;
      if (annotationResult && annotationResult[prevStepRef.current - 1]) {
        setAnnotationResult(prevResult => {
          if (prevResult && prevResult[prevStepRef.current - 2]) {
            const updatedResult = [...prevResult];
            updatedResult[prevStepRef.current - 2][10] += duration;
            return updatedResult;
          }
          return prevResult;
        });
      }
      setStartTime(performance.now() / 1000);
      if (0.2 < duration) {
        if (duration < 25) {
          WarnToShortTime(duration);
        } else if (dataType.current === 'video' && duration < 60) {
          WarnToShortTime(duration);
        }
      }

      prevStepRef.current = step;

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (!annotationTargets || !annotationResult || !uuid) return;
    if (step >= annotationTargets.data.urls.length) {
      if (finishFlag[0]) {
        setFinishFlag([false, true]);
        const duration = performance.now() / 1000 - startTime;
        setAnnotationResult(prevResult => {
          if (prevResult) {
            const updatedResult = [...prevResult];
            updatedResult[prevStepRef.current - 1][10] += duration;
            return updatedResult;
          }
          return prevResult;
        });
      }
      if (finishFlag[1]) {
        saveAnnotation(annotationTargets.task_id, annotationResult, annotationTargets, step, uuid);
        router.push('/dashboard');
      }
    }
  }, [step, startTime, annotationResult, finishFlag])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExpanded && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyDown, true);
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
      };
    }
  }, [isExpanded]);

  return (
    <>
      {
        annotationTargets ? (
          <div className="min-h-screen bg-background flex flex-col">
            <AnnotationHeader currentStep={step} totalSteps={Object.keys(annotationTargets.data.urls).length} taskName={annotationTargets.data.title} handleClose={handleClose} />
            <Card className="flex-1 mx-5 mt-5 flex flex-col md:flex-row items-start justify-center p-5">
              <AnnotationTarget
                url={url}
                isExpanded={isExpanded}
                setIsExpanded={isMobile ? () => { } : setIsExpanded}
                isMobile={isMobile}
                dataType={dataType.current}
              />
              <AnnotationInput
                annotationResult={annotationResult}
                setAnnotationResult={setAnnotationResult}
                step={step}
                genre={annotationTargets?.data.genre}
              />
            </Card>
            <AnnotationControl
              step={step}
              setStep={setStep}
              range={Object.keys(annotationTargets.data.urls).length}
              onFinish={handleFinish}
              uuid={uuid}
              annotationTargets={annotationTargets}
              annotationResult={annotationResult}
            />
            {isExpanded && !isMobile && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto p-8"
                onClick={() => { if (dataType.current !== 'video') setIsExpanded(false); }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsExpanded(false);
                  }
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(false);
                  }
                }}
                tabIndex={-1}
              >
                <div className={
                  `relative w-full h-full max-w-[85vw] max-h-[85vh] ${dataType.current === 'video' ? 'pointer-events-auto' : 'pointer-events-none'}`
                }>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors pointer-events-auto"
                    style={{ position: 'fixed' }}
                  >
                    <X size={24} />
                  </button>
                  {url ? (
                    <AnnotationTargetViewer
                      url={url}
                      setIsExpanded={setIsExpanded}
                      isMobile={true}
                      dataType={dataType.current}
                      isFullScreen={true}
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