'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

var gBoard
var gGame
var gLevel
var gIsFirstClick
var gTimerInterval
var gStartTime

function onInit() {
    gIsFirstClick = true
    clearInterval(gTimerInterval)
    gGame = {
        isOn: false,
        livesCount: 1,
        safeClicksCount: 3,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gLevel = {
        SIZE: 4,
        MINES: 2
    }

    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'

    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '⏳' + '0'

    gIsFirstClick = true

    gBoard = createBoard(gLevel.SIZE)
    // IsFirstClick()

    setMinesOnBoard(gBoard)
    renderBoard(gBoard)
    var lives = document.querySelector('.lives')
    lives.innerText = '❤️' + gGame.livesCount
    var face = document.querySelector('.restart-face')
    face.innerText = '🙂'
    var elSafeClicks = document.querySelector('.safe-clicks')
    elSafeClicks.innerText = '👆' + gGame.safeClicksCount
}

function createBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    // board[0][0].isMine = true
    // board[0][1].isMine = true
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = getClassName({ i, j })
            if (cell.isMine) className += ' mine'
            else if (!cell.isMine) {
                cell.minesAroundCount = getNegsMineCount(i, j, board)
            }
            strHTML += `<td class="${className}"
                            onclick="onCellClicked(this,${i},${j})"
                             expandShown(this, ${i}, ${j})
                              oncontextmenu="onCellMarked(this, ${i}, ${j})">
                            ${EMPTY}
                        </td>`
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('tbody')
    elBoard.innerHTML = strHTML
}

function setMinesOnBoard(board) {
    // SET MINES RANDOMLY
    var minesCount = gLevel.MINES
    while (minesCount > 0) {
        const rndRowIdx = getRandomInt(0, gLevel.SIZE)
        const rndColIdx = getRandomInt(0, gLevel.SIZE)
        if (!board[rndRowIdx][rndColIdx].isMine) {
            var cell = board[rndRowIdx][rndColIdx]
            cell.isMine = true
            minesCount--
            // console.log(`Mine placed at [${rndRowIdx}][${rndColIdx}]`)
        }
    }
}

function onCellClicked(elCell, cellI, cellJ) {
    gIsFirstClick = true
    var cell = gBoard[cellI][cellJ]
    if (cell.isShown) return
    if (gGame.shownCount === 0) {
        gGame.isOn = true
        gStartTime = Date.now()
        startTimer()
    }

    if (!gGame.isOn) return
    // if (gIsFirstClick) {
        // setMinesOnBoard(gBoard)
    // }
    // gIsFirstClick = false

    elCell.classList.add('revealed')
    if (!cell.isShown) {
        cell.isShown = true
        gGame.shownCount++
    }
    isVictory()
    if (cell.isMine) {
        elCell.innerText = MINE
        elCell.classList.add('exploded')
        gGame.livesCount--
        var lives = document.querySelector('.lives')
        lives.innerText = '❤️' + gGame.livesCount
        checkGameOver()
    } else if (cell.minesAroundCount === 0) {
        elCell.innerText = EMPTY
        expandShown(gBoard, elCell, cellI, cellJ)
    } else {
        var minesAroundCount = cell.minesAroundCount
        elCell.innerText = minesAroundCount
        colorTheNum(elCell)
    }
    checkGameOver()
}

function getNegsMineCount(iIdx, jIdx, board) {
    var negMinesCount = 0
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i === iIdx && j === jIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) negMinesCount++
        }
    }
    return negMinesCount
}

function isVictory() {
    var totalCells = gLevel.SIZE ** 2
    var correctFlags = 0
    var openedCells = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine && cell.isMarked) {
                correctFlags++
            } else if (!cell.isMine && cell.isShown) {
                openedCells++
            }
        }
    }
    if (correctFlags === gLevel.MINES && openedCells === totalCells - gLevel.MINES || openedCells === totalCells && gGame.livesCount > 0) {
        var face = document.querySelector('.restart-face')
        face.innerText = '😎'
        var elModal = document.querySelector('.modal')
        elModal.style.display = 'block'
        var elTimer = document.querySelector('.modal-text')
        elTimer.innerText = 'Victory!\n🎉'
        clearInterval(gTimerInterval)
        return true
    }
    return false
}

function checkGameOver() {
    if (gGame.livesCount === 0) {
        gGame.isOn = false
        clearInterval(gTimerInterval)
        var face = document.querySelector('.restart-face')
        face.innerText = ' 🤯 '
        var elModal = document.querySelector('.modal')
        elModal.style.display = 'block'
        var elTimer = document.querySelector('.modal-text')
        elTimer.innerText = 'You Lose!\n☠️'
    }
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        var seconds = ((Date.now() - gStartTime) / 1000).toFixed(0);
        var elTimer = document.querySelector('.timer');
        elTimer.innerText = '⏳' + seconds
    }, 10);
}

function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) continue
            var cell = board[i][j]
            if (!cell.isMine && !cell.isShown) {
                cell.isShown = true
                gGame.shownCount++
                var elNegCell = document.querySelector(`.cell-${i}-${j}`)
                if (cell.minesAroundCount === 0) {
                    elNegCell.innerText = EMPTY
                    elNegCell.classList.add('revealed')
                    expandShown(gBoard, elNegCell, i, j)
                } else {
                    elNegCell.innerText = cell.minesAroundCount
                    elNegCell.classList.add('revealed')
                    colorTheNum(elNegCell)
                }
            }
        }
    }
}

function onCellMarked(elCell, i, j) {

    event.preventDefault()
    const cell = gBoard[i][j]
    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerText = EMPTY
        gGame.markedCount--
        isVictory()
    } else {
        cell.isMarked = true
        elCell.innerText = FLAG
        gGame.markedCount++
        isVictory()
    }
}

function darkMode(elBtn) {

    var body = document.querySelector('body')

    body.classList.toggle("dark-mode")

    if (body.classList.contains("dark-mode")) {
        elBtn.innerText = "LIGHT MODE"
        elBtn.style.color = '#F0F7F5'
        elBtn.style.backgroundColor = '#393939'
    } else {
        elBtn.innerText = "DARK MODE"
        elBtn.style.color = '#393939'
        elBtn.style.backgroundColor = '#F0F7F5'
    }
}

function safeClicks() {
    var emptyCells = [];

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown && !currCell.isMarked) {
                emptyCells.push({ row: i, col: j })
            }
        }
    }

    if (emptyCells.length === 0) return

    const randomIndex = getRandomInt(0, emptyCells.length)
    const randomEmptyCell = emptyCells[randomIndex]
    var elRandEmptyCell = document.querySelector(`.cell-${randomEmptyCell.row}-${randomEmptyCell.col}`)
    elRandEmptyCell.classList.add('highlighted')

    gGame.safeClicksCount--
    if (gGame.safeClicksCount < 0) return
    var elSafeClicks = document.querySelector('.safe-clicks')
    elSafeClicks.innerText = '👆' + gGame.safeClicksCount
}
