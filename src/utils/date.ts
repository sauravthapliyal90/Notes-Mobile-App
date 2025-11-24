
export const nowIso = () => new Date().toISOString();

/**
 * Format ISO date into readable format
 * Ex: "2024-01-18T15:03:22.000Z" -> "Jan 18, 2024"
 */
export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
