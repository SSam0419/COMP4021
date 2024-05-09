function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}
function updateCounter(gameTime) {
  const timeRemainingElement = $("#time-remaining");

  const timeRemaining = 240 - gameTime;
  timeRemainingElement.text(formatTime(timeRemaining));
}
