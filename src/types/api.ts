export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success?: false;
  message?: string;
  error?: string;
  errors?: Array<{ field?: string; message?: string }> | Record<string, string[]>;
}
