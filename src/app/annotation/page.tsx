'use client'
import AnnotationControl from "@/components/annotation-control";
import { AnnotationHeader } from "@/components/annotation-header";
import AnnotationTarget from "@/components/annotation-target";
import { processAnnotation } from "@/utils/annotation";

export default function AnnotationPage() {
  processAnnotation({ exampleKey: "exampleValue" });


  const onClickPrev = () => {
    console.log("Previous step clicked");
  }
  const onClickNext = () => {
    console.log("Next step clicked");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnotationHeader currentStep={1} totalSteps={3} taskName={"タスク"} />
      <AnnotationTarget imageUrl={"https://picsum.photos/300/200"} />
      <AnnotationControl onClickPrev={onClickPrev} onClickNext={onClickNext} />
    </div >
  )
}