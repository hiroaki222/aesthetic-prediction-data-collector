import { Slider } from "@/components/ui/slider";
import { CardTitle } from "./ui/card";
import { useTranslations } from "use-intl";
import { Input } from "@/components/ui/input"

export default function AnnotationInput({ annotationResult, setAnnotationResult, step }: { annotationResult?: number[][], setAnnotationResult: (result: number[][]) => void, step: number }) {
  const t = useTranslations('annotation')
  const range = [1, 2, 3, 4, 5];

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
  console.log(annotationResult)
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-5 md:mt-0">
      {Array.from({ length: title.length }, (_, index) => (
        <div key={index} className="w-full max-w-sm m-5">
          <CardTitle className="text-center pb-2">{title[index]}</CardTitle>
          <div className="flex">
            <div className="flex-1">
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
            <Input
              className="mx-5 w-16"
              id={`annotation-input-${index}`}
              name={`annotation-input-${index}`}
              type="number"
              value={annotationResult?.[step - 1]?.[index] ?? 0}
              min={1}
              max={5}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  handleSliderChange(index, [value]);
                }
              }}
            ></Input>
          </div>
        </div>
      ))}
    </div>
  )
}