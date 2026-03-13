// Base API URL for ExchangeRate-API
const API_URL = 'https://open.er-api.com/v6/latest';

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const response = await fetch(`${API_URL}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return null;
  }
};

// Check if rates in cache are still valid (within 24 hours)
export const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return (Date.now() - timestamp) < ONE_DAY;
};
