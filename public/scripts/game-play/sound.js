const Sounds = function(){
    let sounds = {
        attack:{
            audio: new Audio('../../../assets/attack.mp3'),
            isPlaying: false
        },
        coin:{
            audio: new Audio('../../../assets/coin-collect.mp3'),
            isPlaying: false
        },
        getHit:{
            audio: new Audio('../../../assets/get-hit.mp3'),
            isPlaying: false
        },
        land:{
            audio: new Audio('../../../assets/land.mp3'),
            isPlaying: false
        },
        jump:{
            audio: new Audio('../../../assets/jump.mp3'),
            isPlaying: false
        },
        win:{
            audio: new Audio('../../../assets/gameover-win.mp3'),
            isPlaying: false
        },
        lose:{
            audio: new Audio('../../../assets/gameover-lose.mp3'),
            isPlaying: false
        },
        trap:{
            audio: new Audio('../../../assets/trap.mp3'),
            isPlaying: false
        },
        teleport:{
            audio: new Audio('../../../assets/teleport.mp3'),
            isPlaying: false
        },
        bgm:{
            audio: new Audio('../../../assets/bgm.mp3'),
            isPlaying: false
        },
        bgmCheat:{
            audio: new Audio('../../../assets/cheat-bgm.mp3'),
            isPlaying: false
        }
      }

    bgmPlaying = null // Key of BGM
    const play = function(sound,volume){
        if(volume){
            sounds[sound].audio.volume = volume;
            console.log(volume)
        }
        if(!sounds[sound].isPlaying){
            sounds[sound].audio.play()
            sounds[sound].isPlaying = true
        }
        sounds[sound].isPlaying = false
    }

    const playBGM = function(sound, volume){
        if(bgmPlaying !== null){
            if(bgmPlaying===sound) return;
            // console.log("BGM Previous: "+bgmPlaying)
            sounds[bgmPlaying].audio.pause()
            sounds[sound].audio.currentTime = 0;
            sounds[sound].isPlaying = false
        }
        bgmPlaying = sound 
        if(volume){
            sounds[sound].audio.volume = volume;
        }
        // console.log("BGM playing: "+bgmPlaying)
        sounds[bgmPlaying].audio.loop = true
        sounds[bgmPlaying].audio.play()
        sounds[bgmPlaying].isPlaying = true
    }

    const stopBGM = function(){
        if(bgmPlaying===null) return
        sounds[bgmPlaying].audio.pause()
    }

    const playDirect = function(sound, volume){
        // console.log(sound)
        if(volume){
            sounds[sound].audio.volume = volume;
        }
        sounds[sound].audio.currentTime = 0;
        sounds[sound].audio.play()
    }

    return {
        play: play,
        playDirect: playDirect,
        playBGM: playBGM,
        stopBGM: stopBGM
    }
}()