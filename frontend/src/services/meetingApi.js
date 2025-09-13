import { http } from './http.js'
import { aiService } from './aiService.js'

export const meetingApi = {
  // Start a new meeting
  async startMeeting(patientId, doctorId, patientInfo) {
    try {
      const response = await http.post('/api/meetings', {
        patientId,
        doctorId,
        patientInfo
      })
      
      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to start meeting'
      }
    }
  },

  // End a meeting
  async endMeeting(meetingId) {
    try {
      const response = await http.put(`/api/meetings/${meetingId}/end`)
      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to end meeting'
      }
    }
  },

  // Get meeting details
  async getMeeting(meetingId) {
    try {
      const response = await http.get(`/api/meetings/${meetingId}`)
      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch meeting details'
      }
    }
  },

  // Save recording
  async saveRecording(meetingId, audioBlob, transcript, patientInfo) {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('meetingId', meetingId)
      formData.append('transcript', transcript)
      formData.append('patientInfo', JSON.stringify(patientInfo))

      const response = await http.post('/api/recordings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to save recording'
      }
    }
  },

  // Generate follow-up questions using AI
  async generateFollowUpQuestions(transcript, patientInfo, meetingDuration) {
    try {
      // First try the AI service
      const aiResponse = await aiService.generateFollowUpQuestions(transcript, patientInfo, meetingDuration)
      
      if (aiResponse.success) {
        return aiResponse
      }

      // Fallback to backend API
      const response = await http.post('/api/ai/generate-questions', {
        transcript,
        patientInfo,
        meetingDuration
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate follow-up questions'
      }
    }
  },

  // Process recording with AI
  async processRecording(recordingId, transcript, patientInfo) {
    try {
      const response = await http.post('/api/ai/process-recording', {
        recordingId,
        transcript,
        patientInfo
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process recording'
      }
    }
  },

  // Accept a suggestion
  async acceptSuggestion(suggestionId, title, confidence, category) {
    try {
      const response = await http.post('/api/suggestions', {
        id: suggestionId,
        title,
        confidence,
        category
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to accept suggestion'
      }
    }
  },

  // Dismiss a suggestion
  async dismissSuggestion(suggestionId) {
    try {
      const response = await http.post('/api/suggestions/dismiss', {
        id: suggestionId
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to dismiss suggestion'
      }
    }
  },

  // Generate meeting report
  async generateReport(suggestions, meetingId, patientId) {
    try {
      const response = await http.post('/api/reports', {
        suggestions,
        meetingId,
        patientId
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate report'
      }
    }
  }
}