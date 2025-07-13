"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
  content: React.ReactNode
  isCompleted: boolean
  isOptional?: boolean
}

interface GetStartedStepProps {
  step: Step
  onNext: () => void
  onPrevious: () => void
  onComplete: () => void
  isFirst: boolean
  isLast: boolean
}

export function GetStartedStep({ step, onNext, onPrevious, onComplete, isFirst, isLast }: GetStartedStepProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {step.isCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
            <h1 className="text-2xl font-bold">{step.title}</h1>
            {step.isOptional && <Badge variant="secondary">Optional</Badge>}
          </div>
          <p className="text-muted-foreground text-lg">{step.description}</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">{step.content}</CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={isFirst} className="bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {step.isOptional && !step.isCompleted && (
              <Button variant="outline" onClick={onNext} className="bg-transparent">
                Skip for now
              </Button>
            )}
            {isLast ? (
              <Button onClick={onComplete}>Finish Setup</Button>
            ) : (
              <Button onClick={onNext}>
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
