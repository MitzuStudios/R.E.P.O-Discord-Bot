function parseDuration(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  const parts = [];
  if (days) parts.push(`${days} día${days > 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);
  if (seconds) parts.push(`${seconds} segundo${seconds > 1 ? "s" : ""}`);
  return parts.join(", ");
}

module.exports = parseDuration;
