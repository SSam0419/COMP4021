const GamePlay = (function () {
  const initialize = () => {
    console.log("Game Play initialized");
    const url = window.location.pathname;
    const room = url.split("/")[2];
    console.log("Room: " + room);
  };

  return { initialize };
})();
