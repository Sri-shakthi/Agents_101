import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore.js'
import VideoPanel from '../components/VideoPanel/index.jsx'
import VideoMeeting from '../components/VideoMeeting/index.jsx'
import PrivateSuggestions from '../components/PrivateSuggestions/index.jsx'
import PatientSearch from '../components/PatientSearch/index.jsx'
import MeetingInvite from '../components/MeetingInvite/index.jsx'
import { patientApi } from '../services/patientApi.js'
import { meetingApi } from '../services/meetingApi.js'
import './DoctorLoginPage.scss'

function DoctorDashboardPage() {
  const user = useAppStore((s) => s.user)
  const [meeting, setMeeting] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [meetingId, setMeetingId] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const logout = useAppStore((s) => s.logout)

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
    if (!selectedPatient) {
      console.log('No patient selected')
      return
    }
    
    console.log('Starting meeting for patient:', selectedPatient)
    
    try {
      const response = await meetingApi.startMeeting(
        selectedPatient.id,
        user?.id || 'doctor_1',
        selectedPatient
      )
      
      console.log('Meeting API response:', response)
      
      if (response.success) {
        setMeetingId(response.data.meetingId)
        setShowInvite(true) // Show invitation modal first
        console.log('Meeting created, showing invite modal')
      } else {
        console.error('Meeting creation failed:', response.error)
      }
    } catch (error) {
      console.error('Failed to start meeting:', error)
    }
  }

  const handleJoinMeeting = () => {
    console.log('Joining meeting, closing invite modal')
    setShowInvite(false)
    setMeeting(true)
    console.log('Meeting state set to true')
  }

  const handleEndMeeting = async () => {
    if (meetingId) {
      try {
        await meetingApi.endMeeting(meetingId)
      } catch (error) {
        console.error('Failed to end meeting:', error)
      }
    }
    
    setMeeting(false)
    setMeetingId(null)
    setTranscript('')
    setIsRecording(false)
  }

  const handleRecordingStart = () => {
    setIsRecording(true)
  }

  const handleRecordingStop = async (audioBlob, finalTranscript) => {
    setIsRecording(false)
    setTranscript(finalTranscript)
    
    if (meetingId && audioBlob) {
      try {
        await meetingApi.saveRecording(meetingId, audioBlob, finalTranscript, selectedPatient)
      } catch (error) {
        console.error('Failed to save recording:', error)
      }
    }
  }

  // Debug logging
  console.log('Render state:', { meeting, showInvite, selectedPatient, meetingId })

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
            <button 
              className="ps-btn ps-btn--secondary" 
              onClick={() => {
                console.log('TEST: Forcing meeting to true');
                setMeeting(true);
                setMeetingId('test-meeting-123');
              }}
              style={{background: 'orange', color: 'white'}}
            >
              TEST: Show Meeting
            </button>
            <button 
              className="ps-btn ps-btn--secondary" 
              onClick={() => {
                const patientUrl = `${window.location.origin}/patient/meeting/test-meeting-123`;
                console.log('Patient meeting URL:', patientUrl);
                window.open(patientUrl, '_blank');
              }}
              style={{background: 'green', color: 'white', marginLeft: '10px'}}
            >
              TEST: Open Patient Window
            </button>
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
          <div style={{background: 'red', color: 'white', padding: '10px', margin: '10px'}}>
            DEBUG: Meeting window is rendering! Meeting ID: {meetingId}
          </div>
          <div className="meeting-card">
            <div className="meeting-topbar meeting-topbar--light">
              <div className="mt-actions">
                <button className="ps-btn" onClick={handleEndMeeting}>Close Meeting Window</button>
              </div>
            </div>
            <div className="meeting-content meeting-content--light">
              <div className="meeting-video">
                <VideoMeeting 
                  patient={selectedPatient}
                  onEndMeeting={handleEndMeeting}
                  onRecordingStart={handleRecordingStart}
                  onRecordingStop={handleRecordingStop}
                />
              </div>
              <div className="meeting-docked">
                <PrivateSuggestions 
                  showLive={true} 
                  showProjection={false} 
                  showHeader={true} 
                  showList={true}
                  transcript={transcript}
                  patientInfo={selectedPatient}
                  meetingId={meetingId}
                  isAIMode={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showInvite && (
        <div>
          <div style={{background: 'blue', color: 'white', padding: '10px', margin: '10px', position: 'fixed', top: 0, left: 0, zIndex: 9999}}>
            DEBUG: Invitation modal is showing! Meeting ID: {meetingId}
          </div>
          <MeetingInvite
            meetingId={meetingId}
            patientInfo={selectedPatient}
            onClose={() => setShowInvite(false)}
            onJoinMeeting={handleJoinMeeting}
          />
        </div>
      )}
    </section>
  )
}

export default DoctorDashboardPage


