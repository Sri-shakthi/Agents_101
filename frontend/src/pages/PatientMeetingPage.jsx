import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PatientVideoMeeting from '../components/PatientVideoMeeting/index.jsx'
import { meetingApi } from '../services/meetingApi.js'
import './PatientMeetingPage.scss'

function PatientMeetingPage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState(null)
  const [patientInfo, setPatientInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasJoined, setHasJoined] = useState(false)

  useEffect(() => {
    if (meetingId) {
      loadMeetingDetails()
    } else {
      setError('No meeting ID provided')
      setLoading(false)
    }
  }, [meetingId])

  const loadMeetingDetails = async () => {
    try {
      setLoading(true)
      console.log('Loading meeting details for ID:', meetingId)
      const response = await meetingApi.getMeeting(meetingId)
      
      console.log('Meeting API response:', response)
      
      if (response.success) {
        setMeeting(response.data)
        setPatientInfo(response.data.patientInfo)
        console.log('Meeting loaded successfully:', response.data)
      } else {
        console.error('Failed to load meeting:', response.error)
        console.log('Available meetings:', response.availableMeetings)
        
        // If it's a test meeting ID, create a fallback
        if (meetingId === 'test-meeting-123') {
          console.log('Using fallback test meeting data')
          setMeeting({
            id: 'test-meeting-123',
            patientId: 'test_patient',
            doctorId: 'test_doctor',
            status: 'active'
          })
          setPatientInfo({
            name: 'Test Patient',
            age: 30,
            gender: 'Male',
            policy: 'TEST-001'
          })
        } else {
          setError(response.error || 'Failed to load meeting details')
        }
      }
    } catch (error) {
      console.error('Error loading meeting:', error)
      setError('Failed to connect to meeting')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinMeeting = () => {
    setHasJoined(true)
  }

  const handleLeaveMeeting = () => {
    navigate('/')
  }

  // Debug logging
  console.log('PatientMeetingPage render state:', { 
    meetingId, 
    loading, 
    error, 
    hasJoined, 
    meeting, 
    patientInfo 
  })

  if (loading) {
    return (
      <div className="patient-meeting-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading meeting...</h2>
          <p>Please wait while we prepare your consultation.</p>
          <div style={{background: 'blue', color: 'white', padding: '10px', margin: '10px'}}>
            DEBUG: Loading meeting ID: {meetingId}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="patient-meeting-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to join meeting</h2>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button 
            className="home-btn"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!hasJoined) {
    return (
      <div className="patient-meeting-page">
        <div className="meeting-join-container">
          <div className="join-content">
            <div className="join-header">
              <h1>Join Your Consultation</h1>
              <p>You're about to join a video consultation with your doctor.</p>
            </div>
            
            <div className="meeting-details">
              <h3>Meeting Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Meeting ID:</span>
                  <span className="value">{meetingId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Patient:</span>
                  <span className="value">{patientInfo?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className="value status">{meeting?.status || 'Unknown'}</span>
                </div>
              </div>
            </div>

            <div className="prerequisites">
              <h3>Before You Join</h3>
              <ul>
                <li>✅ Ensure you have a stable internet connection</li>
                <li>✅ Find a quiet, well-lit space</li>
                <li>✅ Have your medical records ready</li>
                <li>✅ Test your camera and microphone</li>
              </ul>
            </div>

            <div className="join-actions">
              <button 
                className="join-btn"
                onClick={handleJoinMeeting}
              >
                Join Meeting
              </button>
              <button 
                className="cancel-btn"
                onClick={handleLeaveMeeting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="patient-meeting-page">
      <div style={{background: 'green', color: 'white', padding: '10px', margin: '10px'}}>
        DEBUG: Patient meeting window is rendering! Meeting ID: {meetingId}
      </div>
      <PatientVideoMeeting
        meetingId={meetingId}
        patientInfo={patientInfo}
        onLeaveMeeting={handleLeaveMeeting}
      />
    </div>
  )
}

export default PatientMeetingPage
