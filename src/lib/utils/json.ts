// Utility functions for handling JSON strings in SQLite

export const parseJsonString = (jsonString: string): any[] => {
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
