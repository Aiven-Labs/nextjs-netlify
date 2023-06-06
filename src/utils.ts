export const formatTimeMinutes = (minutes: number) => {
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = minutes % 60;

  let timeString = "";

  if (days > 0) {
    timeString += `${days} day${days > 1 ? "s" : ""} `;
  }

  if (hours > 0) {
    timeString += `${hours} hr${hours > 1 ? "s" : ""} `;
  }

  if (remainingMinutes > 0) {
    timeString += `${remainingMinutes} min${remainingMinutes > 1 ? "s" : ""}`;
  }

  return timeString.trim();
};
