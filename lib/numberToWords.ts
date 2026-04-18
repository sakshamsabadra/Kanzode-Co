/**
 * Converts a number to its Indian English words representation.
 * e.g. 11000 → "Eleven Thousand Rupees only"
 */
const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function belowHundred(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}

function belowThousand(n: number): string {
  if (n < 100) return belowHundred(n);
  return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + belowHundred(n % 100) : "");
}

export function numberToWords(amount: number): string {
  if (amount === 0) return "Zero Rupees only";

  const crore = Math.floor(amount / 10_000_000);
  amount %= 10_000_000;
  const lakh = Math.floor(amount / 100_000);
  amount %= 100_000;
  const thousand = Math.floor(amount / 1_000);
  amount %= 1_000;
  const remainder = amount;

  let words = "";
  if (crore) words += belowThousand(crore) + " Crore ";
  if (lakh) words += belowThousand(lakh) + " Lakh ";
  if (thousand) words += belowThousand(thousand) + " Thousand ";
  if (remainder) words += belowThousand(remainder) + " ";

  return words.trim() + " Rupees only";
}
