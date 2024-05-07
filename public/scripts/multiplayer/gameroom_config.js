const GameroomConfig = (function(){
    let roomNum = null;
    let playerSlot = null; // Slot of player
    let playerName = null;

    const setConfig = function(roomNumA, playerSlotA, playerNameA){
        roomNum = roomNumA;
        playerSlot = playerSlotA;
        playerName = playerNameA;
    }

    const getConfig = function(){
        return {roomNum, playerSlot, playerName}
    }

    return {
        setConfig:setConfig,
        getConfig:getConfig
    }
})()