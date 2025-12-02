/**
 * Determines if text should be dark or light based on background color
 * for optimal readability
 * @param hexColor - Hex color string (e.g., "#FF5733")
 * @returns "#000000" for light backgrounds, "#ffffff" for dark backgrounds
 */
export const getContrastColor = (hexColor?: string): string => {
  if (!hexColor) {
    return '#000000';
  }
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return dark text for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
};
