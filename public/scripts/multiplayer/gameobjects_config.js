const GameObjectsConfig = (function () {
  let gameStartTime,
    coinCoord,
    teleporterCoord,
    trapCoord,
    playerCoord,
    score,
    isGameEnd,
    playerCheating = null;
  let updateTrigger;

  const setConfig = function (
    gameStartTimeA,
    coinCoordA,
    teleporterCoordA,
    trapCoordA,
    playerCoordA,
    scoreA,
    isGameEndA,
    playerCheatingA
  ) {
    updateTrigger = true;
    gameStartTime = gameStartTimeA;
    coinCoord = coinCoordA;
    teleporterCoord = teleporterCoordA;
    trapCoord = trapCoordA;
    playerCoord = playerCoordA;
    score = scoreA;
    isGameEnd = isGameEndA;
    playerCheating = playerCheatingA;
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
      playerCheating
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
