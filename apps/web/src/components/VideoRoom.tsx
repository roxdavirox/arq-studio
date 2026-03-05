// VideoRoom — Daily.co realtime video component
// Mobile-first: full-screen video with floating controls
import { useEffect, useRef, useState, useCallback } from 'react'
import DailyIframe from '@daily-co/daily-js'
import type { DailyCall } from '@daily-co/daily-js'
import { colors, transitions } from '@arq/ui'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from 'lucide-react'

interface VideoRoomProps {
  roomUrl: string
  clientId: string
  clientName: string
}

export const VideoRoom = ({ roomUrl, clientId, clientName }: VideoRoomProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const callRef = useRef<DailyCall | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [participantCount, setParticipantCount] = useState(1)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const call = DailyIframe.createFrame(containerRef.current, {
      showLeaveButton: false,
      showFullscreenButton: false,
      iframeStyle: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        border: 'none',
      },
    })

    callRef.current = call

    call.on('joined-meeting', () => setIsJoined(true))
    call.on('left-meeting', () => setIsJoined(false))
    call.on('participant-joined', () => setParticipantCount(c => c + 1))
    call.on('participant-left', () => setParticipantCount(c => Math.max(1, c - 1)))

    call.join({ url: roomUrl, userName: clientName })

    return () => {
      call.leave()
      call.destroy()
    }
  }, [roomUrl, clientName])

  const toggleMute = useCallback(() => {
    callRef.current?.setLocalAudio(isMuted)
    setIsMuted(m => !m)
  }, [isMuted])

  const toggleCamera = useCallback(() => {
    callRef.current?.setLocalVideo(isCameraOff)
    setIsCameraOff(c => !c)
  }, [isCameraOff])

  const leaveCall = useCallback(() => {
    callRef.current?.leave()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        background: colors.stone[950],
        overflow: 'hidden',
      }}
    >
      {/* Daily.co iframe container */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Participant count */}
      {isJoined && (
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'oklch(0% 0 0 / 0.6)',
            color: 'white',
            borderRadius: '9999px',
            padding: '0.375rem 0.75rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <Users size={14} />
          {participantCount}
        </div>
      )}

      {/* Controls bar — fixed at bottom, above safe area */}
      <div
        role="toolbar"
        aria-label="Controles da chamada"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1.25rem',
          background: 'linear-gradient(to top, oklch(0% 0 0 / 0.7) 0%, transparent 100%)',
        }}
      >
        <ControlButton
          onClick={toggleMute}
          active={!isMuted}
          danger={isMuted}
          label={isMuted ? 'Ativar microfone' : 'Silenciar microfone'}
          icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        />
        <ControlButton
          onClick={toggleCamera}
          active={!isCameraOff}
          danger={isCameraOff}
          label={isCameraOff ? 'Ligar câmera' : 'Desligar câmera'}
          icon={isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
        />
        <ControlButton
          onClick={leaveCall}
          active={false}
          danger
          label="Encerrar chamada"
          icon={<PhoneOff size={22} />}
          size="lg"
        />
      </div>
    </div>
  )
}

interface ControlButtonProps {
  onClick: () => void
  active: boolean
  danger?: boolean
  label: string
  icon: React.ReactNode
  size?: 'base' | 'lg'
}

const ControlButton = ({ onClick, active, danger, label, icon, size = 'base' }: ControlButtonProps) => {
  const dim = size === 'lg' ? 64 : 52

  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        border: 'none',
        background: danger
          ? 'oklch(55% 0.20 25)'
          : active
          ? 'oklch(100% 0 0 / 0.15)'
          : 'oklch(100% 0 0 / 0.08)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: `all ${transitions.fast}`,
        WebkitTapHighlightColor: 'transparent',
        backdropFilter: 'blur(8px)',
      }}
    >
      {icon}
    </button>
  )
}
