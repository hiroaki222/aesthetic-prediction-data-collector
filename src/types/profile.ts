export interface ProfileData {
  uuid: string;
  name?: string;
  age: number;
  gender: string;
  edu: string;
  experience: ExperienceData;
  titpj: Record<string, unknown>;
}

export interface ExperienceData {
  art: DetailData;
  fashion: DetailData;
  photoVideo: DetailData;
}

export interface DetailData {
  learn: number;
  job: boolean | undefined;
  interest: number;
}
