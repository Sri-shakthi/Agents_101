// Simple test script to verify backend is working
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint:', rootResponse.data);
    
    // Test meetings endpoint
    console.log('\n3. Testing meetings endpoint...');
    const meetingData = {
      patientId: 'test_patient_123',
      doctorId: 'test_doctor_456',
      patientInfo: {
        name: 'Test Patient',
        age: 30,
        policy: 'TEST-001'
      }
    };
    
    const meetingResponse = await axios.post(`${BASE_URL}/api/meetings`, meetingData);
    console.log('✅ Meeting created:', meetingResponse.data);
    
    // Test getting the meeting
    const meetingId = meetingResponse.data.data.meetingId;
    console.log('\n4. Testing get meeting...');
    const getMeetingResponse = await axios.get(`${BASE_URL}/api/meetings/${meetingId}`);
    console.log('✅ Meeting retrieved:', getMeetingResponse.data);
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend server is not running. Please start it with: npm start');
    }
  }
}

testBackend();
