import { getToken } from './authService';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const createMovie = async (movieData) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_URL}/movie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create movie');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};