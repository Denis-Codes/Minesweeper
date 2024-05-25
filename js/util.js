'use strict'

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function shuffleArray() {
    for (var i = gNums.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = gNums[i];
        gNums[i] = gNums[j];
        gNums[j] = temp;
    }
    return gNums
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        var seconds = ((Date.now() - gStartTime) / 1000).toFixed(0);
        var elTimer = document.querySelector('.timer');
        elTimer.innerText = '⏳' + seconds
    }, 1000);
}