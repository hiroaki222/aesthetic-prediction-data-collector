import { Slider } from "@/components/ui/slider";
import { CardTitle } from "./ui/card";
import { useTranslations } from "use-intl";
import { Input } from "@/components/ui/input"
import { useState } from 'react';

export default function AnnotationInput({ annotationResult, setAnnotationResult, step, genre }: { annotationResult?: number[][], setAnnotationResult: (result: number[][]) => void, step: number, genre: string }) {
  const t = useTranslations('annotation')
  const range = [1, 2, 3, 4, 5];
  const overallRange = [1, 2, 3, 4, 5, 6, 7];
  // 入力中のテキストを管理（空文字も保持）
  const [inputTexts, setInputTexts] = useState<{ [key: number]: string }>({});

  const handleSliderChange = (index: number, value: number[]) => {
    if (!annotationResult) return;
    const allowedRange = index === 7 ? overallRange : range;
    const newValue = value[0] + 1;
    if (newValue < allowedRange[0] || newValue > allowedRange[allowedRange.length - 1]) return;
    const newValues = [...annotationResult];
    newValues[step - 1][index] = newValue;
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
      <div className="w-full flex flex-col">
        <a className="font-bold">{t('instructions.first')}</a>
        <a className="font-bold">{t('instructions.second', { genre })}</a>
        <a className="font-bold">{t('instructions.third', { genre })}</a>
        <a className="font-bold text-xs mt-5">{t('instructions.expansion', { genre })}</a>
      </div>
      {Array.from({ length: title.length - 1 }, (_, index) => (
        <div key={index} className="w-full m-5">
          <div className="flex">
            <div className="flex-1">
              <CardTitle className="text-center pb-2">{title[index]}</CardTitle>
              <Slider
                value={[(annotationResult[step - 1][index] ?? 1) - 1]}
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
              type="text"
              value={
                inputTexts[index] !== undefined
                  ? inputTexts[index]
                  : (annotationResult[step - 1][index] ?? '').toString()
              }
              onChange={(e) => {
                const normalizedValue = e.target.value.normalize('NFKC');
                setInputTexts((prev) => ({ ...prev, [index]: normalizedValue }));
                const parsedValue = parseInt(normalizedValue, 10);
                if (!isNaN(parsedValue) && parsedValue >= range[0] && parsedValue <= range[range.length - 1]) {
                  const newValues = [...annotationResult!];
                  newValues[step - 1][index] = parsedValue;
                  setAnnotationResult(newValues);
                }
              }}
              onBlur={() => {
                const text = inputTexts[index] ?? '';
                if (text === '') {
                  const mid = range[Math.floor(range.length / 2)];
                  const newValues = [...annotationResult!];
                  newValues[step - 1][index] = mid;
                  setAnnotationResult(newValues);
                }
                setInputTexts((prev) => {
                  const copy = { ...prev };
                  delete copy[index];
                  return copy;
                });
              }}
            />
          </div>
        </div>
      ))}
      <hr className="border-t border-gray-300 w-full" />
      <div className="w-full flex flex-col m-5">
        <a className="font-bold">{t('instructions.overall', { genre })}</a>
        <a className="font-bold text-xs mt-5">{t('instructions.overall-expansion', { genre })}</a>
      </div>
      <div className="w-full m-5">
        <div className="flex">
          <div className="flex-1">
            <CardTitle className="text-center pb-2">{title[7]}</CardTitle>
            <Slider
              value={[(annotationResult[step - 1][7] ?? 1) - 1]}
              onValueChange={(value) => handleSliderChange(7, value)}
              max={overallRange.length - 1}
              step={1}
            />
            <div className="mt-2 -mx-1.5 flex items-center justify-between text-muted-foreground text-xs">
              {overallRange.map((expansion) => (
                <span key={expansion}>{expansion}</span>
              ))}
            </div>
          </div>
          <Input
            className="mx-5 w-16"
            id={`annotation-input-7`}
            name={`annotation-input-7`}
            type="text"
            value={
              inputTexts[7] !== undefined
                ? inputTexts[7]
                : (annotationResult[step - 1][7] ?? '').toString()
            }
            onChange={(e) => {
              const normalizedValue = e.target.value.normalize('NFKC');
              setInputTexts((prev) => ({ ...prev, 7: normalizedValue }));
              const parsedValue = parseInt(normalizedValue, 10);
              if (!isNaN(parsedValue) && parsedValue >= overallRange[0] && parsedValue <= overallRange[overallRange.length - 1]) {
                const newValues = [...annotationResult!];
                newValues[step - 1][7] = parsedValue;
                setAnnotationResult(newValues);
              }
            }}
            onBlur={() => {
              const text = inputTexts[7] ?? '';
              if (text === '') {
                const mid = overallRange[Math.floor(overallRange.length / 2)];
                const newValues = [...annotationResult!];
                newValues[step - 1][7] = mid;
                setAnnotationResult(newValues);
              }
              setInputTexts((prev) => {
                const copy = { ...prev };
                delete copy[7];
                return copy;
              });
            }}
          />
        </div>
      </div>
    </div>
  )
}