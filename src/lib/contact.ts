export const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactValues = Record<ContactField, string>;
export function validateContact(field: ContactField, value: string): string {
  const text = value.trim();
  if (field === "name")
    return !text
      ? "Name is required."
      : text.length < 2
        ? "Name must be at least 2 characters."
        : text.length > 80
          ? "Name must be under 80 characters."
          : /<[^>]*>/.test(text)
            ? "Name contains invalid characters."
            : "";
  if (field === "email")
    return !text
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)
        ? "Please enter a valid email address."
        : text.length > 254
          ? "Email address is too long."
          : "";
  return !text
    ? "Message is required."
    : text.length < 10
      ? "Message must be at least 10 characters."
      : text.length > 2000
        ? "Message must be under 2000 characters."
        : "";
}
export async function sendContact(values: ContactValues, signal?: AbortSignal) {
  const response = await fetch(
    import.meta.env.VITE_CONTACT_API_URL || "/api/send-email",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        Object.fromEntries(
          CONTACT_FIELDS.map((key) => [key, values[key].trim()]),
        ),
      ),
      signal,
    },
  );
  const body = await response.json().catch(() => null);
  if (!response.ok || !body || body.success === false)
    throw new Error(
      body?.error ||
        body?.message ||
        "Failed to send message. Please try again.",
    );
}
