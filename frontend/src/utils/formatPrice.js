export const formatPrice = (price) => {
  if (!price) return '$0';
  if (price >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }
  return `$${price}`;
};
export default formatPrice;
