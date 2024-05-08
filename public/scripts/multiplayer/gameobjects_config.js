const GameObjectsConfig = (function () {
  let gameStartTime,
    coinCoord,
    teleporterCoord,
    trapCoord,
    playerCoord,
    score,
    isGameEnd = null;
  let updateTrigger;

  const setConfig = function (
    gameStartTimeA,
    coinCoordA,
    teleporterCoordA,
    trapCoordA,
    playerCoordA,
    scoreA,
    isGameEndA
  ) {
    updateTrigger = true;
    gameStartTime = gameStartTimeA;
    coinCoord = coinCoordA;
    teleporterCoord = teleporterCoordA;
    trapCoord = trapCoordA;
    playerCoord = playerCoordA;
    score = scoreA;
    isGameEnd = isGameEndA;
  };

  const getConfig = function () {
    updateTrigger = false;
    return {
      gameStartTime,
      coinCoord,
      teleporterCoord,
      trapCoord,
      playerCoord,
      score,
      isGameEnd,
    };
  };

  const hasUpdate = function () {
    return updateTrigger;
  };

  return {
    setConfig: setConfig,
    getConfig: getConfig,
    hasUpdate: hasUpdate,
  };
})();
