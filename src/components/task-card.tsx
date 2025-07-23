"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface TaskCardProps {
  id: string
  title: string
  description: string
  image: string
  progress?: number
  duration?: string
  teamSize?: number
  onStart?: (id: string) => void
}

export function TaskCard({
  id,
  title,
  description,
  image,
  progress = 0,
  onStart,
}: TaskCardProps) {
  const getStatusFromProgress = () => {
    if (progress === 100) return "completed"
    if (progress > 0) return "in-progress"
    return "not-started"
  }

  const status = getStatusFromProgress()

  const getButtonText = () => {
    switch (status) {
      case "completed":
        return "Review"
      case "in-progress":
        return "Continue"
      default:
        return "Start Task"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
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
