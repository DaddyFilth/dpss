// JSON utilities - kept for compatibility but not needed for PostgreSQL
// PostgreSQL supports arrays and enums natively

export const parseJsonString = (jsonString: string | null | undefined): any[] => {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

export const toJsonString = (array: any[]): string => {
  if (!array || array.length === 0) return '';
  return JSON.stringify(array);
};

