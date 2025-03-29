export interface BaseModel {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Repository<T extends BaseModel> {
  findAll(filter?: Partial<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
} 