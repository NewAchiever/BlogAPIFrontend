

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>; // For validation errors
}

export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: boolean | null;
    status: number;
    isSessionActive: boolean | null;
}