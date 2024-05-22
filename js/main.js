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
            }
            strHTML += `<td class="${className}"
                            onclick="onCellClicked(this,${i},${j})" expandShown(this, ${i}, ${j}) oncontextmenu="onCellMarked(this, ${i}, ${j})">
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
        expandShown(cellI, cellJ)
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
    if (correctFlags === gLevel.MINES && openedCells === totalCells - gLevel.MINES) {
                var elModal = document.querySelector('.modal')
                elModal.style.display = 'block'
                var elSpan = document.querySelector('.modal-text')
                elSpan.innerText = 'Victory!'
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
        var elSpan = document.querySelector('.modal-text')
        elSpan.innerText = 'You Lose!'
    }
}

function startTimer() {

    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        var seconds = ((Date.now() - gStartTime) / 1000).toFixed(2);
        var elSpan = document.querySelector('.timer');
        elSpan.innerText = '⏳' + seconds
    }, 10);
}

// function expandShown(elCell, rowIdx, colIdx) {
//     var numOfNegs = getNegsMineCount(rowIdx, colIdx, gBoard)
//     if (!numOfNegs) {
//         for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//             for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//                 if (i === rowIdx && j === colIdx) continue
//                 if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[0].length) continue
//                 var cell = gBoard[i][j]
//                 if (!cell.isMine && !cell.isShown) {
//                     cell.isShown = true
//                     gGame.shownCount++
//                     if (cell.minesAroundCount === 0) {
//                         elCell.innerText = ''
//                         elCell.classList.add('clicked')
//                         expandShown(elCell, i, j)
//                     } else {
//                         elCell.innerText = cell.minesAroundCount
//                         elCell.classList.add('clicked')
//                     }
//                 }
//             }
//         }
//     }
// }

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