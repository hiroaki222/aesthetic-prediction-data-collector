'use client'
import AnnotationControl from "@/components/annotation-control";
import { AnnotationHeader } from "@/components/annotation-header";
import AnnotationTarget from "@/components/annotation-target";
import AnnotationInput from "@/components/annotation.input";
import { Card } from "@/components/ui/card";
import { fetchAnnotation } from "@/utils/annotation";
import { useEffect, useState } from "react";

interface AnnotationTargetData {
  imageUrl: string;
  [key: string]: unknown;
}

export default function AnnotationPage() {
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  const [annotationTargets, setAnnotationTargets] = useState<{ [key: string]: AnnotationTargetData }>({});
  useEffect(() => {
    const loadAnnotations = async () => {
      const data = await fetchAnnotation('1');
      setAnnotationTargets(data);
    };
    loadAnnotations();
  }, [])

  useEffect(() => {
    setImageUrl(annotationTargets[step]?.imageUrl);
  }, [annotationTargets, step]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnotationHeader currentStep={step} totalSteps={Object.keys(annotationTargets).length} taskName={"タスク"} />
      <Card className="flex-1 mx-5 mt-5 flex flex-col md:flex-row items-center justify-center p-5">
        <AnnotationTarget imageUrl={imageUrl} />
        <AnnotationInput />
      </Card>
      <AnnotationControl step={step} setStep={setStep} range={Object.keys(annotationTargets).length} />
    </div >
  )
}