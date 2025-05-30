
export interface Note {
  id: string;
  title: string;
  customer?: string;
  vector: Uint8Array;
  description: string;
  createdAt: string;
  updatedAt?: string; 
  score?: number;
}

export interface SearchFilter {
  query?: string;
  // sort?: string;
}
