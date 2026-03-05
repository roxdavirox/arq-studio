// Dependency Injection container — wires domain use cases to infrastructure adapters
import { makeGetProject, makeCreateProject, makeListClientProjects, makeUpdateProjectStatus } from '@arq/domain'
import { makeScheduleConsultation, makeStartConsultation, makeEndConsultation, makeGetConsultation } from '@arq/domain'
import { makeGetClient, makeRegisterClient } from '@arq/domain'
import { makeJoinConsultation, makeGetVideoToken } from '@arq/domain'

import { DynamoProjectRepository } from './infra/dynamo-project.repository'
import { DynamoConsultationRepository } from './infra/dynamo-consultation.repository'
import { DynamoClientRepository } from './infra/dynamo-client.repository'
import { DailyVideoProvider } from './infra/daily-video.provider'
import { S3StorageProvider } from './infra/s3-storage.provider'
import { SesNotificationProvider } from './infra/ses-notification.provider'
import { DynamoFileRepository } from './infra/dynamo-file.repository'

// Infrastructure instances
export const projectRepo = new DynamoProjectRepository()
export const consultationRepo = new DynamoConsultationRepository()
export const clientRepo = new DynamoClientRepository()
export const videoProvider = new DailyVideoProvider()
export const storage = new S3StorageProvider()
const notifications = new SesNotificationProvider()
const fileRepo = new DynamoFileRepository()

// Use cases
export const getProject = makeGetProject({ projectRepo })
export const createProject = makeCreateProject({ projectRepo, clientRepo })
export const listClientProjects = makeListClientProjects({ projectRepo })
export const updateProjectStatus = makeUpdateProjectStatus({ projectRepo })

export const scheduleConsultation = makeScheduleConsultation({ consultationRepo, projectRepo, notifications })
export const startConsultation = makeStartConsultation({ consultationRepo, videoProvider })
export const endConsultation = makeEndConsultation({ consultationRepo, videoProvider })
export const getConsultation = makeGetConsultation({ consultationRepo })

export const getClient = makeGetClient({ clientRepo })
export const registerClient = makeRegisterClient({ clientRepo })

export const joinConsultation = makeJoinConsultation({ consultationRepo, videoProvider })
export const getVideoToken = makeGetVideoToken({ consultationRepo, videoProvider })

export const listProjectFiles = (projectId: string) => fileRepo.findByProject(projectId as any)

export const container = {
  projectRepo,
  consultationRepo,
  storage,
  getProject,
  createProject,
  listClientProjects,
  updateProjectStatus,
  scheduleConsultation,
  startConsultation,
  endConsultation,
  getConsultation,
  getClient,
  registerClient,
  joinConsultation,
  getVideoToken,
  listProjectFiles,
}
