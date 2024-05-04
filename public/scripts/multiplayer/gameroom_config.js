const GameroomConfig = (function(){
    let roomNum = -1;
    let playerSlot = -1; // Slot of player

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