export const formatTimeMinutes = (minutes = 0) => {
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = minutes % 60;

  let timeString = '';

  if (days > 0) {
    timeString += `${days} day${days > 1 ? 's' : ''} `;
  }

  if (hours > 0) {
    timeString += `${hours} hr${hours > 1 ? 's' : ''} `;
  }

  if (remainingMinutes > 0) {
    timeString += `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
  }

  return timeString.trim();
};

// Construct the nutrition string value to an object for visualization.
export const parseNutritionInfo = (nutrition: string) => {
  const infoArray = nutrition.split(', ');
  const nutritionData: Record<string, { value: number; unit: string | null }> = {};

  for (const info of infoArray) {
    const matches = info.match(/([A-Za-z\s]+)\s([\d.]+)\s?(\w+)?/);

    if (matches) {
      const nutrient = matches[1].trim();
      const value = parseFloat(matches[2]);
      const unit = matches[3] ? matches[3].trim() : null;
      nutritionData[nutrient] = { value, unit };
    }
  }

  return nutritionData;
};
