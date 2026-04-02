export function createReferenceNumber(prefix: string) {
  const now = new Date();
  const stamp = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");

  const suffix = crypto.randomUUID().slice(0, 4).toUpperCase();

  return `${prefix}-${stamp}-${suffix}`;
}
