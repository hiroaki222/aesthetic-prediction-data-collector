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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type ProfileSetupContentProps = {
  handleStepComplete: React.FormEventHandler<HTMLFormElement>
  updateProfileData: (field: string, value: string | number | Record<string, unknown>) => void
  profileData: ProfileData | null
}

export function ProfileSetupContent({ handleStepComplete, updateProfileData, profileData }: ProfileSetupContentProps) {
  const t = useTranslations('step-contents.profile-setup')

  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="grid gap-4" >
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
            value={profileData?.gender || ''}
            onChange={(e) => updateProfileData('gender', e.target.value)}
            required
          >
            <option value="" disabled>{t('gender-options.select')}</option>
            <option value="male">{t('gender-options.male')}</option>
            <option value="female">{t('gender-options.female')}</option>
            <option value="other">{t('gender-options.other')}</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="education">{t('labels.education')}</Label>
          <select
            id="education"
            name="education"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.edu || ''}
            onChange={(e) => updateProfileData('edu', e.target.value)}
            required
          >
            <option value="" disabled>{t('education-options.select')}</option>
            <option value="junior_high">{t('education-options.junior-high')}</option>
            <option value="high_school">{t('education-options.high-school')}</option>
            <option value="vocational">{t('education-options.vocational')}</option>
            <option value="junior_college">{t('education-options.junior-college')}</option>
            <option value="university">{t('education-options.university')}</option>
            <option value="graduate">{t('education-options.graduate')}</option>
            <option value="other">{t('education-options.other')}</option>
          </select>
        </div>
      </div>
    </form>
  )
}

export function ExperienceSetupContent({ handleStepComplete, updateProfileData, profileData }: ProfileSetupContentProps) {
  const t = useTranslations('step-contents.experience-setup')

  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
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
        </div>
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

  const tableRows = options.map(option => {
    const currentValue = profileData?.titpj?.[option.row] as string || ''

    return (
      <TableRow key={option.row}>
        <TableCell className="font-medium border-r border-gray-300">{option.label}</TableCell>
        <TableCell colSpan={7}>
          <RadioGroup
            className="flex items-center justify-around"
            name={`row${option.row}`}
            value={currentValue}
            onValueChange={(value) => handleTIPIJChange(option.row, value)}
          >
            {[7, 6, 5, 4, 3, 2, 1].map(value => {
              return (
                <RadioGroupItem key={value} value={String(value)} id={`row${option.row}-${value}`} />
              )
            })}
          </RadioGroup>
        </TableCell>

      </TableRow>
    )
  })


  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] border-r border-gray-300">{t('table-headers.statement')}</TableHead>
              <TableHead>{t('table-headers.strongly-agree')}</TableHead>
              <TableHead>{t('table-headers.moderately-agree')}</TableHead>
              <TableHead>{t('table-headers.slightly-agree')}</TableHead>
              <TableHead>{t('table-headers.neither')}</TableHead>
              <TableHead>{t('table-headers.slightly-disagree')}</TableHead>
              <TableHead>{t('table-headers.moderately-disagree')}</TableHead>
              <TableHead>{t('table-headers.strongly-disagree')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </div>
    </form>
  )
}
