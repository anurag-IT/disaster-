export function normalizeNepalPhone(raw: string): string | null {
  const compact = raw.replace(/[\s()-]/g, "");
  if (/^98\d{8}$/.test(compact)) return `+977${compact}`;
  if (/^\+97798\d{8}$/.test(compact)) return compact;
  return null;
}

export function maskPhone(phone: string) { return phone.replace(/^(\+977\d{2})\d{4}(\d{3})$/, "$1****$2"); }
