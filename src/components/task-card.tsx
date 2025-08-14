"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Video, AudioLines, Lock } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface TaskCardProps {
  id: string
  title: string
  description: string
  image: string
  progress?: number
  order: number
  tag?: "Img" | "audio" | "video"
  onStart?: (id: string) => void
  priority?: boolean
  isLocked?: boolean
}

export function TaskCard({
  id,
  title,
  description,
  image,
  tag,
  progress = 0,
  order,
  onStart,
  priority = false,
  isLocked = false,
}: TaskCardProps) {
  const t = useTranslations('task-card')

  const getStatusFromProgress = () => {
    if (isLocked) return "locked"
    if (progress === 100) return "completed"
    if (progress > 0) return "in-progress"
    return "not-started"
  }

  const status = getStatusFromProgress()

  const getButtonText = () => {
    switch (status) {
      case "locked":
        return t('buttons.locked')
      case "completed":
        return t('buttons.review')
      case "in-progress":
        return t('buttons.continue')
      default:
        return t('buttons.start')
    }
  }

  return (
    <Card className={`group transition-all duration-200 py-0 pb-6 ${isLocked
      ? "opacity-50 cursor-not-allowed bg-muted"
      : "hover:shadow-lg hover:-translate-y-1"
      }`}>
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {tag === 'Img' && (
          <Image
            src={image}
            alt={title}
            width={300}
            height={200}
            priority={priority}
            className={`w-full h-full object-cover transition-transform duration-200 ${isLocked ? "grayscale" : "group-hover:scale-105"
              }`}
          />
        )}
        {tag === 'audio' && (
          <div className={`w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center ${isLocked ? "grayscale" : ""
            }`}>
            <AudioLines className={`w-16 h-16 text-white drop-shadow-lg transition-transform duration-200 ${isLocked ? "" : "group-hover:scale-110"
              }`} />
          </div>
        )}
        {tag === 'video' && (
          <div className={`w-full h-full bg-gradient-to-br from-sky-300 to-sky-500 flex items-center justify-center ${isLocked ? "grayscale" : ""
            }`}>
            <Video className={`w-16 h-16 text-white drop-shadow-lg transition-transform duration-200 ${isLocked ? "" : "group-hover:scale-110"
              }`} />
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Lock className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{title + " " + Math.floor(((order - Math.floor(order)) * 10))}</CardTitle>
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
          onClick={() => !isLocked && status !== "completed" && onStart?.(id)}
          className="w-full"
          variant={status === "completed" ? "outline" : "default"}
          disabled={isLocked || status === "completed"}
        >
          {getButtonText()}
          {isLocked ? (
            <Lock className="ml-2 h-4 w-4" />
          ) : status === "completed" ? null : (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
