import './VideoPanel.scss'

function VideoPanel({ showDetails = true, onStartMeeting, showVideo = true, showVideoBox = true, showStartButton = true, patient = null }) {
  if (!showVideo) return null
  
  const displayPatient = patient || {
    name: 'Rahul K',
    age: 42,
    gender: 'Male',
    policy: 'P-10021',
    premium: { current: 1416, multiplier: 1.18 },
    confidence: 44,
    keyFacts: {
      smoker: 'Unknown',
      diabetes: 'No',
      hypertension: 'Yes',
      family: 'Father: Heart Disease'
    }
  }
  
  return (
    <div className="video-panel">
      <div className="video-panel__header">
        <div>
          <div className="video-title">Patient</div>
          <div className="video-subtitle">{displayPatient.name} • {displayPatient.age} • {displayPatient.gender} • {displayPatient.policy}</div>
        </div>
        {showStartButton && onStartMeeting && (
          <button className="start-btn" onClick={onStartMeeting}>Start Meeting</button>
        )}
      </div>
      {showVideoBox && <div className="video-box">Video preview (mock)</div>}
      {showDetails && (
        <>
          <div className="facts">
            <div className="fact">
              <div className="fact-label">Current Premium</div>
              <div className="fact-value">₹{displayPatient.premium?.current || 1416}</div>
              <div className="fact-hint">Multiplier {displayPatient.premium?.multiplier || 1.18}x</div>
            </div>
            <div className="fact">
              <div className="fact-label">Confidence</div>
              <div className="fact-value">{displayPatient.confidence || 44}%</div>
              <div className="fact-hint">Model calibration</div>
            </div>
          </div>
          <div className="key-facts">
            <div className="key-facts__title">Key Facts</div>
            <ul>
              <li>Smoker: <strong>{displayPatient.keyFacts?.smoker || 'Unknown'}</strong></li>
              <li>Diabetes: <strong>{displayPatient.keyFacts?.diabetes || 'No'}</strong></li>
              <li>Hypertension: <strong>{displayPatient.keyFacts?.hypertension || 'Yes'}</strong></li>
              <li>Family: <strong>{displayPatient.keyFacts?.family || 'Father: Heart Disease'}</strong></li>
            </ul>
          </div>
          <div className="potential-premium">
            <div className="potential-premium__title">Potential Premium</div>
            <div className="potential-premium__subtitle">Based on current assessment</div>
            <div className="premium-card">
              <div className="premium-row">
                <span className="premium-label">Base Premium</span>
                <span className="premium-value">₹1,200</span>
              </div>
              <div className="premium-row">
                <span className="premium-label">Risk Multiplier</span>
                <span className="premium-value">1.18x</span>
              </div>
              <div className="premium-divider"></div>
              <div className="premium-row premium-row--total">
                <span className="premium-label">Suggested Premium</span>
                <span className="premium-value premium-value--total">₹1,416</span>
              </div>
              <div className="premium-actions">
                <button className="premium-btn premium-btn--primary">Accept Premium</button>
                <button className="premium-btn premium-btn--secondary">Manual Review</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoPanel


