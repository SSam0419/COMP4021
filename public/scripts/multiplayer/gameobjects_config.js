const GameObjectsConfig = (function(){
    let gameStartTime, coinCoord, teleporterCoord, trapCoord, playerCoord, score = null;
    let updateTrigger;

    const setConfig = function(gameStartTimeA, coinCoordA, teleporterCoordA, trapCoordA, playerCoordA, scoreA){
        updateTrigger = true;
        gameStartTime = gameStartTimeA
        coinCoord = coinCoordA
        teleporterCoord = teleporterCoordA
        trapCoord = trapCoordA
        playerCoord = playerCoordA
        score = scoreA
    }

    const getConfig = function(){
        updateTrigger = false;
        return {gameStartTime, coinCoord, teleporterCoord, trapCoord, playerCoord, score}
    }

    const hasUpdate = function(){
        return updateTrigger
    }

    return {
        setConfig:setConfig,
        getConfig:getConfig,
        hasUpdate:hasUpdate
    }
})()