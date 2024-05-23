function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min)
	const maxFloored = Math.floor(max)
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}

function colorTheNum(elCell) {
    switch (elCell.innerText) {
        case '1':
            elCell.classList.add('one')
            break;
        case '2':
            elCell.classList.add('two')
            break;
        case '3':
            elCell.classList.add('three')
            break;
        case '4':
            elCell.classList.add('four')
            break;
        case '5':
            elCell.classList.add('five')
            break;
        case '6':
            elCell.classList.add('six')
            break;
        case '7':
            elCell.classList.add('seven')
            break;
        case '8':
            elCell.classList.add('eight')
            break;

        default:
            break;
    }
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

function reset() {
    clearInterval(gTimerInterval)
    gGame = {
        isOn: false,
        livesCount: 3,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }    

    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'

    var elSpan = document.querySelector('.timer')
    elSpan.innerText = '⏳' + '0'
    gIsFirstClick = true

    gBoard = createBoard(gLevel.SIZE)
    // IsFirstClick()

    setMinesOnBoard(gBoard)
    renderBoard(gBoard)
    var lives = document.querySelector('.lives')
    lives.innerText = '❤️' + gGame.livesCount
    var face = document.querySelector('.restart-face')
    face.innerText = '🙂'
}

function chooseLevelSize(elBtn) {
    switch (elBtn.innerText) {
        case "EASY":
            gLevel.SIZE = 4
            gLevel.MINES = 2    
            break
        case "MEDIUM":
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break
        case "EXPERT":
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break
        default:
            console.log("Unexpected level size:", elBtn.innerText);
            break
    }
   reset()
}