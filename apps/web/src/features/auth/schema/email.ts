import { z } from "zod";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.jp",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.co",
  "live.com",
  "live.co.uk",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "zoho.com",
  "mail.com",
  "yandex.com",
  "yandex.ru",
  "tutanota.com",
  "tuta.com",
  "fastmail.com",
  "hey.com",
  "pm.me",
]);

export function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && PERSONAL_EMAIL_DOMAINS.has(domain);
}

export const workEmailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .refine((email) => !isPersonalEmail(email), {
    message: "Please use a work email address",
  });
