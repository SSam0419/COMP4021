const Notification = function (playerSlot, type) {
  switch (type) {
    case "teleporter cooldown":
      $(`#player-${playerSlot}-board .cooldown-warning`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .cooldown-warning`).hide();
      }, 3000);
      break;
    case "trap":
      $(`#player-${playerSlot}-board .trap-status`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .trap-status`).hide();
      }, 3000);
      break;
    case "trap cheat":
      $(`#player-${playerSlot}-board .trap-status-cheat`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .trap-status-cheat`).hide();
      }, 3000);
      break;
    case "coin":
      $(`#player-${playerSlot}-board .coin-notification`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .coin-notification`).hide();
      }, 3000);
      break;
    case "hit":
      $(`#player-${playerSlot}-board .hit`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .hit`).hide();
      }, 3000);
      break;
    case "hit cheat":
      console.log("Playerslot"+playerSlot)
      $(`#player-${playerSlot}-board .hit-cheat`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .hit-cheat`).hide();
      }, 3000);
      break;
    case "miss":
      $(`#player-${playerSlot}-board .miss`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .miss`).hide();
      }, 3000);
      break;
    case "get hit":
      $(`#player-${playerSlot}-board .get-hit`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .get-hit`).hide();
      }, 3000);
      break;
    case "get hit cheat":
      $(`#player-${playerSlot}-board .get-hit-cheat`).show();
      setTimeout(function () {
        $(`#player-${playerSlot}-board .get-hit-cheat`).hide();
      }, 3000);
      break;
    case "cheat":
      $(`#player-${playerSlot}-board .cheat`).show();
      break;
    default:
      break;
  }
};
