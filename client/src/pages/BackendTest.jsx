import React, { useState } from 'react';
import API from '../lib/apiBase';

function BackendTest() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testBackend = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      console.log('Testing backend at:', API);
      const response = await fetch(`${API}/`);
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Backend is working! Response: ${JSON.stringify(data)}`);
      } else {
        setTestResult(`❌ Backend error: ${response.status} - ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const testBookingEndpoint = async () => {
    setIsLoading(true);
    setTestResult('Testing booking endpoint...');
    
    try {
      const testPayload = {
        name: 'Test User',
        email: 'test@example.com',
        selectedServices: ['test service'],
        selectedSubServices: ['test:100'],
        staff: 'Test Staff',
        date: '2025-01-01',
        address: 'Test Address',
        totalPrice: 100
      };
      
      console.log('Testing booking endpoint with payload:', testPayload);
      const response = await fetch(`${API}/appoinment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      
      const responseText = await response.text();
      console.log('Booking test response:', response.status, responseText);
      
      if (response.ok) {
        setTestResult(`✅ Booking endpoint is working! Status: ${response.status}`);
      } else {
        setTestResult(`❌ Booking endpoint error: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      setTestResult(`❌ Booking test error: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Backend Connection Test</h1>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current API URL: <code className="bg-gray-100 px-2 py-1 rounded">{API}</code></p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testBackend}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Backend Health'}
          </button>
          
          <button
            onClick={testBookingEndpoint}
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Booking Endpoint'}
          </button>
        </div>
        
        {testResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default BackendTest;
