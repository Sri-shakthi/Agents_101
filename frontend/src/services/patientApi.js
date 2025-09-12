import { http } from './http.js'

// Mock patient data
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
    },
    premium: {
      current: 1416,
      multiplier: 1.18,
      base: 1200
    },
    confidence: 44,
    keyFacts: {
      smoker: 'Unknown',
      diabetes: 'No',
      hypertension: 'Yes',
      family: 'Father: Heart Disease'
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
    },
    premium: {
      current: 1200,
      multiplier: 1.0,
      base: 1200
    },
    confidence: 78,
    keyFacts: {
      smoker: 'No',
      diabetes: 'Yes',
      hypertension: 'No',
      family: 'Mother: Diabetes'
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
    },
    premium: {
      current: 1800,
      multiplier: 1.5,
      base: 1200
    },
    confidence: 92,
    keyFacts: {
      smoker: 'Yes',
      diabetes: 'Yes',
      hypertension: 'Yes',
      family: 'Both parents: Heart Disease'
    }
  }
]

export const patientApi = {
  // Search patients
  async searchPatients(query = '') {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.policy.toLowerCase().includes(query.toLowerCase()) ||
        patient.id.toLowerCase().includes(query.toLowerCase())
      )
      
      return {
        success: true,
        data: filtered
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search patients'
      }
    }
  },

  // Get patient by ID
  async getPatientById(id) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const patient = mockPatients.find(p => p.id === id)
      
      if (!patient) {
        return {
          success: false,
          error: 'Patient not found'
        }
      }
      
      return {
        success: true,
        data: patient
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch patient data'
      }
    }
  },

  // Get all patients
  async getAllPatients() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      return {
        success: true,
        data: mockPatients
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch patients'
      }
    }
  }
}
