import { useState, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore.js'
import VideoPanel from '../components/VideoPanel/index.jsx'
import PrivateSuggestions from '../components/PrivateSuggestions/index.jsx'
import PatientSearch from '../components/PatientSearch/index.jsx'
import { patientApi } from '../services/patientApi.js'
import './DoctorLoginPage.scss'
import VideoRTC from '../components/VideoRTC/index.jsx'

function DoctorDashboardPage() {
  const user = useAppStore((s) => s.user)
  const [meeting, setMeeting] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
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
                onStartMeeting={() => setMeeting(true)} 
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
          <div className="meeting-card">
            <div className="meeting-topbar meeting-topbar--light">
              <div className="mt-actions">
                <button className="ps-btn" onClick={() => setMeeting(false)}>Close Meeting Window</button>
              </div>
            </div>
            <div className="meeting-content meeting-content--light">
              <div className="meeting-video">
                {/* <VideoPanel 
                  showDetails={!meeting} 
                  showVideo={true} 
                  showVideoBox={true} 
                  showStartButton={false}
                  patient={selectedPatient}
                /> */}
                <VideoRTC />
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


