// Test script for registration status functionality
// Run this with: node test-registration-status.js

const API_BASE = 'http://localhost:3000';

async function testRegistrationStatus() {
  console.log('🧪 Testing Registration Status API...\n');

  try {
    // Test 1: Get current registration status
    console.log('1️⃣ Getting current registration status...');
    const statusResponse = await fetch(`${API_BASE}/api/registration-status`);
    const statusData = await statusResponse.json();
    console.log('✅ Status Response:', statusData);
    console.log('');

    // Test 2: Close registration
    console.log('2️⃣ Closing registration...');
    const closeResponse = await fetch(`${API_BASE}/api/registration-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isOpen: false,
        message: 'Registration is temporarily closed for maintenance. Please check back soon!'
      })
    });
    const closeData = await closeResponse.json();
    console.log('✅ Close Response:', closeData);
    console.log('');

    // Test 3: Get updated status
    console.log('3️⃣ Getting updated status...');
    const updatedStatusResponse = await fetch(`${API_BASE}/api/registration-status`);
    const updatedStatusData = await updatedStatusResponse.json();
    console.log('✅ Updated Status Response:', updatedStatusData);
    console.log('');

    // Test 4: Try to create a registration (should fail)
    console.log('4️⃣ Attempting to create registration (should fail)...');
    const registrationResponse = await fetch(`${API_BASE}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Test User',
        year: 'II',
        department: 'Computer Science',
        section: 'A',
        secId: 'TEST123',
        college: 'Test College',
        preferredCountry: 'India',
        phoneNumber: '1234567890',
        committee: 'UNEP'
      })
    });
    const registrationData = await registrationResponse.json();
    console.log('✅ Registration Response (should show closed):', registrationData);
    console.log('');

    // Test 5: Reopen registration
    console.log('5️⃣ Reopening registration...');
    const openResponse = await fetch(`${API_BASE}/api/registration-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isOpen: true
      })
    });
    const openData = await openResponse.json();
    console.log('✅ Open Response:', openData);
    console.log('');

    // Test 6: Final status check
    console.log('6️⃣ Final status check...');
    const finalStatusResponse = await fetch(`${API_BASE}/api/registration-status`);
    const finalStatusData = await finalStatusResponse.json();
    console.log('✅ Final Status Response:', finalStatusData);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRegistrationStatus();
