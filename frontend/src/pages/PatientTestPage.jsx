import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PatientTestPage.scss'

function PatientTestPage() {
  const navigate = useNavigate()
  const [meetingId, setMeetingId] = useState('test-meeting-123')

  const handleJoinMeeting = () => {
    if (meetingId.trim()) {
      navigate(`/patient/meeting/${meetingId.trim()}`)
    }
  }

  const testMeetingIds = [
    'test-meeting-123',
    'meeting_1757755697104_iwof2cy2b',
    'meeting_1757755741684_wi5kup1pr'
  ]

  return (
    <div className="patient-test-page">
      <div className="test-container">
        <h1>🧪 Patient Meeting Test Page</h1>
        <p>Use this page to test the patient meeting window</p>
        
        <div className="test-section">
          <h3>Quick Test Links</h3>
          <div className="test-buttons">
            {testMeetingIds.map((id) => (
              <button
                key={id}
                className="test-btn"
                onClick={() => navigate(`/patient/meeting/${id}`)}
              >
                Join Meeting: {id}
              </button>
            ))}
          </div>
        </div>

        <div className="test-section">
          <h3>Custom Meeting ID</h3>
          <div className="input-group">
            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter meeting ID"
              className="meeting-input"
            />
            <button 
              className="join-btn"
              onClick={handleJoinMeeting}
            >
              Join Meeting
            </button>
          </div>
        </div>

        <div className="test-section">
          <h3>Instructions</h3>
          <ol>
            <li>Click any of the quick test links above</li>
            <li>Or enter a custom meeting ID and click "Join Meeting"</li>
            <li>You should see the patient meeting window</li>
            <li>Check browser console for debug messages</li>
          </ol>
        </div>

        <div className="test-section">
          <h3>Debug Information</h3>
          <div className="debug-info">
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Frontend URL:</strong> {window.location.origin}</p>
            <p><strong>Patient Route:</strong> /patient/meeting/[MEETING_ID]</p>
          </div>
        </div>

        <div className="test-section">
          <h3>Common Meeting IDs</h3>
          <div className="meeting-ids">
            {testMeetingIds.map((id) => (
              <div key={id} className="meeting-id-item">
                <code>{id}</code>
                <button 
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/patient/meeting/${id}`)}
                >
                  Copy Link
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientTestPage
