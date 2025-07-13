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
import { ProfileData } from "@/types/profile"
import { saveUserProfile } from "@/utils/supabase/actions"

function GetStartedPageContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const codeParam = searchParams.get("code")
    if (!codeParam) {
      router.replace("/error/400")
      return
    }
    const uuidValue = String(codeParam)

    setProfileData({
      uuid: uuidValue,
      age: 0,
      gender: '',
      edu: '',
      art: '',
      pho: '',
      fas: '',
      mus: '',
      titpj: {},
    })
  }, [searchParams, router])

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



  const updateProfileData = (field: string, value: string | number | Record<string, unknown>) => {
    setProfileData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const handleStepComplete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const steps = [
    {
      id: 1,
      title: "Register Basic Information",
      description: "Enter your age, gender, and other personal details to help personalize your experience.",
      content: <ProfileSetupContent handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 2,
      title: "Register Experience",
      description: "Tell us about your experience in art, photography, fashion, and music. This helps us tailor recommendations and features for you.",
      content: <ExperienceSetupContent handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 3,
      title: "Register TIPIJ",
      description: "Configure your TIPIJ (This Is Personal Information Journal)",
      content: <TIPIJSetupContent1 handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
  ]

  const handleComplete = async () => {
    setCompletedSteps((prev) => [...prev, currentStep])
    if (!profileData) {
      router.replace("/error/400?message=Profile data is missing")
      return
    }
    await saveUserProfile(profileData)
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