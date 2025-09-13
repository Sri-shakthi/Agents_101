import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore.js'
import VideoRTC from '../components/VideoRTC/index.jsx'
import './GuestPage.scss'

function GuestPage() {
  const [showMeeting, setShowMeeting] = useState(false)
  const navigate = useNavigate()
  const guestId = useAppStore((s) => s.guestId)

  const handleStartMeeting = () => {
    setShowMeeting(true)
  }

  const handleEndMeeting = () => {
    setShowMeeting(false)
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
        <VideoRTC />
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
            <h2>Start Video Meeting</h2>
            <p>Join a video conference session as a guest participant</p>
            <button className="btn btn--primary btn--large" onClick={handleStartMeeting}>
              Start Meeting
            </button>
          </div>
          
          <div className="guest-info">
            <h3>Meeting Instructions</h3>
            <ul>
              <li>Click "Start Meeting" to join the video conference</li>
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