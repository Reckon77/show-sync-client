const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const fetchLocations = async () => {
    const authData = JSON.parse(localStorage.getItem('authData') || '{}');
  const jwtToken = authData.jwtToken;

  if (!jwtToken) {
    throw new Error('No authentication token found');
  }
    try {
      const response = await fetch(`${API_URL}/location/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });
      if (!response.ok) {
        throw new Error('Failed to fetch locations')
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(`Error fetching locations: ${error.message}`)
    }
  }