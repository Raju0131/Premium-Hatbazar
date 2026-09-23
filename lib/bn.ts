/** Bengali number conversion and formatting */

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Replace ASCII digits with Bengali digits */
export function toBn(str: string | number): string {
  return String(str).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);
}

/** Format a number with Bengali digits and thousands separators (matches the mockup's en-US grouping) */
export function bnNum(n: number): string {
  return toBn(n.toLocaleString("en-US"));
}

/** Format price with ৳ symbol */
export function bnPrice(n: number): string {
  return "৳" + bnNum(n);
}
