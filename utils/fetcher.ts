export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API Response:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        error: 'Failed to parse error response',
      }));

      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('Fetch error details:', error);
    throw new Error(error.message || 'An error occurred while fetching');
  }
};
