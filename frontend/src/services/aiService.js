import { http } from './http.js'

// Mock AI service for generating follow-up questions
// In a real implementation, this would call an AI API like OpenAI, Claude, or a custom ML model

const mockFollowUpQuestions = [
  {
    id: 'medication-details',
    question: 'Can you tell me more about your current medications and their dosages?',
    category: 'medications',
    priority: 'high',
    context: 'Patient mentioned taking medication but details are unclear',
    confidence: 0.92
  },
  {
    id: 'symptom-timeline',
    question: 'When did you first notice these symptoms? Can you describe the progression?',
    category: 'symptoms',
    priority: 'high',
    context: 'Symptoms mentioned but timeline unclear',
    confidence: 0.88
  },
  {
    id: 'family-history',
    question: 'Has anyone in your family had similar health issues?',
    category: 'family_history',
    priority: 'medium',
    context: 'Family history not fully explored',
    confidence: 0.75
  },
  {
    id: 'lifestyle-factors',
    question: 'How has your lifestyle changed recently? Any stress or dietary changes?',
    category: 'lifestyle',
    priority: 'medium',
    context: 'Lifestyle factors may be relevant',
    confidence: 0.70
  },
  {
    id: 'pain-assessment',
    question: 'On a scale of 1-10, how would you rate your pain level?',
    category: 'assessment',
    priority: 'high',
    context: 'Pain mentioned but severity not quantified',
    confidence: 0.85
  },
  {
    id: 'sleep-patterns',
    question: 'How has this condition affected your sleep patterns?',
    category: 'quality_of_life',
    priority: 'medium',
    context: 'Sleep impact not discussed',
    confidence: 0.65
  },
  {
    id: 'previous-treatments',
    question: 'Have you tried any treatments or remedies for this condition before?',
    category: 'treatment_history',
    priority: 'high',
    context: 'Previous treatments not mentioned',
    confidence: 0.80
  },
  {
    id: 'allergies',
    question: 'Do you have any known allergies to medications or substances?',
    category: 'allergies',
    priority: 'high',
    context: 'Allergy information not confirmed',
    confidence: 0.90
  }
]

export const aiService = {
  // Analyze conversation transcript and generate follow-up questions
  async generateFollowUpQuestions(transcript, patientInfo, meetingDuration) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real implementation, this would:
      // 1. Send transcript to AI service
      // 2. Analyze conversation content
      // 3. Identify gaps in information
      // 4. Generate contextual follow-up questions
      
      // Mock analysis based on transcript content
      const questions = this.analyzeTranscript(transcript, patientInfo)
      
      return {
        success: true,
        data: {
          questions,
          analysis: {
            topicsCovered: this.extractTopics(transcript),
            missingInformation: this.identifyGaps(transcript),
            suggestedFocus: this.suggestFocus(transcript, patientInfo)
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to generate follow-up questions'
      }
    }
  },

  // Analyze transcript content to determine relevant questions
  analyzeTranscript(transcript, patientInfo) {
    const lowerTranscript = transcript.toLowerCase()
    const relevantQuestions = []
    
    // Check for medication mentions
    if (this.containsKeywords(lowerTranscript, ['medication', 'medicine', 'drug', 'pill', 'tablet'])) {
      if (!this.containsKeywords(lowerTranscript, ['dosage', 'dose', 'mg', 'ml', 'times a day'])) {
        relevantQuestions.push(mockFollowUpQuestions[0]) // medication-details
      }
    }
    
    // Check for symptom mentions
    if (this.containsKeywords(lowerTranscript, ['pain', 'ache', 'hurt', 'symptom', 'problem'])) {
      if (!this.containsKeywords(lowerTranscript, ['when', 'started', 'began', 'first noticed'])) {
        relevantQuestions.push(mockFollowUpQuestions[1]) // symptom-timeline
      }
      if (!this.containsKeywords(lowerTranscript, ['scale', '1-10', 'rate', 'level'])) {
        relevantQuestions.push(mockFollowUpQuestions[4]) // pain-assessment
      }
    }
    
    // Check for family history
    if (!this.containsKeywords(lowerTranscript, ['family', 'mother', 'father', 'sibling', 'relative'])) {
      relevantQuestions.push(mockFollowUpQuestions[2]) // family-history
    }
    
    // Check for lifestyle factors
    if (this.containsKeywords(lowerTranscript, ['stress', 'work', 'diet', 'exercise', 'sleep'])) {
      if (!this.containsKeywords(lowerTranscript, ['recently', 'changed', 'different'])) {
        relevantQuestions.push(mockFollowUpQuestions[3]) // lifestyle-factors
      }
    }
    
    // Check for sleep patterns
    if (this.containsKeywords(lowerTranscript, ['tired', 'fatigue', 'energy']) && 
        !this.containsKeywords(lowerTranscript, ['sleep', 'insomnia', 'rest'])) {
      relevantQuestions.push(mockFollowUpQuestions[5]) // sleep-patterns
    }
    
    // Check for previous treatments
    if (this.containsKeywords(lowerTranscript, ['tried', 'treatment', 'remedy', 'doctor', 'hospital'])) {
      if (!this.containsKeywords(lowerTranscript, ['before', 'previously', 'earlier'])) {
        relevantQuestions.push(mockFollowUpQuestions[6]) // previous-treatments
      }
    }
    
    // Always check for allergies if not mentioned
    if (!this.containsKeywords(lowerTranscript, ['allergy', 'allergic', 'reaction'])) {
      relevantQuestions.push(mockFollowUpQuestions[7]) // allergies
    }
    
    // Sort by priority and confidence
    return relevantQuestions
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return b.confidence - a.confidence
      })
      .slice(0, 5) // Return top 5 questions
  },

  // Helper function to check for keywords
  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword))
  },

  // Extract topics covered in conversation
  extractTopics(transcript) {
    const topics = []
    const lowerTranscript = transcript.toLowerCase()
    
    if (this.containsKeywords(lowerTranscript, ['pain', 'ache', 'hurt'])) topics.push('Pain/Symptoms')
    if (this.containsKeywords(lowerTranscript, ['medication', 'medicine', 'drug'])) topics.push('Medications')
    if (this.containsKeywords(lowerTranscript, ['family', 'mother', 'father'])) topics.push('Family History')
    if (this.containsKeywords(lowerTranscript, ['sleep', 'tired', 'fatigue'])) topics.push('Sleep/Energy')
    if (this.containsKeywords(lowerTranscript, ['diet', 'food', 'eating'])) topics.push('Diet/Nutrition')
    if (this.containsKeywords(lowerTranscript, ['exercise', 'physical', 'activity'])) topics.push('Physical Activity')
    if (this.containsKeywords(lowerTranscript, ['stress', 'work', 'anxiety'])) topics.push('Stress/Mental Health')
    
    return topics
  },

  // Identify gaps in information
  identifyGaps(transcript) {
    const gaps = []
    const lowerTranscript = transcript.toLowerCase()
    
    if (!this.containsKeywords(lowerTranscript, ['allergy', 'allergic'])) {
      gaps.push('Allergy information')
    }
    if (!this.containsKeywords(lowerTranscript, ['dosage', 'dose', 'mg'])) {
      gaps.push('Medication dosages')
    }
    if (!this.containsKeywords(lowerTranscript, ['when', 'started', 'timeline'])) {
      gaps.push('Symptom timeline')
    }
    if (!this.containsKeywords(lowerTranscript, ['scale', '1-10', 'severity'])) {
      gaps.push('Symptom severity')
    }
    
    return gaps
  },

  // Suggest focus areas for the conversation
  suggestFocus(transcript, patientInfo) {
    const suggestions = []
    const lowerTranscript = transcript.toLowerCase()
    
    if (patientInfo?.conditions?.hypertension && !this.containsKeywords(lowerTranscript, ['blood pressure', 'hypertension'])) {
      suggestions.push('Blood pressure management')
    }
    
    if (patientInfo?.conditions?.diabetes && !this.containsKeywords(lowerTranscript, ['blood sugar', 'diabetes', 'glucose'])) {
      suggestions.push('Diabetes management')
    }
    
    if (patientInfo?.conditions?.smoker && !this.containsKeywords(lowerTranscript, ['smoking', 'cigarette', 'quit'])) {
      suggestions.push('Smoking cessation')
    }
    
    return suggestions
  },

  // Process recorded audio for analysis
  async processRecording(audioBlob, transcript) {
    try {
      // In a real implementation, this would:
      // 1. Upload audio to cloud storage
      // 2. Process with speech-to-text service
      // 3. Analyze with AI for medical insights
      // 4. Generate comprehensive follow-up questions
      
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('transcript', transcript)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return {
        success: true,
        data: {
          audioUrl: 'mock-audio-url',
          processedTranscript: transcript,
          insights: this.generateInsights(transcript)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process recording'
      }
    }
  },

  // Generate medical insights from conversation
  generateInsights(transcript) {
    return {
      keySymptoms: this.extractSymptoms(transcript),
      riskFactors: this.identifyRiskFactors(transcript),
      followUpNeeded: this.determineFollowUpNeeded(transcript),
      urgencyLevel: this.assessUrgency(transcript)
    }
  },

  extractSymptoms(transcript) {
    const symptoms = []
    const lowerTranscript = transcript.toLowerCase()
    
    if (this.containsKeywords(lowerTranscript, ['chest pain', 'chest ache'])) symptoms.push('Chest pain')
    if (this.containsKeywords(lowerTranscript, ['headache', 'head ache'])) symptoms.push('Headache')
    if (this.containsKeywords(lowerTranscript, ['fever', 'temperature'])) symptoms.push('Fever')
    if (this.containsKeywords(lowerTranscript, ['nausea', 'vomiting', 'sick'])) symptoms.push('Nausea/Vomiting')
    if (this.containsKeywords(lowerTranscript, ['dizziness', 'lightheaded'])) symptoms.push('Dizziness')
    
    return symptoms
  },

  identifyRiskFactors(transcript) {
    const risks = []
    const lowerTranscript = transcript.toLowerCase()
    
    if (this.containsKeywords(lowerTranscript, ['smoking', 'smoke', 'cigarette'])) risks.push('Smoking')
    if (this.containsKeywords(lowerTranscript, ['diabetes', 'diabetic', 'blood sugar'])) risks.push('Diabetes')
    if (this.containsKeywords(lowerTranscript, ['high blood pressure', 'hypertension'])) risks.push('Hypertension')
    if (this.containsKeywords(lowerTranscript, ['family history', 'genetic'])) risks.push('Family history')
    
    return risks
  },

  determineFollowUpNeeded(transcript) {
    const lowerTranscript = transcript.toLowerCase()
    
    if (this.containsKeywords(lowerTranscript, ['urgent', 'emergency', 'severe', 'critical'])) {
      return 'immediate'
    }
    if (this.containsKeywords(lowerTranscript, ['follow up', 'check back', 'monitor'])) {
      return 'scheduled'
    }
    return 'routine'
  },

  assessUrgency(transcript) {
    const lowerTranscript = transcript.toLowerCase()
    
    if (this.containsKeywords(lowerTranscript, ['emergency', 'urgent', 'immediate', 'severe pain'])) {
      return 'high'
    }
    if (this.containsKeywords(lowerTranscript, ['soon', 'quickly', 'asap'])) {
      return 'medium'
    }
    return 'low'
  }
}
