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

export interface Message {
  id: number;
  created_at: Date;
  location: number;
  owner: number;
  type: string;
  content: any;
}

export interface Exit {
  id: number;
  title: string;
  description: string;
  origin: number;
  destination: number;
}

// what you need to supply to make one
export type ExitRequirements = Pick<Exit, "title" | "origin" | "destination">
export type MessageRequirements = Pick<Message, "type" | "content">
export type AtLeastID<T> = { id: number } & Partial<T>
