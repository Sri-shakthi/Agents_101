// For network testing, replace with your host computer's IP
const API_BASE_URL = 'http://10.30.2.193:8080';
// const API_BASE_URL = 'http://localhost:5000';

export const meetingApi = {
  // Create a new meeting
  createMeeting: async (hostName, hostId = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostName,
          hostId
        }),
        mode: 'cors'
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      return { success: false, error: 'Failed to create meeting' };
    }
  },

  // Join an existing meeting
  joinMeeting: async (meetingId, participantName, participantId = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/join-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId,
          participantName,
          participantId
        }),
        mode: 'cors'
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error joining meeting:', error);
      return { success: false, error: 'Failed to join meeting' };
    }
  },

  // Stop/End a meeting
  stopMeeting: async (meetingId, hostId = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stop-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId,
          hostId
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error stopping meeting:', error);
      return { success: false, error: 'Failed to stop meeting' };
    }
  },

  // Get meeting details
  getMeeting: async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting/${meetingId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting meeting:', error);
      return { success: false, error: 'Failed to get meeting details' };
    }
  },

  // List all active meetings
  getActiveMeetings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting active meetings:', error);
      return { success: false, error: 'Failed to get active meetings' };
    }
  }
};
