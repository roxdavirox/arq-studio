export type ProjectId = string & { readonly __brand: 'ProjectId' }
export type ClientId = string & { readonly __brand: 'ClientId' }
export type ConsultationId = string & { readonly __brand: 'ConsultationId' }
export type ArchitectId = string & { readonly __brand: 'ArchitectId' }
export type FileId = string & { readonly __brand: 'FileId' }

export type ProjectStatus = 'briefing' | 'design' | 'approval' | 'execution' | 'delivered'

export interface Project {
  readonly id: ProjectId
  readonly name: string
  readonly description: string
  readonly status: ProjectStatus
  readonly clientId: ClientId
  readonly architectId: ArchitectId
  readonly createdAt: Date
  readonly updatedAt: Date
}

export interface Client {
  readonly id: ClientId
  readonly name: string
  readonly email: string
  readonly phone: string | null
  readonly createdAt: Date
}

export interface Architect {
  readonly id: ArchitectId
  readonly name: string
  readonly email: string
  readonly avatarUrl: string | null
  readonly bio: string | null
}

export type ConsultationStatus = 'scheduled' | 'active' | 'ended' | 'cancelled'

export interface Consultation {
  readonly id: ConsultationId
  readonly projectId: ProjectId
  readonly architectId: ArchitectId
  readonly clientId: ClientId
  readonly scheduledAt: Date
  readonly startedAt: Date | null
  readonly endedAt: Date | null
  readonly status: ConsultationStatus
  readonly roomUrl: string | null
  readonly notes: string | null
}

export interface ProjectFile {
  readonly id: FileId
  readonly projectId: ProjectId
  readonly name: string
  readonly url: string
  readonly mimeType: string
  readonly sizeBytes: number
  readonly uploadedAt: Date
}
