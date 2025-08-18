"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
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
  const t = useTranslations('get-started-page')
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultProfileData: ProfileData = useMemo(() => ({
    name: '',
    uuid: '',
    age: 0,
    gender: '',
    edu: '',
    nationality: '',
    experience: {
      art: { learn: { learnedAt: '', year: -1, month: -1 }, job: undefined, interest: -1 },
      fashion: { learn: { learnedAt: '', year: -1, month: -1 }, job: undefined, interest: -1 },
      photoVideo: { learn: { learnedAt: '', year: -1, month: -1 }, job: undefined, interest: -1 },
    },
    titpj: {},
  }), [])

  useEffect(() => {
    const codeParam = searchParams.get("code")
    if (!codeParam) {
      router.replace("/error/400")
      return
    }

    setProfileData({
      name: '',
      uuid: '',
      age: 0,
      gender: '',
      edu: '',
      nationality: '',
      experience: {
        art: { learn: { learnedAt: '', year: -1, month: -1 }, job: undefined, interest: -1 },
        fashion: { learn: { learnedAt: '', year: -1, month: -1 }, job: undefined, interest: -1 },
        photoVideo: { learn: { learnedAt: '', year: -1, month: -1 }, job: undefined, interest: -1 },
      },
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



  const updateProfileData = (updates: Partial<ProfileData> | Record<string, unknown>) => {
    setProfileData((prev) => {
      if (!prev) return null

      if (typeof updates === 'object' && !Array.isArray(updates)) {
        const hasNestedPath = Object.keys(updates).some(key => key.includes('.'))

        if (hasNestedPath) {
          const newData = JSON.parse(JSON.stringify(prev)) as ProfileData

          Object.entries(updates).forEach(([path, value]) => {
            if (path.includes('.')) {
              const keys = path.split('.')
              let current = newData as unknown as Record<string, unknown>

              for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i]
                if (!(key in current) || typeof current[key] !== 'object') {
                  current[key] = {}
                }
                current = current[key] as Record<string, unknown>
              }

              current[keys[keys.length - 1]] = value
            } else {
              (newData as unknown as Record<string, unknown>)[path] = value
            }
          })

          return newData
        } else {
          return {
            ...prev,
            ...updates as Partial<ProfileData>,
          }
        }
      }

      return prev
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
      title: t('steps.sign-in.title'),
      description: t('steps.sign-in.description'),
      content: <StepSigninForm onSignInSuccess={() => setIsSignedIn(true)} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 2,
      title: t('steps.profile-setup.title'),
      description: t('steps.profile-setup.description'),
      content: <ProfileSetupContent handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 3,
      title: t('steps.experience-setup.title'),
      description: t('steps.experience-setup.description'),
      content: <ExperienceSetupContent handleStepComplete={handleStepComplete} updateProfileData={updateProfileData} profileData={profileData} />,
      isCompleted: false,
      isOptional: false,
    },
    {
      id: 4,
      title: t('steps.tipij-setup.title'),
      description: t('steps.tipij-setup.description'),
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
      const uuid = await fetchUser('id');
      if (!uuid) {
        router.push("/error/400?message=User UUID is missing&description=Please ensure you are logged in before completing the setup.")
        return
      }

      const profileDataWithUuid = { ...profileData, uuid: uuid }
      await saveUserProfile(profileDataWithUuid)
      router.push("/dashboard")
    } catch (error) {
      setIsCompleting(false)
      console.error("Error completing setup:", error)
      router.push("/error/500?message=Failed to complete setup&description=An error occurred while saving your profile data. Please try again later.")
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
  const t = useTranslations('get-started-page')

  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <GetStartedPageContent />
    </Suspense>
  )
}