export interface PagedResponse<T> {
  totalCount: number;
  items: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
