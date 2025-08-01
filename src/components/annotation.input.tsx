import { Slider } from "@/components/ui/slider";
import { CardTitle } from "./ui/card";
import { useTranslations } from "use-intl";

export default function AnnotationInput() {
  const t = useTranslations('annotation')
  const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const title = [
    t('1'),
    t('2'),
    t('3'),
    t('4'),
    t('5'),
    t('6'),
    t('7'),
    t('8'),
  ]

  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-5 md:mt-0">
      {Array.from({ length: title.length }, (_, index) => (
        <div key={index} className="w-full max-w-sm m-5">
          <CardTitle className="text-center pb-2">{title[index]}</CardTitle>
          <Slider defaultValue={[5]} max={range.length - 1} step={1} />
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