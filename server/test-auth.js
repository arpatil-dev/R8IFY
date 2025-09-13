// Test script for R8IFY Authentication API
// Run with: node test-auth.js

const API_BASE = 'http://localhost:5000/api/auth';

// Test data
const testUsers = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "securePassword123",
    address: "123 Main Street, City, Country",
    role: "USER"
  },
  {
    name: "Alice Admin",
    email: "alice.admin@example.com", 
    password: "adminPassword456",
    address: "456 Admin Avenue, HQ City, USA",
    role: "ADMIN"
  },
  {
    name: "Bob Manager",
    email: "bob.manager@example.com",
    password: "managerPass789",
    address: "789 Manager Blvd, Corp City, USA", 
    role: "MANAGER"
  }
];

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Test registration
async function testRegister(user) {
  console.log(`\n🔵 Testing Registration for: ${user.email}`);
  
  const result = await makeRequest(`${API_BASE}/register`, {
    method: 'POST',
    body: JSON.stringify(user)
  });
  
  if (result.status === 201) {
    console.log('✅ Registration successful');
    console.log(`Token: ${result.data.data.token.substring(0, 50)}...`);
    return result.data.data.token;
  } else if (result.status === 409) {
    console.log('⚠️ User already exists');
    return null;
  } else {
    console.log('❌ Registration failed:', result.data.message);
    return null;
  }
}

// Test login
async function testLogin(email, password) {
  console.log(`\n🔵 Testing Login for: ${email}`);
  
  const result = await makeRequest(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (result.status === 200) {
    console.log('✅ Login successful');
    console.log(`Token: ${result.data.data.token.substring(0, 50)}...`);
    return result.data.data.token;
  } else {
    console.log('❌ Login failed:', result.data.message);
    return null;
  }
}

// Test logout
async function testLogout(token) {
  console.log('\n🔵 Testing Logout');
  
  const result = await makeRequest(`${API_BASE}/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (result.status === 200) {
    console.log('✅ Logout successful');
  } else {
    console.log('❌ Logout failed:', result.data?.message || 'Unknown error');
  }
}

// Test invalid scenarios
async function testInvalidScenarios() {
  console.log('\n🔴 Testing Invalid Scenarios');
  
  // Test missing fields
  console.log('\n➤ Testing missing required fields');
  const missingFields = await makeRequest(`${API_BASE}/register`, {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com' })
  });
  console.log(`Status: ${missingFields.status}, Message: ${missingFields.data.message}`);
  
  // Test invalid login
  console.log('\n➤ Testing invalid login credentials');
  const invalidLogin = await makeRequest(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ 
      email: 'nonexistent@example.com', 
      password: 'wrongpassword' 
    })
  });
  console.log(`Status: ${invalidLogin.status}, Message: ${invalidLogin.data.message}`);
  
  // Test wrong password for existing user
  console.log('\n➤ Testing wrong password for existing user');
  const wrongPassword = await makeRequest(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ 
      email: testUsers[0].email, 
      password: 'wrongpassword123' 
    })
  });
  console.log(`Status: ${wrongPassword.status}, Message: ${wrongPassword.data.message}`);
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting R8IFY Authentication API Tests');
  console.log('========================================');
  
  let tokens = [];
  
  // Test registration for all users
  for (const user of testUsers) {
    const token = await testRegister(user);
    if (token) tokens.push(token);
  }
  
  // Test login for all users
  for (const user of testUsers) {
    const token = await testLogin(user.email, user.password);
    if (token) tokens.push(token);
  }
  
  // Test logout with first available token
  if (tokens.length > 0) {
    await testLogout(tokens[0]);
  }
  
  // Test invalid scenarios
  await testInvalidScenarios();
  
  console.log('\n🏁 All tests completed!');
  console.log('\nTo use these tokens in your app:');
  console.log('Headers: { "Authorization": "Bearer YOUR_TOKEN_HERE" }');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or you can install node-fetch');
  console.log('Run: npm install node-fetch');
  console.log('Then add: import fetch from "node-fetch"; at the top');
} else {
  runTests().catch(console.error);
}

export { testRegister, testLogin, testLogout, testInvalidScenarios };