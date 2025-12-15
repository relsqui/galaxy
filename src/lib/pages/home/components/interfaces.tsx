// TODO: https://supabase.com/docs/reference/javascript/typescript-support

export interface Person {
  id: number;
  created_at: Date;
  location: number;
  display_name: string;
  description: string;
}

export interface Room {
  id: number;
  title: string;
  description: string;
  owner: number;
}

export interface Exit {
  id: number;
  title: string;
  description: string;
  origin: number;
  destination: number;
}
