import { useState, useRef, useEffect, useCallback } from 'react'
import './PatientVideoMeeting.scss'

function PatientVideoMeeting({ meetingId, patientInfo, onLeaveMeeting }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [meetingTime, setMeetingTime] = useState(0)
  const [isWaiting, setIsWaiting] = useState(true)
  const [doctorName, setDoctorName] = useState('Dr. Smith')
  
  // Debug logging
  console.log('PatientVideoMeeting render:', { 
    meetingId, 
    patientInfo, 
    isConnected, 
    isWaiting, 
    isVideoOn, 
    isMuted 
  })
  
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const meetingTimerRef = useRef(null)
  const localStreamRef = useRef(null)

  // Initialize video and audio
  useEffect(() => {
    initializeMedia()
    return () => {
      cleanup()
    }
  }, [])

  // Initialize meeting timer
  useEffect(() => {
    if (isConnected && !isWaiting) {
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
  }, [isConnected, isWaiting])

  const initializeMedia = async () => {
    try {
      console.log('Requesting camera and microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      })
      
      console.log('Media stream obtained:', stream)
      console.log('Video tracks:', stream.getVideoTracks())
      console.log('Audio tracks:', stream.getAudioTracks())
      
      localStreamRef.current = stream
      
      // Wait for video element to be ready
      const setupVideo = () => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          console.log('Local video element updated with stream')
          
          // Add event listeners to debug video
          localVideoRef.current.onloadedmetadata = () => {
            console.log('Local video metadata loaded')
            localVideoRef.current.play().catch(e => console.log('Play failed:', e))
          }
          
          localVideoRef.current.oncanplay = () => {
            console.log('Local video can play')
          }
          
          localVideoRef.current.onerror = (e) => {
            console.error('Local video error:', e)
          }
        } else {
          console.log('Local video ref is null, retrying...')
          setTimeout(setupVideo, 100)
        }
      }
      
      setupVideo()
      
      // Simulate connection to doctor
      console.log('Simulating doctor connection in 2 seconds...')
      setTimeout(() => {
        console.log('Setting connected state to true')
        setIsConnected(true)
        setIsWaiting(false)
        
        if (remoteVideoRef.current) {
          // Simulate doctor's video stream
          const doctorStream = stream.clone()
          remoteVideoRef.current.srcObject = doctorStream
          console.log('Remote video element updated with stream')
          
          remoteVideoRef.current.onloadedmetadata = () => {
            console.log('Remote video metadata loaded')
            remoteVideoRef.current.play().catch(e => console.log('Remote play failed:', e))
          }
        } else {
          console.log('Remote video ref is null')
        }
      }, 2000)
      
    } catch (error) {
      console.error('Error accessing media devices:', error)
      console.error('Error details:', error.name, error.message)
      
      // Show more specific error message
      let errorMessage = 'Camera or microphone access denied. '
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access and refresh the page.'
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found. Please connect a camera and refresh the page.'
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application. Please close other apps and refresh.'
      } else {
        errorMessage += `Error: ${error.message}. Please refresh the page.`
      }
      
      alert(errorMessage)
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
    if (meetingTimerRef.current) {
      clearInterval(meetingTimerRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleLeaveMeeting = () => {
    cleanup()
    onLeaveMeeting()
  }

  return (
    <div className="patient-video-meeting">
      {/* Debug Info */}
      <div style={{background: 'orange', color: 'white', padding: '10px', margin: '10px'}}>
        DEBUG: PatientVideoMeeting - isWaiting: {isWaiting.toString()}, isConnected: {isConnected.toString()}, isVideoOn: {isVideoOn.toString()}
      </div>
      
      <div className="patient-meeting__header">
        <div className="meeting-info">
          <h3>Consultation with {doctorName}</h3>
          <div className="meeting-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'connecting'}`}></span>
            {isWaiting ? 'Waiting for doctor...' : isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </div>
        <div className="meeting-timer">
          {formatTime(meetingTime)}
        </div>
      </div>

      <div className="patient-meeting__content">
        {isWaiting ? (
          <div className="waiting-room">
            <div className="waiting-content">
              <div className="waiting-icon">👨‍⚕️</div>
              <h2>Waiting for Doctor</h2>
              <p>Your doctor will join the meeting shortly. Please ensure your camera and microphone are working properly.</p>
              <div className="patient-info">
                <h4>Your Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Name:</span>
                    <span className="value">{patientInfo?.name || 'Patient'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Age:</span>
                    <span className="value">{patientInfo?.age || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Policy:</span>
                    <span className="value">{patientInfo?.policy || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="video-grid">
            <div className="video-container doctor-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted={false}
                className="video-element"
                style={{background: 'black', minHeight: '200px'}}
              />
              <div className="video-label">Dr. {doctorName}</div>
            </div>
            
            <div className="video-container patient-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted={true}
                className="video-element"
                style={{background: 'black', minHeight: '200px'}}
              />
              {!localStreamRef.current && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '14px'
                }}>
                  <div>📹</div>
                  <div>Camera not available</div>
                  <div style={{fontSize: '12px', marginTop: '5px'}}>
                    Check permissions or try the test button
                  </div>
                </div>
              )}
              <div className="video-label">You</div>
            </div>
          </div>
        )}

        <div className="meeting-controls">
          {/* Debug Button */}
          <button
            className="control-btn"
            onClick={() => {
              console.log('Manual connection test')
              setIsConnected(true)
              setIsWaiting(false)
            }}
            style={{background: 'purple', color: 'white'}}
            title="Test Connection"
          >
            🔧
          </button>
          
          {/* Camera Retry Button */}
          <button
            className="control-btn"
            onClick={() => {
              console.log('Retrying camera access...')
              initializeMedia()
            }}
            style={{background: 'blue', color: 'white'}}
            title="Retry Camera"
          >
            📷
          </button>
          
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
            className="control-btn end-call"
            onClick={handleLeaveMeeting}
            title="Leave meeting"
          >
            📞
          </button>
        </div>
      </div>

      <div className="meeting-instructions">
        <h4>Meeting Guidelines</h4>
        <ul>
          <li>Ensure you have a stable internet connection</li>
          <li>Find a quiet, well-lit space for the consultation</li>
          <li>Have your medical records and current medications ready</li>
          <li>Speak clearly and ask questions if you don't understand something</li>
        </ul>
      </div>
    </div>
  )
}

export default PatientVideoMeeting
