export const formateDate = (dateString, format) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (format === "DD-MMM-YYYY") {
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    if (format === "hh:mm A") {
      return `${date.getHours()}:${date.getMinutes()} ${date.getHours() >= 12 ? "PM" : "AM"}`;
    }

  } catch (error) {
    console.log("Formate Date Error", error);
    return "";
  }
}