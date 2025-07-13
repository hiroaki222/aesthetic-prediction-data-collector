"use client"

import { Suspense, useEffect, useState } from "react"
import { GetStartedHeader } from "@/components/get-started-header"
import { GetStartedStep } from "@/components/get-started-step"
import {
  ProfileSetupContent,
  ExperienceSetupContent,
  TIPIJSetupContent1,
} from "@/components/step-contents"
import { useRouter, useSearchParams } from "next/navigation"

const steps = [
  {
    id: 1,
    title: "Register Basic Information",
    description: "Enter your age, gender, and other personal details to help personalize your experience.",
    content: <ProfileSetupContent />,
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 2,
    title: "Register Experience",
    description: "Tell us about your experience in art, photography, fashion, and music. This helps us tailor recommendations and features for you.",
    content: <ExperienceSetupContent />,
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 3,
    title: "Configure Notifications",
    description: "Choose how and when you want to be notified about important updates.",
    content: <TIPIJSetupContent1 />,
    isCompleted: false,
    isOptional: false,
  },
]

export function GetStartedPageContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [uuid, setUuid] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setUuid(String(searchParams.get("code")))
    if (!uuid) {
      router.replace("/error/400")
      return
    }
  }, [searchParams, router, uuid])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) => [...prev, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setCompletedSteps((prev) => [...prev, currentStep])

    router.push("/dashboard")
  }

  const currentStepData = {
    ...steps[currentStep - 1],
    isCompleted: completedSteps.includes(currentStep),
  }

  return (
    <div className="min-h-screen bg-background">
      <GetStartedHeader currentStep={currentStep} totalSteps={steps.length} />
      <GetStartedStep
        step={currentStepData}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onComplete={handleComplete}
        isFirst={currentStep === 1}
        isLast={currentStep === steps.length}
      />
    </div>
  )
}

export default function GetStartedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GetStartedPageContent />
    </Suspense>
  )
}