export interface ProfileData {
  uuid: string;
  name?: string;
  age: number;
  gender: string;
  experience: ExperienceData;
  fas: string;
  mus: string;
  titpj: Record<string, unknown>;
}

export interface ExperienceData {
  art: DetailData;
  fashion: DetailData;
  photo: DetailData;
}

export interface DetailData {
  learn: number;
  job: boolean;
  photoVideo: number;
}
