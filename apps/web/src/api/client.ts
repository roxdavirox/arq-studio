import type { Project, Consultation, Client, ProjectFile } from '@arq/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const fetchMe = (): Promise<Client> => get('/api/me')

export const fetchProjects = (): Promise<Project[]> => get('/api/projects')

export const fetchProject = (id: string): Promise<Project> => get(`/api/projects/${id}`)

export const fetchProjectConsultations = (projectId: string): Promise<Consultation[]> =>
  get(`/api/projects/${projectId}/consultations`)

export const fetchProjectFiles = (projectId: string): Promise<ProjectFile[]> =>
  get(`/api/projects/${projectId}/files`)

export const fetchUpcomingConsultations = (): Promise<Consultation[]> =>
  get('/api/consultations?status=scheduled,active')

export const fetchConsultation = (id: string): Promise<Consultation> =>
  get(`/api/consultations/${id}`)
