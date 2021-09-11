var canvas = document.getElementById("canvas")
var context = canvas.getContext('2d')
var penColor = 'black'
var eraserEnabled = false // 橡皮檫使用情况
autoSetCanvas(canvas) // 自适应屏幕宽高
listenToUser(canvas)
    // 橡皮檫控制
eraser.onclick = function() {
    eraserEnabled = !eraserEnabled
    eraser.classList.add('active')
    pen.classList.remove('active')
}
pen.onclick = function() {
    eraserEnabled = false
    pen.classList.add('active')
    eraser.classList.remove('active')
}
colors.onclick = function(event) {
    const srcElement = event.srcElement
    const color = srcElement.getAttribute('color')
    const list = srcElement.parentElement.children
    for (let i = 0; i < list.length; ++i) {
        const currentLiElement = list[i]
        const loacalColor = currentLiElement.getAttribute('color')
        if (color === loacalColor) {
            currentLiElement.classList.add('active')
        } else {
            currentLiElement.classList.remove('active')
        }
    }
    // 更换画笔颜色
    penColor = color
}
clearButton.onclick = function() {
    const x = document.documentElement.clientWidth
    const y = document.documentElement.clientHeight
    context.clearRect(0, 0, x, y)
}
downloadButton.onclick = function() {
    const MIME_TYPE = 'image/png'
    const pictureURL = canvas.toDataURL(MIME_TYPE, 1.0);
    const downloadLink = document.createElement("a")
    downloadLink.download = 'canvas.png'
    downloadLink.href = pictureURL
    downloadLink.click()
}

function listenToUser(canvas) {
    var using = false
    var lastPoint = { x: undefined, y: undefined }
        // 特性检测
    if (document.body.ontouchstart !== undefined) {
        // 触屏设备
        canvas.ontouchstart = function(event) {
            const x = event.touches[0].clientX
            const y = event.touches[0].clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = { x, y }
            }
        }
        canvas.ontouchmove = function(event) {
            const x = event.touches[0].clientX
            const y = event.touches[0].clientY
            if (using) {
                if (eraserEnabled) {
                    context.clearRect(x - 5, y - 5, 10, 10)
                } else {
                    var newPoint = { x, y }
                    drawCircle(x, y, 1)
                    drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                    lastPoint = newPoint
                }
            }
        }
        canvas.ontouchend = function(event) {
            using = false
        }
    } else {
        canvas.onmousedown = function(event) {
            var x = event.clientX
            var y = event.clientY
            using = true
                // 使用橡皮檫
            if (eraserEnabled) {
                // 使中心在鼠标中间（浏览器的坐标系）
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                lastPoint = { x, y }
            }
        }
        canvas.onmousemove = function(event) {
                var x = event.clientX
                var y = event.clientY
                if (using) {
                    if (eraserEnabled) {
                        context.clearRect(x - 5, y - 5, 10, 10)
                    } else {
                        var newPoint = { x, y }
                        drawCircle(x, y, 1)
                        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                        lastPoint = newPoint
                    }
                }
            }
            // 鼠标抬起，轨迹失效
        canvas.onmouseup = function(event) {
            using = false
        }
    }
}

function drawCircle(x, y, radius) {
    context.beginPath()
    context.fillStyle = penColor
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath()
    context.moveTo(x1, y1) // 起点
    context.lineWidth = 5
    context.strokeStyle = penColor
    context.lineTo(x2, y2) // 终点
    context.stroke()
    context.closePath()
}

function autoSetCanvas(canvas) {
    function canvasFillScreen() {
        // 获取屏幕的宽,高
        var pageWidth = document.documentElement.clientWidth
        var pageHeight = document.documentElement.clientHeight
        canvas.width = pageWidth
        canvas.height = pageHeight
    }
    canvasFillScreen()
        // 屏幕适配
    window.onresize = function() {
        canvasFillScreen()
    }
}