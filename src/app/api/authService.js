const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function login(userName, password) {
    console.log(userName,password,API_URL)
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

// You can add more API calls here, like register, logout, etc.