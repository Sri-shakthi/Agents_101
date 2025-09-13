import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore.js'
import VideoPanel from '../components/VideoPanel/index.jsx'
import PrivateSuggestions from '../components/PrivateSuggestions/index.jsx'
import PatientSearch from '../components/PatientSearch/index.jsx'
import { patientApi } from '../services/patientApi.js'
import { meetingApi } from '../services/meetingApi.js'
import './DoctorLoginPage.scss'
import VideoRTC from '../components/VideoRTC/index.jsx'

function DoctorDashboardPage() {
  const user = useAppStore((s) => s.user)
  const [meeting, setMeetingState] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [meetingData, setMeetingData] = useState(null)
  const [meetingLink, setMeetingLink] = useState('')
  const logout = useAppStore((s) => s.logout)
  const setMeeting = useAppStore((s) => s.setMeeting)
  const setMeetingToken = useAppStore((s) => s.setMeetingToken)
  const setMeetingRoomName = useAppStore((s) => s.setMeetingRoomName)
  const clearMeeting = useAppStore((s) => s.clearMeeting)

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setLoading(true)
    const result = await patientApi.getAllPatients()
    if (result.success) {
      setPatients(result.data)
      // Select first patient by default
      if (result.data.length > 0) {
        setSelectedPatient(result.data[0])
      }
    }
    setLoading(false)
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
  }

  const handleStartMeeting = async () => {
    try {
      setLoading(true)
      
      // Create meeting
      const meetingResult = await meetingApi.createMeeting(
        `Dr. ${user?.name || 'Doctor'}`,
        user?.id
      )

      if (meetingResult.success) {
        const { meeting } = meetingResult
        
        // Join the meeting as host
        const joinResult = await meetingApi.joinMeeting(
          meeting.meetingId,
          `Dr. ${user?.name || 'Doctor'}`,
          user?.id
        )

        if (joinResult.success) {
          const meetingData = {
            roomName: joinResult.roomName,
            token: joinResult.token,
            participantId: joinResult.participantId,
            meetingId: meeting.meetingId
          }

          setMeetingData(meetingData)
          setMeetingLink(meeting.meetingLink)
          setMeeting(meeting)
          setMeetingToken(joinResult.token)
          setMeetingRoomName(joinResult.roomName)
          setMeetingState(true)
        } else {
          console.error('Failed to join meeting:', joinResult.error)
          alert('Failed to join meeting. Please try again.')
        }
      } else {
        console.error('Failed to create meeting:', meetingResult.error)
        alert('Failed to create meeting. Please try again.')
      }
    } catch (error) {
      console.error('Error starting meeting:', error)
      alert('Error starting meeting. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEndMeeting = async () => {
    try {
      if (meetingData?.meetingId) {
        await meetingApi.stopMeeting(meetingData.meetingId, user?.id)
      }
    } catch (error) {
      console.error('Error stopping meeting:', error)
    } finally {
      setMeetingState(false)
      setMeetingData(null)
      setMeetingLink('')
      clearMeeting()
    }
  }

  const handleMeetingEnd = () => {
    setMeetingState(false)
    setMeetingData(null)
    setMeetingLink('')
    clearMeeting()
  }

  return (
    <section className={`dashboard-page${meeting ? ' meeting' : ''}`}>
      {!meeting && (
        <header className="dashboard-header">
          <div className="dh-left">
            <div className="greeting">
              <span className="greeting-text">Welcome back,</span>
              <span className="doctor-name">Dr. {user?.name || 'Shirin'}</span>
            </div>
          </div>
          <div className="dh-right">
            {/* <button className="ps-btn ps-btn--secondary" onClick={logout}>Logout</button> */}
          </div>
        </header>
      )}

      {!meeting ? (
        <div className="dashboard-grid">
          <div className="dashboard-col dashboard-col--right">
            <PatientSearch 
              onPatientSelect={handlePatientSelect}
              selectedPatientId={selectedPatient?.id}
            />
          </div>
          <div className="dashboard-col dashboard-col--left">
            {selectedPatient ? (
              <VideoPanel 
                showVideo={true} 
                showVideoBox={false} 
                showDetails={true} 
                onStartMeeting={handleStartMeeting} 
                showStartButton={true}
                patient={selectedPatient}
                loading={loading}
              />
            ) : (
              <div className="no-patient">
                <p>Select a patient to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="meeting-stage">
          <div className="meeting-card">
            <div className="meeting-topbar meeting-topbar--light">
              <div className="mt-info">
                <h3>Meeting in Progress</h3>
                {meetingLink && (
                  <div className="meeting-link">
                    <label>Meeting Link:</label>
                    <input 
                      type="text" 
                      value={meetingLink} 
                      readOnly 
                      onClick={(e) => e.target.select()}
                      className="meeting-link-input"
                    />
                    <button 
                      onClick={() => navigator.clipboard.writeText(meetingLink)}
                      className="copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-actions">
                <button className="ps-btn ps-btn--secondary" onClick={handleEndMeeting}>
                  End Meeting
                </button>
                <button className="ps-btn" onClick={handleMeetingEnd}>
                  Close Meeting Window
                </button>
              </div>
            </div>
            <div className="meeting-content meeting-content--light">
              <div className="meeting-video">
                <VideoRTC 
                  meetingData={meetingData} 
                  onMeetingEnd={handleMeetingEnd}
                />
              </div>
              <div className="meeting-docked">
                <PrivateSuggestions showLive={true} showProjection={false} showHeader={true} showList={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default DoctorDashboardPage


