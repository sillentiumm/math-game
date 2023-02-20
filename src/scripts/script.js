const canvas = document.querySelector('#abc');
const c = canvas.getContext('2d');
const input = document.getElementById('mainInput')
const btn = document.getElementById('mainBtn')
const scoreDiv=document.getElementById('score')
const resetDiv=document.getElementById('reset')
const finishDiv=document.getElementById('finish')
const finishScoreDiv=document.getElementById('finishScore')

const elements = [
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 } ],
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }],
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }],
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }],
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }],
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }],
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }],
    [{ id:-1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }, { id: -1, value: 0, status: 0 }],
];

const arrSymbols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '+', '*', '/', '=', '=', '=']
const ballsArray = []
let quation = ''
canvas.width = 800;
canvas.height = 600;  
let elementId = 0
let positionX = 7
let intervalTime = 2500
let score = 0

let startTimeout
let beginTimeout

class Ball {
    constructor(x, y, dy, length, color, text, finalPosition, id) {
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.length = length
        this.color = color
        this.text = text
        this.finalPosition = finalPosition
        this.id = id

        this.update = function () {
            if (this.y + this.length + this.dy > canvas.height - this.finalPosition) {
                this.dy = 0
            }
            else {
                this.dy += .2
            }
            this.y += this.dy
            this.draw();
        };

        this.draw = function () {
            c.beginPath();
            c.roundRect(this.x, this.y, this.length, this.length, 16)
            c.fillStyle = this.color;
            c.lineWidth = 2
            c.stroke();
            c.fill()
            c.closePath()
            drawText(this.text, this.x, this.y, this.length)

            function drawText(text, x, y, length) {
                c.beginPath();
                c.fillStyle = '#000'
                c.font = "48px sans-serif";
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.fillText(text, x + length / 2, y + length / 2);
                c.closePath()
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < ballsArray.length; i++) {
        ballsArray[i].update()
    }
}

function elementColor(e) {
    const reg = /\d/
    return reg.test(e)
}

function start(withoutTimeout) {
    let elementsInLine = 0
    let elementX = randomPositionX()
    let elementSymbol = randomSymbol()
    let clr = ''
    elementColor(elementSymbol) ? clr = '#fff' : clr = '#FFBA00'

    elements[elementX].forEach(el => {
        if (el.status > 0) {
            elementsInLine++
        }
    })

    if (elementsInLine === 5) {
        finishDiv.style.zIndex = '1'
        finishScoreDiv.innerHTML = score
        return false
    }
    else {
        init(elementsInLine * 100, elementX * 100, elementSymbol, clr)

        elements[elementX][5 - elementsInLine].status = 1
        elements[elementX][5 - elementsInLine].value = elementSymbol
        elements[elementX][5 - elementsInLine].id = elementId
        elementId++
    }
    if(!withoutTimeout) {
        startTimeout = setTimeout(() => start(), intervalTime)
    }
}

function begin() {
    resetDiv.innerHTML = 'Reset'

    for(i = 0; i < 8; i++) {
        i ? setTimeout(func, i*200) : start()
    }
    function func(i) {
        start(1)
    }
}

function randomPositionX() {
    positionX > 6 ? positionX = 0 : positionX++
    return positionX
}

function randomSymbol() {
    let idx = Math.floor(Math.random() * 15);
    return arrSymbols[idx]
}

function init(finalPosition, x, symbol, color) {
    ballsArray.push(new Ball(x, -100, 1, 100, color, symbol, finalPosition, elementId))
}

function removElement(element) {
    let x = element.x / 100
    let y = parseInt(element.y / 100)
    elements[x][y] = { id: -1, value: 0, status: 0 }
    filter(x)
    let index = ballsArray.indexOf(element)

    if (index >= 0) {
        ballsArray.splice(index, 1)
    }

    ballsArray.forEach(e => {
        if ((e.finalPosition > (5 - y) * 100) && (e.x == x * 100)) {
            e.finalPosition -= 100
        }
    })
}

function selectElement(element, x, y) {
    if (elements[x][y].status == 1) {
        elements[x][y].status = 2
        quation += elements[x][y].value
        input.innerHTML = quation
    }
    let index = ballsArray.indexOf(element)
    if (ballsArray[index]) {
        ballsArray[index].color = '#333333'
    }
}

function filter(x) {
    const all2 = elements[x].filter(e => e.status !== 0)

    while (all2.length < 6) {  
        all2.unshift({ id: -1, value: 0, status: 0 })
    }

    for (k = 0; k < elements[x].length; k++) {
        elements[x][k] = all2[k]
    }
}

function result() {
    if (quation) {
        const ar = quation.split('=')
        quation = ''
        if ((ar.length > 1) && (verification(ar[0]))) {
            let miniScore = ar[0].length
            const res = eval(ar[0])

            for (i = 1; i < ar.length; i++) {
                miniScore += ar[i].length
                if (verification(ar[i])) {
                    if (eval(ar[i]) !== res) {
                        quationFalse()             
                        return false
                    }
                    else {
                        quationTrue()
                    }
                }
                else {
                    quationFalse()
                }
            }
            score+=miniScore * ar.length
            scoreDiv.innerHTML = score
        }
        else {
            quationFalse()
        }
    }
    else {
        quationFalse()
    }

    function verification(e) {
        const reg = /^\d*(\d+\D\d*)*\d+$/
        return reg.test(e)
    }

    function quationFalse() {
        elements.forEach(mini => {
            mini.forEach(micro => {
                if (micro.status == 2) {
                    let ballsIdx = findIndex(micro.id)
                    micro.status = 1
                    let clr = ''
                    elementColor(ballsArray[ballsIdx].text) ? clr = '#fff' : clr = '#FFBA00' 
                    ballsArray[ballsIdx].color = clr
                }
            })
        })
        input.innerHTML = 'false'
    }

    function quationTrue() {
        intervalTime -=100
        elements.forEach(mini => {
            mini.forEach(micro => {
                if (micro.status == 2) {
                    let ballsIdx = findIndex(micro.id)
                    removElement(ballsArray[ballsIdx])
                }
            })
        })
        input.innerHTML = ''
    }

    function findIndex(id) {
        let idx = ballsArray.findIndex(e =>
            e.id == id
        )
        return idx
    }
}

function reset() {
    clearTimeout(startTimeout)

    for (x = 0; x < elements.length; x++) {
        for(y = 0; y < 6; y++) {
            elements[x][y] = { id:-1, value: 0, status: 0 }
        }
    }

    ballsArray.splice(0)
    quation = ''
    elementId = 0
    positionX = 7
    intervalTime = 2500
    score = 0
    input.innerHTML = ''
    scoreDiv.innerHTML = 0
    finishDiv.style.zIndex = '-1'
    begin()
}

const handle = (event) => {
    let x = parseInt(event.offsetX / 100)
    let y = parseInt(event.offsetY / 100)
    selectElement(ballsArray.find(findElement), x, y)

    function findElement(element) {
        return element.id == elements[x][y].id
    }
}

animate()

canvas.addEventListener('click', handle)
btn.addEventListener('click', result)
resetDiv.addEventListener('click', reset)
