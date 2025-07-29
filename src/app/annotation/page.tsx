import { AnnotationHeader } from "@/components/annotation-header";
import { processAnnotation } from "@/utils/annotation";

export default function AnnotationPage() {
  processAnnotation({ exampleKey: "exampleValue" });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnotationHeader currentStep={1} totalSteps={3} taskName={"タスク"} />
    </div>
  )
}