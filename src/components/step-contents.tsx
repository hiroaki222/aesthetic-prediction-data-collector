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
  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="grid gap-4" >
        <div className="grid gap-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            min={1}
            placeholder="Enter your age"
            value={profileData?.age || ''}
            onChange={(e) => updateProfileData('age', parseInt(e.target.value, 10) || 0)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            name="gender"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.gender || ''}
            onChange={(e) => updateProfileData('gender', e.target.value)}
            required
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="education">Education Experience</Label>
          <select
            id="education"
            name="education"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.edu || ''}
            onChange={(e) => updateProfileData('edu', e.target.value)}
            required
          >
            <option value="" disabled>Select education</option>
            <option value="junior_high">Junior High School</option>
            <option value="high_school">High School</option>
            <option value="vocational">Vocational School</option>
            <option value="junior_college">Junior College</option>
            <option value="university">University (4-year)</option>
            <option value="graduate">Graduate School</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </form>
  )
}

export function ExperienceSetupContent({ handleStepComplete, updateProfileData, profileData }: ProfileSetupContentProps) {
  return (
    <form onSubmit={handleStepComplete} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="artisticExperience">Artistic Experience</Label>
          <select
            id="artisticExperience"
            name="artisticExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.art || ''}
            onChange={(e) => updateProfileData('art', e.target.value)}
            required
          >
            <option value="" disabled>Select level</option>
            <option value="none">None</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="photographicExperience">Photographic Experience</Label>
          <select
            id="photographicExperience"
            name="photographicExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.pho || ''}
            onChange={(e) => updateProfileData('pho', e.target.value)}
            required
          >
            <option value="" disabled>Select level</option>
            <option value="none">None</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fashionExperience">Fashion Experience</Label>
          <select
            id="fashionExperience"
            name="fashionExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.fas || ''}
            onChange={(e) => updateProfileData('fas', e.target.value)}
            required
          >
            <option value="" disabled>Select level</option>
            <option value="none">None</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="musicalExperience">Musical Experience</Label>
          <select
            id="musicalExperience"
            name="musicalExperience"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={profileData?.mus || ''}
            onChange={(e) => updateProfileData('mus', e.target.value)}
            required
          >
            <option value="" disabled>Select level</option>
            <option value="none">None</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>
      </div>
    </form>
  )
}

export function TIPIJSetupContent1({ handleStepComplete, updateProfileData, profileData }: ProfileSetupContentProps) {
  const options = [
    {
      row: '1', label: 'Extraverted, enthusiastic'
    },
    { row: '2', label: 'Critical, quarrelsome' },
    { row: '3', label: 'Dependable, self-disciplined' },
    { row: '4', label: 'Anxious, easily upset' },
    { row: '5', label: 'Open to new experiences, complex' },
    { row: '6', label: 'Reserved, quiet' },
    { row: '7', label: 'Sympathetic, warm' },
    { row: '8', label: 'Disorganized, careless' },
    { row: '9', label: 'Calm, emotionally stable' },
    { row: '10', label: 'Conventional, uncreative' },
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
              <TableHead className="w-[100px] border-r border-gray-300">I see myself as someone who...</TableHead>
              <TableHead>Strongly agree</TableHead>
              <TableHead>Moderately agree</TableHead>
              <TableHead>Slightly agree</TableHead>
              <TableHead>Neither agree nor disagree</TableHead>
              <TableHead>Slightly disagree</TableHead>
              <TableHead>Moderately disagree</TableHead>
              <TableHead>Strongly disagree</TableHead>
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
