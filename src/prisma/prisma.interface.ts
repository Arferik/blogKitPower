export interface DBOption {
  type?: 'mysql' | 'postgresql';
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
  inject?: string[];
}

export type OrderBy = {
  modified_at?: never;
  created_at?: never;
};

export type PaginationParam = {
  current?: number;
  page_size?: number;
  created_at?: string;
  modified_at?: string;
};
