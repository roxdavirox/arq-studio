export interface ApiResponse<T> {
  readonly data: T
  readonly meta?: Record<string, unknown>
}

export interface ApiError {
  readonly code: string
  readonly message: string
  readonly details?: Record<string, unknown>
}

export interface PaginatedResponse<T> {
  readonly items: T[]
  readonly total: number
  readonly page: number
  readonly pageSize: number
}

// Consultation scheduling
export interface ScheduleConsultationRequest {
  readonly projectId: string
  readonly scheduledAt: string // ISO date
}

export interface CreateProjectRequest {
  readonly name: string
  readonly description: string
  readonly clientId: string
}
