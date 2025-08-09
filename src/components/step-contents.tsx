"use client"

import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileData } from "@/types/profile"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CardDescription } from "./ui/card"
import { useEffect, useState } from "react"
import { fetchUser } from "@/utils/supabase/actions"
import { LoaderCircle } from "lucide-react"
//import { Checkbox } from "@/components/ui/checkbox"

type ProfileSetupContentProps = {
  handleStepComplete: React.FormEventHandler<HTMLFormElement>
  updateProfileData: (field: string, value: string | number | Record<string, unknown>) => void
  profileData: ProfileData | null
}

export function ProfileSetupContent({ handleStepComplete, updateProfileData, profileData }: ProfileSetupContentProps) {
  const t = useTranslations('step-contents.profile-setup')
  const [isJaistStudent, setIsJaistStudent] = useState<boolean>(false);
  const [genderSelect, setGenderSelect] = useState<string>(profileData?.gender || '');
  const [customGender, setCustomGender] = useState<string>('');
  const [eduSelect, setEduSelect] = useState<string>(profileData?.edu || '');
  const [customEdu, setCustomEdu] = useState<string>('');

  useEffect(() => {
    (async () => {
      const mail = await fetchUser('email');
      if (mail && mail.endsWith('@jaist.ac.jp')) {
        setIsJaistStudent(true);
      }
    })()
  }, [])

  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="grid gap-4" >
        {isJaistStudent && (
          <div className="grid gap-2">
            <Label htmlFor="name">{t('labels.name')}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t('placeholders.name')}
              value={profileData?.name || ''}
              onChange={(e) => {
                const normalizedValue = e.target.value.replace(/　/g, ' ');
                updateProfileData('name', normalizedValue);
              }}
              required
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="age">{t('labels.age')}</Label>
          <Input
            id="age"
            name="age"
            type="number"
            min={1}
            placeholder={t('placeholders.age')}
            value={profileData?.age || ''}
            onChange={(e) => updateProfileData('age', parseInt(e.target.value, 10) || 0)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">{t('labels.gender')}</Label>
          <select
            id="gender"
            name="gender"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={genderSelect}
            onChange={(e) => {
              const val = e.target.value;
              setGenderSelect(val);
              updateProfileData('gender', val);
            }}
            required
          >
            <option value="" disabled>{t('gender-options.select')}</option>
            <option value="male">{t('gender-options.male')}</option>
            <option value="female">{t('gender-options.female')}</option>
            <option value="other">{t('gender-options.other')}</option>
          </select>
        </div>
        {genderSelect === 'other' && (
          <div className="grid gap-2">
            <Label htmlFor="genderOther">{t('placeholders.gender-other')}</Label>
            <Input
              id="genderOther"
              name="genderOther"
              type="text"
              placeholder={t('placeholders.gender-other')}
              value={customGender}
              onChange={(e) => {
                const val = e.target.value;
                setCustomGender(val);
                updateProfileData('gender', val);
              }}
              required
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="education">{t('labels.education')}</Label>
          <select
            id="education"
            name="education"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={eduSelect}
            onChange={(e) => {
              const val = e.target.value;
              setEduSelect(val);
              updateProfileData('edu', val);
            }}
            required
          >
            <option value="" disabled>{t('education-options.select')}</option>
            <option value="junior_high">{t('education-options.junior-high')}</option>
            <option value="high_school">{t('education-options.high-school')}</option>
            <option value="vocational">{t('education-options.vocational')}</option>
            <option value="junior_college">{t('education-options.junior-college')}</option>
            <option value="technical_college">{t('education-options.technical-college')}</option>
            <option value="university">{t('education-options.university')}</option>
            <option value="graduate">{t('education-options.graduate')}</option>
            <option value="other">{t('education-options.other')}</option>
          </select>
        </div>
        {eduSelect === 'other' && (
          <div className="grid gap-2">
            <Label htmlFor="educationOther">{t('placeholders.education-other')}</Label>
            <Input
              id="educationOther"
              name="educationOther"
              type="text"
              placeholder={t('placeholders.education-other')}
              value={customEdu}
              onChange={(e) => {
                const val = e.target.value;
                setCustomEdu(val);
                updateProfileData('edu', val);
              }}
              required
            />
          </div>
        )}
      </div>
    </form>
  )
}

export function ExperienceSetupContent({ handleStepComplete, updateProfileData, profileData }: ProfileSetupContentProps) {
  const t = useTranslations('step-contents.experience-setup')
  const [experienceComponents, setExperienceComponents] = useState<React.JSX.Element[]>([<LoaderCircle key="loader" className="animate-spin" />])

  useEffect(() => {
    const tmp = []
    for (const key of Object.keys(profileData?.experience || {})) {
      tmp.push(
        <div key={key} className="grid gap-2">
          <a>{t(`title.${key}`)}</a>
          <div className="">
            <div className="flex items-center mb-2">
              <Label htmlFor={`learned-at-${key}`}>{t(`labels.learned-at.first`) + t(`labels.learned-at.${key}`) + t(`labels.learned-at.last`)}</Label>
            </div>
            <div className="flex items-end gap-2">
              <Input
                id={`learned-at-${key}`}
                name={`learned-at-${key}`}
                value={profileData?.experience?.[key as keyof typeof profileData.experience]?.learn?.learnedAt || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateProfileData(`experience.${key}.learn.learnedAt`, val);
                }}
              ></Input>
              <a>{t(`labels.learned-at.conjunction`)}</a>
              <Input
                id={`learned-year-${key}`}
                name={`learned-year-${key}`}
                type="number"
                min="0"
                max="100"
                step="1"
                className=" w-20"
                value={profileData?.experience?.[key as keyof typeof profileData.experience]?.learn?.year || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    updateProfileData(`experience.${key}.learn.year`, val);
                  }
                }}
              />
              <a>{t(`labels.learned-at.year`)}</a>
            </div>
          </div>
          <div className="my-5">
            <div className="flex items-center mb-2">
              <Label htmlFor={`job-${key}`}>{t(`labels.job-experience.${key}`) + t(`labels.job-experience.last`)}</Label>
            </div>
          </div>
          <div className="">
            <Label htmlFor={`interest-${key}`}>{t(`labels.interest.${key}`) + t(`labels.interest.last`)}</Label>
          </div>
        </div>
      )
    }
    setExperienceComponents(tmp)
  }, [])

  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="grid gap-10">
        {experienceComponents}
        {/* <div className="grid gap-2">
          <Label htmlFor="artisticExperience">{t('labels.artistic-experience')}</Label>
          <select
            id="artisticExperience"
            name="artisticExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.art || ''}
            onChange={(e) => updateProfileData('art', e.target.value)}
            required
          >
            <option value="" disabled>{t('level-options.select')}</option>
            <option value="none">{t('level-options.none')}</option>
            <option value="beginner">{t('level-options.beginner')}</option>
            <option value="intermediate">{t('level-options.intermediate')}</option>
            <option value="advanced">{t('level-options.advanced')}</option>
            <option value="professional">{t('level-options.professional')}</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="photographicExperience">{t('labels.photographic-experience')}</Label>
          <select
            id="photographicExperience"
            name="photographicExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.pho || ''}
            onChange={(e) => updateProfileData('pho', e.target.value)}
            required
          >
            <option value="" disabled>{t('level-options.select')}</option>
            <option value="none">{t('level-options.none')}</option>
            <option value="beginner">{t('level-options.beginner')}</option>
            <option value="intermediate">{t('level-options.intermediate')}</option>
            <option value="advanced">{t('level-options.advanced')}</option>
            <option value="professional">{t('level-options.professional')}</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fashionExperience">{t('labels.fashion-experience')}</Label>
          <select
            id="fashionExperience"
            name="fashionExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.fas || ''}
            onChange={(e) => updateProfileData('fas', e.target.value)}
            required
          >
            <option value="" disabled>{t('level-options.select')}</option>
            <option value="none">{t('level-options.none')}</option>
            <option value="beginner">{t('level-options.beginner')}</option>
            <option value="intermediate">{t('level-options.intermediate')}</option>
            <option value="advanced">{t('level-options.advanced')}</option>
            <option value="professional">{t('level-options.professional')}</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="musicalExperience">{t('labels.musical-experience')}</Label>
          <select
            id="musicalExperience"
            name="musicalExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.mus || ''}
            onChange={(e) => updateProfileData('mus', e.target.value)}
            required
          >
            <option value="" disabled>{t('level-options.select')}</option>
            <option value="none">{t('level-options.none')}</option>
            <option value="beginner">{t('level-options.beginner')}</option>
            <option value="intermediate">{t('level-options.intermediate')}</option>
            <option value="advanced">{t('level-options.advanced')}</option>
            <option value="professional">{t('level-options.professional')}</option>
          </select>
        </div> */}
      </div>
    </form>
  )
}

export function TIPIJSetupContent1({ handleStepComplete, updateProfileData, profileData }: ProfileSetupContentProps) {
  const t = useTranslations('step-contents.tipij-setup')

  const options = [
    {
      row: '1', label: t('statements.1')
    },
    { row: '2', label: t('statements.2') },
    { row: '3', label: t('statements.3') },
    { row: '4', label: t('statements.4') },
    { row: '5', label: t('statements.5') },
    { row: '6', label: t('statements.6') },
    { row: '7', label: t('statements.7') },
    { row: '8', label: t('statements.8') },
    { row: '9', label: t('statements.9') },
    { row: '10', label: t('statements.10') },
  ]

  const handleTIPIJChange = (row: string, value: string) => {
    const currentTitpj = profileData?.titpj || {}
    const updatedTitpj = {
      ...currentTitpj,
      [row]: value
    }
    updateProfileData('titpj', updatedTitpj)
  }

  const scaleOptions = [
    { value: '7', label: t('scale-options.strongly-agree') },
    { value: '6', label: t('scale-options.moderately-agree') },
    { value: '5', label: t('scale-options.slightly-agree') },
    { value: '4', label: t('scale-options.neither') },
    { value: '3', label: t('scale-options.slightly-disagree') },
    { value: '2', label: t('scale-options.moderately-disagree') },
    { value: '1', label: t('scale-options.strongly-disagree') },
  ]

  const tableRows = options.map(option => {
    const currentValue = profileData?.titpj?.[option.row] as string || ''

    return (
      <TableRow key={option.row}>
        <TableCell className="font-medium border-r border-gray-300 break-words py-4 pr-4 align-top">{option.label}</TableCell>
        <TableCell className="px-2 py-4 min-w-0">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm min-w-0"
            value={currentValue}
            onChange={(e) => handleTIPIJChange(option.row, e.target.value)}
            required
          >
            <option value="" disabled>{t('scale-options.select')}</option>
            {scaleOptions.map(scale => (
              <option key={scale.value} value={scale.value}>
                {scale.label}
              </option>
            ))}
          </select>
        </TableCell>
      </TableRow>
    )
  })


  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="space-y-4 flex flex-col items-center">
        <div className="w-full max-w-4xl overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="border-r border-gray-300 h-12 py-3 text-left">{t('table-headers.statement')}</TableHead>
                <TableHead className="text-center h-12 py-3 min-w-[200px]">{t('table-headers.rating')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows}
            </TableBody>
          </Table>
        </div>
        <CardDescription className="block md:hidden">{t('description')}</CardDescription>
      </div>
    </form>
  )
}
