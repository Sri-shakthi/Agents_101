import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore.js'
import { meetingApi } from '../services/meetingApi.js'
import VideoRTC from '../components/VideoRTC/index.jsx'
import './GuestPage.scss'

function GuestPage() {
  const [showMeeting, setShowMeeting] = useState(false)
  const [meetingId, setMeetingId] = useState('')
  const [meetingData, setMeetingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const guestId = useAppStore((s) => s.guestId)
  const setMeeting = useAppStore((s) => s.setMeeting)
  const setMeetingToken = useAppStore((s) => s.setMeetingToken)
  const setMeetingRoomName = useAppStore((s) => s.setMeetingRoomName)
  const clearMeeting = useAppStore((s) => s.clearMeeting)

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) {
      setError('Please enter a meeting ID')
      return
    }

    try {
      setLoading(true)
      setError('')

      const result = await meetingApi.joinMeeting(
        meetingId.trim(),
        `Guest-${guestId}`,
        guestId
      )

      if (result.success) {
        const meetingData = {
          roomName: result.roomName,
          token: result.token,
          participantId: result.participantId,
          meetingId: result.meeting.meetingId
        }

        setMeetingData(meetingData)
        setMeeting(result.meeting)
        setMeetingToken(result.token)
        setMeetingRoomName(result.roomName)
        setShowMeeting(true)
      } else {
        setError(result.message || 'Failed to join meeting')
      }
    } catch (error) {
      console.error('Error joining meeting:', error)
      setError('Error joining meeting. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEndMeeting = () => {
    setShowMeeting(false)
    setMeetingData(null)
    setMeetingId('')
    clearMeeting()
  }

  const handleMeetingEnd = () => {
    setShowMeeting(false)
    setMeetingData(null)
    setMeetingId('')
    clearMeeting()
  }

  const handleLogout = () => {
    useAppStore.getState().logout()
    navigate('/doctor/login')
  }

  if (showMeeting) {
    return (
      <div className="guest-meeting-container">
        <div className="meeting-header">
          <div className="meeting-info">
            <h2>Guest Meeting</h2>
            <p>Guest ID: {guestId}</p>
          </div>
          <div className="meeting-actions">
            <button className="btn btn--secondary" onClick={handleEndMeeting}>
              End Meeting
            </button>
            <button className="btn btn--secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <VideoRTC 
          meetingData={meetingData} 
          onMeetingEnd={handleMeetingEnd}
        />
      </div>
    )
  }

  return (
    <div className="guest-page">
      <div className="guest-container">
        <div className="guest-header">
          <h1>Welcome, Guest</h1>
          <p>Guest ID: {guestId}</p>
        </div>
        
        <div className="guest-content">
          <div className="guest-card">
            <div className="guest-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 10L11 14L9 12M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Join Video Meeting</h2>
            <p>Enter the meeting ID provided by your doctor to join the video conference</p>
            
            <div className="meeting-input-group">
              <input
                type="text"
                placeholder="Enter Meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="meeting-id-input"
                disabled={loading}
              />
              <button 
                className="btn btn--primary btn--large" 
                onClick={handleJoinMeeting}
                disabled={loading || !meetingId.trim()}
              >
                {loading ? 'Joining...' : 'Join Meeting'}
              </button>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
          
          <div className="guest-info">
            <h3>Meeting Instructions</h3>
            <ul>
              <li>Enter the meeting ID provided by your doctor</li>
              <li>Click "Join Meeting" to enter the video conference</li>
              <li>Allow camera and microphone access when prompted</li>
              <li>Your guest ID will be visible to other participants</li>
              <li>Click "End Meeting" when you're finished</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestPage