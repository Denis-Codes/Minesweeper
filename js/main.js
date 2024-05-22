'use strict'

const MINE = '💣'
const EMPTY = ''

var gBoard
var gGame
var gLevel
var gIsFirstClick
var gTimerInterval
var gStartTime

function onInit() {
    clearInterval(gTimerInterval)
    gGame = {
        isOn: false,
        livesCount: 3,
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

    var elSpan = document.querySelector('.timer')
    elSpan.innerText = '⏳' + '0.00'
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
            } else {
                className += ''
            }
            strHTML += `<td class="${className}"
                            onclick="onCellClicked(this,${i},${j})">
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
            console.log(`Mine placed at [${rndRowIdx}][${rndColIdx}]`)
        }
    }
}


function onCellClicked(elCell, cellI, cellJ) {
    var cell = gBoard[cellI][cellJ]
    if (cell.isShown) return
    if (gGame.shownCount === 0) {
        gGame.isOn = true
        gStartTime = Date.now()
        startTimer()
    }
    if (!gGame.isOn) return

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
        // console.log(gGame.livesCount)
        var lives = document.querySelector('.lives')
        lives.innerText = '❤️' + gGame.livesCount
        checkGameOver()
    } else if (cell.minesAroundCount === 0) {
        elCell.innerText = EMPTY
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
    if (gGame.shownCount === (gBoard.SIZE ** 2 - gBoard.minesCount) ||
        gGame.livesCount > 0 && gBoard.SIZE ** 2 === gBoard.minesCount) {
        var elModal = document.querySelector('.modal')
        elModal.style.display = 'block'
        var elSpan = document.querySelector('.modal-text')
        elSpan.innerText = 'Victory!'
        return true
    }
    return false
}

function checkGameOver() {
    if (gGame.livesCount === 0) {
        gGame.isOn = false
        // clearInterval()
        var elModal = document.querySelector('.modal')
        elModal.style.display = 'block'
        var elSpan = document.querySelector('.modal-text')
        elSpan.innerText = 'You Lose!'
    }
}

function startTimer() {

    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        var seconds = ((Date.now() - gStartTime) / 1000).toFixed(2);
        var elSpan = document.querySelector('.timer');
        elSpan.innerText = '⏳' +  seconds
    }, 10);
}
