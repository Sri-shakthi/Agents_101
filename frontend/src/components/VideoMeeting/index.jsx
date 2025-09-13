import { useState, useRef, useEffect, useCallback } from 'react'
import './VideoMeeting.scss'

function VideoMeeting({ patient, onEndMeeting, onRecordingStart, onRecordingStop }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [meetingTime, setMeetingTime] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recognitionRef = useRef(null)
  const meetingTimerRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)

  // Initialize meeting timer
  useEffect(() => {
    if (isRecording) {
      meetingTimerRef.current = setInterval(() => {
        setMeetingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (meetingTimerRef.current) {
        clearInterval(meetingTimerRef.current)
      }
    }

    return () => {
      if (meetingTimerRef.current) {
        clearInterval(meetingTimerRef.current)
      }
    }
  }, [isRecording])

  // Initialize video and audio
  useEffect(() => {
    initializeMedia()
    return () => {
      cleanup()
    }
  }, [])

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // Initialize speech recognition
      initializeSpeechRecognition()
      
      // Simulate connection (in real app, this would be WebRTC)
      setTimeout(() => {
        setIsConnected(true)
        if (remoteVideoRef.current) {
          // Simulate remote video stream
          remoteVideoRef.current.srcObject = stream.clone()
        }
      }, 1000)
      
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(prev => prev + finalTranscript + interimTranscript)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }
    }
  }

  const startRecording = async () => {
    if (!localStreamRef.current) return

    try {
      const mediaRecorder = new MediaRecorder(localStreamRef.current)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        onRecordingStop?.(audioBlob, transcript)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      onRecordingStart?.()
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
      
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (meetingTimerRef.current) {
      clearInterval(meetingTimerRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="video-meeting">
      <div className="video-meeting__header">
        <div className="meeting-info">
          <h3>Meeting with {patient?.name}</h3>
          <div className="meeting-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'connecting'}`}></span>
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </div>
        <div className="meeting-timer">
          {formatTime(meetingTime)}
        </div>
      </div>

      <div className="video-meeting__content">
        <div className="video-grid">
          <div className="video-container remote-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={false}
              className="video-element"
            />
            <div className="video-label">Patient</div>
          </div>
          
          <div className="video-container local-video">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted={true}
              className="video-element"
            />
            <div className="video-label">You</div>
          </div>
        </div>

        <div className="meeting-controls">
          <button
            className={`control-btn ${isMuted ? 'muted' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>
          
          <button
            className={`control-btn ${!isVideoOn ? 'video-off' : ''}`}
            onClick={toggleVideo}
            title={isVideoOn ? 'Turn off video' : 'Turn on video'}
          >
            {isVideoOn ? '📹' : '📷'}
          </button>
          
          <button
            className={`control-btn record-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? '⏹️' : '⏺️'}
          </button>
          
          <button
            className="control-btn end-call"
            onClick={() => {
              stopRecording()
              cleanup()
              onEndMeeting()
            }}
            title="End meeting"
          >
            📞
          </button>
        </div>
      </div>

      {transcript && (
        <div className="transcript-panel">
          <h4>Live Transcript</h4>
          <div className="transcript-content">
            {transcript}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoMeeting
