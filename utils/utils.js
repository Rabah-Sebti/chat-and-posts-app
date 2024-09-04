export const formatDateMessage = (sentAt) => {
  const options = {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", // Adjust the time zone as needed
  };

  const formattedDate = new Date(sentAt).toLocaleString("fr-FR", options);

  return formattedDate;
};
