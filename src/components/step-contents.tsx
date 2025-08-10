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
import { Checkbox } from "@/components/ui/checkbox"

type ProfileSetupContentProps = {
  handleStepComplete: React.FormEventHandler<HTMLFormElement>
  updateProfileData: (updates: Partial<ProfileData> | Record<string, unknown>) => void
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
                updateProfileData({ name: normalizedValue });
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
            type="text"
            min={1}
            placeholder={t('placeholders.age')}
            value={profileData?.age || ''}
            onChange={(e) => {
              const convertedValue = e.target.value.normalize('NFKC');
              updateProfileData({ age: parseInt(convertedValue, 10) || 0 });
            }}
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
              updateProfileData({ gender: val });
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
                updateProfileData({ gender: val });
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
              updateProfileData({ edu: val });
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
                updateProfileData({ edu: val });
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
  const [isLearned, setIsLearned] = useState<Record<string, boolean>>({})
  const [isJob, setIsJob] = useState<Record<string, boolean>>({})

  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <a className="text-xl">{t('description')}</a>
      <div className="grid gap-10 mt-5">
        {profileData?.experience && Object.keys(profileData.experience).map((key) => (
          <div key={key}>
            <div className="grid gap-2">
              <a className="font-semibold">{t(`title.${key}`)}</a>
              <div>
                <div className="flex items-center mb-2">
                  <Checkbox
                    id={`learned-checkbox-${key}`}
                    checked={!!isLearned[key]}
                    onCheckedChange={(checked) => {
                      setIsLearned(prev => ({ ...prev, [key]: !!checked }))
                      if (checked) {
                        updateProfileData({ [`experience.${key}.learn`]: { learnedAt: '', year: 0 } });
                      } else {
                        updateProfileData({ [`experience.${key}.learn`]: -1 });
                      }
                    }}
                    className="mr-2 w-6 h-6 border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`learned-checkbox-${key}`}>{t(`labels.learned-at.first`) + t(`labels.learned-at.${key}`) + t(`labels.learned-at.last`)}</Label>
                </div>
                {isLearned[key] && (
                  <div className="md:w-1/3">
                    <a className="text-sm">{t(`labels.learned-at.description`)}</a>
                    <div className="flex items-end gap-2">
                      <Input
                        id={`learned-at-${key}`}
                        name={`learned-at-${key}`}
                        value={profileData.experience[key as keyof typeof profileData.experience]?.learn?.learnedAt || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateProfileData({ [`experience.${key}.learn.learnedAt`]: val });
                        }}
                        placeholder={t(`labels.learned-at.placeholder`)}
                      />
                      <a>{t(`labels.learned-at.conjunction`)}</a>
                      <Input
                        id={`learned-year-${key}`}
                        name={`learned-year-${key}`}
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        className=" w-25"
                        placeholder="2"
                        value={profileData.experience[key as keyof typeof profileData.experience]?.learn?.year || ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                          updateProfileData({ [`experience.${key}.learn.year`]: val });
                        }}
                      />
                      <a>{t(`labels.learned-at.year`)}</a>
                    </div>
                  </div>
                )}
              </div>
              <div className="my-5">
                <div className="flex items-center mb-2">
                  <Checkbox
                    id={`job-checkbox-${key}`}
                    checked={!!isJob[key]}
                    onCheckedChange={(checked) => {
                      setIsJob(prev => ({ ...prev, [key]: !!checked }))
                      if (checked) {
                        updateProfileData({ [`experience.${key}.job`]: true });
                      } else {
                        updateProfileData({ [`experience.${key}.job`]: false });
                      }
                    }}
                    className="mr-2 w-6 h-6 border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`job-${key}`}>{t(`labels.job-experience.${key}`) + t(`labels.job-experience.last`)}</Label>
                </div>
              </div>
              <div>
                <Label className='mb-2' htmlFor={`interest-${key}`}>{t(`labels.interest.${key}`) + t(`labels.interest.last`)}</Label>
                <select
                  id={`interest-${key}`}
                  name={`interest-${key}`}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profileData.experience[key as keyof typeof profileData.experience]?.interest || ''}
                  onChange={(e) => updateProfileData({ [`experience.${key}.interest`]: Number(e.target.value) })}
                  required
                >
                  <option value="-1" disabled>{t('interest-options.select')}</option>
                  {[1, 2, 3, 4, 5, 6, 7].map(v => (
                    <option key={v} value={String(v)}>{t(`interest-options.${v}`)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
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
    updateProfileData({ titpj: updatedTitpj })
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
    <form onSubmit={handleStepComplete} className="space-y-6 flex-col items-center justify-center">
      <div className="flex flex-col font-bold">
        <a>{t("instruction1")}</a>
        <a>{t("instruction2")}</a>
      </div>
      <div className="space-y-4 flex flex-col items-center">
        <div className="w-full max-w-4xl overflow-hidden">
          <CardDescription className="block md:hidden text-center">{t('description')}</CardDescription>
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
      </div>
    </form>
  )
}
