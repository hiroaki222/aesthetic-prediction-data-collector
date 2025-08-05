"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Video, AudioLines } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface TaskCardProps {
  id: string
  title: string
  description: string
  image: string
  progress?: number
  duration?: string
  teamSize?: number
  tag?: "Img" | "audio" | "video"
  onStart?: (id: string) => void
  priority?: boolean
}

export function TaskCard({
  id,
  title,
  description,
  image,
  tag,
  progress = 0,
  onStart,
}: TaskCardProps) {
  const t = useTranslations('task-card')

  const getStatusFromProgress = () => {
    if (progress === 100) return "completed"
    if (progress > 0) return "in-progress"
    return "not-started"
  }

  const status = getStatusFromProgress()

  const getButtonText = () => {
    switch (status) {
      case "completed":
        return t('buttons.review')
      case "in-progress":
        return t('buttons.continue')
      default:
        return t('buttons.start')
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 py-0 pb-6">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {tag === 'Img' && (
          <Image
            src={image}
            alt={title}
            width={300}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        )}
        {tag === 'audio' && (
          <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
            <AudioLines className="w-16 h-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" />
          </div>
        )}
        {tag === 'video' && (
          <div className="w-full h-full bg-gradient-to-br from-sky-300 to-sky-500 flex items-center justify-center">
            <Video className="w-16 h-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" />
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('progress')}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Button
          onClick={() => onStart?.(id)}
          className="w-full"
          variant={status === "completed" ? "outline" : "default"}
        >
          {getButtonText()}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
