export interface ProfileData {
  uuid: string;
  name?: string;
  age: number;
  gender: string;
  edu: string;
  art: string;
  pho: string;
  fas: string;
  mus: string;
  titpj: Record<string, unknown>;
}
