import { Slider } from "@/components/ui/slider";
import { CardTitle } from "./ui/card";
import { useTranslations } from "use-intl";

export default function AnnotationInput({ annotationResult, setAnnotationResult, step }: { annotationResult?: number[][], setAnnotationResult: (result: number[][]) => void, step: number }) {
  const t = useTranslations('annotation')
  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleSliderChange = (index: number, value: number[]) => {
    if (!annotationResult) return;
    const newValues = [...annotationResult];
    newValues[step - 1][index] = value[0];
    setAnnotationResult(newValues);
  };

  const title = [
    t('labels.distasteful'),
    t('labels.overwhelmed'),
    t('labels.intellectually-challenged'),
    t('labels.motivated-to-act'),
    t('labels.nostalgic'),
    t('labels.sad'),
    t('labels.amused'),
    t('labels.overall-aesthetic'),
  ]

  if (!annotationResult) {
    return (
      <></>
    );
  }

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-5 md:mt-0">
      {Array.from({ length: title.length }, (_, index) => (
        <div key={index} className="w-full max-w-sm m-5">
          <CardTitle className="text-center pb-2">{title[index]}</CardTitle>
          <Slider
            value={[annotationResult?.[step - 1]?.[index] ?? 0]}
            onValueChange={(value) => handleSliderChange(index, value)}
            max={range.length - 1}
            step={1}
          />
          <div className="mt-2 -mx-1.5 flex items-center justify-between text-muted-foreground text-xs">
            {range.map((expansion) => (
              <span key={expansion}>{expansion}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}