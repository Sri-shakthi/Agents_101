import { useState } from 'react'
import './MeetingInvite.scss'

function MeetingInvite({ meetingId, patientInfo, onClose, onJoinMeeting }) {
  const [copied, setCopied] = useState(false)
  
  const meetingUrl = `${window.location.origin}/patient/meeting/${meetingId}`
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const sendSMS = () => {
    const message = `You have a video consultation scheduled. Join here: ${meetingUrl}`
    const smsUrl = `sms:${patientInfo?.phone || ''}?body=${encodeURIComponent(message)}`
    window.open(smsUrl)
  }

  const sendEmail = () => {
    const subject = 'Video Consultation Invitation'
    const body = `Dear ${patientInfo?.name || 'Patient'},

You have a video consultation scheduled with your doctor.

Meeting Details:
- Meeting ID: ${meetingId}
- Patient: ${patientInfo?.name || 'N/A'}
- Policy: ${patientInfo?.policy || 'N/A'}

To join the consultation, click the link below:
${meetingUrl}

Please ensure you have:
- A stable internet connection
- A quiet, well-lit space
- Your medical records ready
- Camera and microphone working

If you have any issues joining, please contact us immediately.

Best regards,
Your Healthcare Team`
    
    const emailUrl = `mailto:${patientInfo?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(emailUrl)
  }

  return (
    <div className="meeting-invite-overlay">
      <div className="meeting-invite-modal">
        <div className="invite-header">
          <h2>Send Meeting Invitation</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="invite-content">
          <div className="patient-info">
            <h3>Patient Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{patientInfo?.name || 'N/A'}</span>
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

          <div className="meeting-link">
            <h3>Meeting Link</h3>
            <div className="link-container">
              <input 
                type="text" 
                value={meetingUrl} 
                readOnly 
                className="link-input"
              />
              <button 
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={copyToClipboard}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
            <p className="link-hint">
              Share this link with the patient to join the video consultation.
            </p>
          </div>

          <div className="invite-actions">
            <h3>Send Invitation</h3>
            <div className="action-buttons">
              <button 
                className="action-btn sms-btn"
                onClick={sendSMS}
                disabled={!patientInfo?.phone}
              >
                📱 Send SMS
              </button>
              <button 
                className="action-btn email-btn"
                onClick={sendEmail}
                disabled={!patientInfo?.email}
              >
                📧 Send Email
              </button>
              <button 
                className="action-btn whatsapp-btn"
                onClick={() => window.open(`https://wa.me/${patientInfo?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Join your video consultation: ${meetingUrl}`)}`)}
                disabled={!patientInfo?.phone}
              >
                💬 WhatsApp
              </button>
            </div>
          </div>

          <div className="doctor-actions">
            <h3>Ready to Start?</h3>
            <p>Once you've sent the invitation to the patient, you can join the meeting.</p>
            <div className="doctor-buttons">
              <button 
                className="join-meeting-btn"
                onClick={onJoinMeeting}
              >
                🎥 Join Meeting Now
              </button>
              <button 
                className="close-btn-secondary"
                onClick={onClose}
              >
                Cancel Meeting
              </button>
            </div>
          </div>

          <div className="meeting-instructions">
            <h3>Instructions for Patient</h3>
            <ul>
              <li>Click the meeting link to join the video consultation</li>
              <li>Allow camera and microphone access when prompted</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Find a quiet, well-lit space for the consultation</li>
              <li>Have your medical records and current medications ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetingInvite
