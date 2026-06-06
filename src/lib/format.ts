export function formatPrice(price: number): string {
  if (price >= 10_000_000) {
    const crore = price / 10_000_000;
    return `৳ ${crore.toFixed(2).replace(/\.?0+$/, "")} Cr`;
  }
  if (price >= 100_000) {
    const lac = price / 100_000;
    return `৳ ${lac.toFixed(2).replace(/\.?0+$/, "")} Lac`;
  }
  return `৳ ${price.toLocaleString()}`;
}
