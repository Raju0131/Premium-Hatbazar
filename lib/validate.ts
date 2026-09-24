/** Loose email check (something@domain.tld), shared by checkout and submitOrder. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
