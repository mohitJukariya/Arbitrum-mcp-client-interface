// Test script to check API endpoint
const API_URL = 'https://mcpclient-production.up.railway.app/api/chat';

async function testAPI() {
  try {
    console.log('Testing API endpoint:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, test message',
        userId: 'user-001'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the test
testAPI();

export {};
