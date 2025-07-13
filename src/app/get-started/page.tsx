"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { GetStartedHeader } from "@/components/get-started-header"
import { GetStartedStep } from "@/components/get-started-step"
import {
  ProfileSetupContent,
  ExperienceSetupContent,
  TIPIJSetupContent1,
} from "@/components/step-contents"
import { useRouter, useSearchParams } from "next/navigation"
import { ProfileData } from "@/types/profile"
import { fetchUser, saveUserProfile } from "@/utils/supabase/actions"
import { StepSigninForm } from "@/components/step-signin-form"

function GetStartedPageContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultProfileData: ProfileData = useMemo(() => ({
    uuid: '',
    age: 0,
    gender: '',
    edu: '',
    art: '',
    pho: '',
    fas: '',
    mus: '',
    titpj: {},
  }), [])

  useEffect(() => {
    const codeParam = searchParams.get("code")
    if (!codeParam) {
      router.replace("/error/400")
      return
    }

    setProfileData({
      uuid: '',
      age: 0,
      gender: '',
      edu: '',
      art: '',
      pho: '',
      fas: '',
      mus: '',
      titpj: {},
    });

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

  const isProfileDataUnchanged = () => {
    if (!profileData) return true

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uuid: _profileUuid, ...profileDataToCompare } = profileData
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uuid: _defaultUuid, ...defaultDataToCompare } = defaultProfileData

    return Object.entries(defaultDataToCompare).every(([key, value]) => {
      const profileValue = profileDataToCompare[key as keyof Omit<ProfileData, 'uuid'>]
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(profileValue) === JSON.stringify(value)
      }
      return profileValue === value
    })
  }

  const isTIPIJComplete = () => {
    if (!profileData?.titpj) return false

    const requiredTIPIJItems = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    return requiredTIPIJItems.every(item =>
      profileData.titpj[item] && profileData.titpj[item] !== ''
    )
  }

  const steps = [
    {
      id: 1,
      title: "Sign In First",
      description: "Let's sign in first.",
      content: <StepSigninForm onSignInSuccess={() => setIsSignedIn(true)} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 2,
      title: "Register Basic Information",
      description: "Enter your age, gender, and other personal details to help personalize your experience.",
      content: <ProfileSetupContent handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 3,
      title: "Register Experience",
      description: "Tell us about your experience in art, photography, fashion, and music. This helps us tailor recommendations and features for you.",
      content: <ExperienceSetupContent handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 4,
      title: "Register TIPIJ",
      description: "Configure your TIPIJ (This Is Personal Information Journal)",
      content: <TIPIJSetupContent1 handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
  ]

  const handleComplete = async () => {
    if (isCompleting) return

    setIsCompleting(true)

    try {
      if (!profileData) {
        router.push("/error/400?message=Profile data is missing&description=Please ensure your profile data is set before completing the setup.")
        return
      }
      const userData = await fetchUser();
      const uuidValue = userData?.id
      if (!uuidValue) {
        router.push("/error/400?message=User UUID is missing&description=Please ensure you are logged in before completing the setup.")
        return
      }

      setProfileData((prev) => prev ? { ...prev, uuid: uuidValue } : prev)
      await saveUserProfile(profileData)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing setup:", error)
      setIsCompleting(false)
    }
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
        isFinishDisabled={isCompleting || isProfileDataUnchanged() || (currentStep === steps.length && !isTIPIJComplete())}
        isNextDisabled={currentStep === 1 && !isSignedIn}
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