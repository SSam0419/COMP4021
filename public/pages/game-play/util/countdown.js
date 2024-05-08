function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}
function startCountdown() {
  // Get the initial time remaining (3 minutes)
  let timeRemaining = 180;
  const timeRemainingElement = $("#time-remaining");

  // Start the countdown
  const countdownInterval = setInterval(() => {
    timeRemaining--;
    timeRemainingElement.text(formatTime(timeRemaining));
    if (timeRemaining === 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}
