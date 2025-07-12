"use client"

import { useState } from "react"
import { GetStartedHeader } from "@/components/get-started-header"
import { GetStartedStep } from "@/components/get-started-step"
import {
  ProfileSetupContent,
  WorkspaceSetupContent,
  NotificationSetupContent,
  PreferencesSetupContent,
} from "@/components/step-contents"
import { useRouter } from "next/navigation"

const steps = [
  {
    id: 1,
    title: "Complete Your Profile",
    description: "Add your personal information and profile photo to help others recognize you.",
    content: <ProfileSetupContent />,
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 2,
    title: "Set Up Your Workspace",
    description: "Create your workspace and tell us about your team to customize your experience.",
    content: <WorkspaceSetupContent />,
    isCompleted: false,
    isOptional: false,
  },
  {
    id: 3,
    title: "Configure Notifications",
    description: "Choose how and when you want to be notified about important updates.",
    content: <NotificationSetupContent />,
    isCompleted: false,
    isOptional: true,
  },
  {
    id: 4,
    title: "Customize Preferences",
    description: "Set your appearance, language, and other preferences to make the app yours.",
    content: <PreferencesSetupContent />,
    isCompleted: false,
    isOptional: true,
  },
]

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const router = useRouter()

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
    // Redirect to dashboard or welcome page
    router.push("/welcome")
  }

  const handleClose = () => {
    router.push("/welcome")
  }

  const currentStepData = {
    ...steps[currentStep - 1],
    isCompleted: completedSteps.includes(currentStep),
  }

  return (
    <div className="min-h-screen bg-background">
      <GetStartedHeader currentStep={currentStep} totalSteps={steps.length} onClose={handleClose} />
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
