import { useState, useEffect } from 'react'
import './PatientSearch.scss'

const mockPatients = [
  {
    id: 'P-10021',
    name: 'Rahul K',
    age: 42,
    gender: 'Male',
    policy: 'P-10021',
    conditions: {
      diabetes: false,
      hypertension: true,
      smoker: 'unknown'
    }
  },
  {
    id: 'P-10045',
    name: 'Anita M',
    age: 35,
    gender: 'Female',
    policy: 'P-10045',
    conditions: {
      diabetes: true,
      hypertension: false,
      smoker: false
    }
  },
  {
    id: 'P-10067',
    name: 'Rajesh S',
    age: 58,
    gender: 'Male',
    policy: 'P-10067',
    conditions: {
      diabetes: true,
      hypertension: true,
      smoker: true
    }
  }
]

function PatientSearch({ onPatientSelect, selectedPatientId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [patients, setPatients] = useState(mockPatients)
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.policy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

  const getConditionIcon = (condition, value) => {
    if (condition === 'smoker') {
      if (value === 'unknown') return '?'
      return value ? '🚭' : '✓'
    }
    return value ? '✓' : '✗'
  }

  const getConditionColor = (condition, value) => {
    if (condition === 'smoker') {
      return value === 'unknown' ? '#6b7280' : value ? '#ef4444' : '#10b981'
    }
    return value ? '#10b981' : '#ef4444'
  }

  return (
    <div className="patient-search">
      <div className="search-header">
        <h3>Patient Search</h3>
        <div className="search-bar">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search patients by name, policy, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="patient-list">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className={`patient-card ${selectedPatientId === patient.id ? 'selected' : ''}`}
            onClick={() => onPatientSelect(patient)}
          >
            <div className="patient-header">
              <div className="patient-name">
                <strong>{patient.name}</strong>
                <span className="patient-demo">({patient.age}, {patient.gender})</span>
              </div>
              <div className="patient-policy">Policy: {patient.policy}</div>
            </div>

            <div className="patient-conditions">
              <div className="condition">
                <span className="condition-icon" style={{ color: getConditionColor('diabetes', patient.conditions.diabetes) }}>
                  {getConditionIcon('diabetes', patient.conditions.diabetes)}
                </span>
                <span className="condition-label">Diabetes:</span>
                <span className="condition-value">{patient.conditions.diabetes ? 'Yes' : 'No'}</span>
              </div>
              <div className="condition">
                <span className="condition-icon" style={{ color: getConditionColor('hypertension', patient.conditions.hypertension) }}>
                  {getConditionIcon('hypertension', patient.conditions.hypertension)}
                </span>
                <span className="condition-label">Hypertension:</span>
                <span className="condition-value">{patient.conditions.hypertension ? 'Yes' : 'No'}</span>
              </div>
              <div className="condition">
                <span className="condition-icon" style={{ color: getConditionColor('smoker', patient.conditions.smoker) }}>
                  {getConditionIcon('smoker', patient.conditions.smoker)}
                </span>
                <span className="condition-label">Smoker:</span>
                <span className="condition-value">
                  {patient.conditions.smoker === 'unknown' ? 'Unknown' : patient.conditions.smoker ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <button className="review-btn">
              Review Patient →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatientSearch
