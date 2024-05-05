const GameroomConfig = (function(){
    let roomNum = null;
    let playerSlot = null; // Slot of player

    const setConfig = function(roomNumA, playerSlotA){
        roomNum = roomNumA;
        playerSlot = playerSlotA;
    }

    const getConfig = function(){
        return {roomNum, playerSlot}
    }

    return {
        setConfig:setConfig,
        getConfig:getConfig
    }
})()