const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function login(userName, password) {
  console.log(userName, password, API_URL)
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  return response.json();
}

export async function register(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
}
export async function createTheatre(theatreData) {
  const authData = JSON.parse(localStorage.getItem('authData') || '{}');
  const jwtToken = authData.jwtToken;

  if (!jwtToken) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/theatre`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify(theatreData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create theatre');
  }

  return response.json();
}

// You can add more API calls here, like register, logout, etc.