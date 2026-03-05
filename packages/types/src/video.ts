export interface VideoRoom {
  readonly id: string
  readonly url: string
  readonly token: string
  readonly expiresAt: Date
}

export interface VideoParticipant {
  readonly userId: string
  readonly name: string
  readonly role: 'architect' | 'client'
  readonly isMuted: boolean
  readonly isCameraOff: boolean
  readonly isScreenSharing: boolean
}

export type VideoRoomEvent =
  | { type: 'participant-joined'; participant: VideoParticipant }
  | { type: 'participant-left'; participantId: string }
  | { type: 'recording-started' }
  | { type: 'recording-stopped' }
  | { type: 'screen-share-started'; participantId: string }
  | { type: 'screen-share-stopped'; participantId: string }

export interface VideoRoomState {
  readonly participants: VideoParticipant[]
  readonly isRecording: boolean
  readonly duration: number // seconds
}
