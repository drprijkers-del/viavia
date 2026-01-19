import crypto from "crypto";

/**
 * Generate a secure random hex token (32 characters)
 */
export function generateEditToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Format cents to currency string
 * bijv. 5000 -> "€50.00"
 */
export function formatCurrency(
  cents: number | null | undefined,
  currency: string = "EUR"
): string {
  if (!cents) return "-";
  const amount = (cents / 100).toFixed(2);
  const symbol = currency === "EUR" ? "€" : currency;
  return `${symbol}${amount}`;
}

/**
 * Format tariff range
 * bijv. [5000, 7500] -> "€50.00 - €75.00"
 */
export function formatTariff(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string = "EUR"
): string {
  if (!min && !max) return "-";
  if (min && !max) return `${formatCurrency(min, currency)}+`;
  if (!min && max) return `tot ${formatCurrency(max, currency)}`;
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
}

/**
 * Parse tags from JSON string
 */
export function parseTags(tagsJson: string | null): string[] {
  if (!tagsJson) return [];
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}

/**
 * Stringify tags to JSON
 */
export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags.slice(0, 5)); // max 5 tags
}

/**
 * Create WhatsApp contact URL
 * bijv. +31612345678 -> https://wa.me/31612345678?text=...
 */
export function createWhatsAppLink(
  phoneNumber: string,
  message?: string
): string {
  // Remove any non-digits except the leading +
  const cleaned = phoneNumber.replace(/\D/g, "");
  const encoded = encodeURIComponent(message || "");
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

/**
 * Validate WhatsApp phone number format
 * Expected: +31612345678 or 0612345678
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 9 && cleaned.length <= 15;
}

/**
 * Normalize phone number to +country format (assumes NL if no +)
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  // If it starts with 0, assume NL and convert to 31
  if (cleaned.startsWith("0")) {
    cleaned = "31" + cleaned.substring(1);
  }
  // If no country code yet, assume NL
  else if (cleaned.length <= 10) {
    cleaned = "31" + cleaned;
  }

  return "+" + cleaned;
}
