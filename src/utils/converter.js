export const formatCurrency = (amount, currencyCode) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const convertCurrency = (amount, rate) => {
  return amount * rate;
};
