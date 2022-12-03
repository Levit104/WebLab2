'use strict';

let canvas = document.querySelector('#graph');
let ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const HALF_WIDTH = WIDTH/2;
const HALF_HEIGHT = HEIGHT/2;
const STEP = 200;
const HALF_STEP = STEP/2;
const DASH_SIZE = 10;

function drawGraph(r = 'R') {
    // Очистка
    clearGraph()

    // Фигуры
    drawFigures();

    // Сетка (для теста)
    // drawGrid();

    // Оси
    drawAxes();

    // Чёрточки
    drawDashes();

    //Значения на графике
    drawValues(r);
}

function drawDot(x, y, isInside) {
    x = HALF_WIDTH + x * 2/elementR.value * HALF_STEP;
    y = HALF_HEIGHT - y * 2/elementR.value * HALF_STEP;

    ctx.beginPath();
    ctx.fillStyle = (isInside) ? 'green' : 'red';
    ctx.moveTo(x, y);
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function clearGraph() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawGrid() {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'grey';

    for (let x = 50; x <= WIDTH - 50; x += 50) {
        // if (x === HALF_WIDTH) continue;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
    }

    for (let y = 50; y <= HEIGHT - 50; y += 50) {
        // if (y === HALF_HEIGHT) continue;
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
    }

    ctx.stroke();
    ctx.closePath();
}

function drawAxes() {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';

    // Ось X
    ctx.moveTo(0, HALF_HEIGHT);
    ctx.lineTo(WIDTH, HALF_HEIGHT);

    // Стрелочка X
    ctx.moveTo(WIDTH, HALF_HEIGHT);
    ctx.lineTo(WIDTH - 15, HALF_HEIGHT - 15);
    ctx.moveTo(WIDTH, HALF_HEIGHT);
    ctx.lineTo(WIDTH - 15, HALF_HEIGHT + 15);

    // Ось Y
    ctx.moveTo(HALF_WIDTH, 0);
    ctx.lineTo(HALF_WIDTH, HEIGHT);

    // Стрелочка Y
    ctx.moveTo(HALF_WIDTH, 0);
    ctx.lineTo(HALF_WIDTH - 15, 15);
    ctx.moveTo(HALF_WIDTH, 0);
    ctx.lineTo(HALF_WIDTH + 15, 15);

    // Подписи
    ctx.fillStyle = 'black';
    ctx.font = `1000 italic ${25}px Roboto`;
    ctx.fillText('x', WIDTH - 30, HALF_HEIGHT - 20)
    ctx.fillText('y', HALF_WIDTH - 35, 20)

    ctx.stroke();
    ctx.closePath();
}

function drawDashes() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.moveTo(HALF_WIDTH - DASH_SIZE, HALF_HEIGHT - HALF_STEP);
    ctx.lineTo(HALF_WIDTH + DASH_SIZE, HALF_HEIGHT - HALF_STEP);

    ctx.moveTo(HALF_WIDTH - DASH_SIZE, HALF_HEIGHT - STEP);
    ctx.lineTo(HALF_WIDTH + DASH_SIZE, HALF_HEIGHT - STEP);

    ctx.moveTo(HALF_WIDTH - DASH_SIZE, HALF_HEIGHT + HALF_STEP);
    ctx.lineTo(HALF_WIDTH + DASH_SIZE, HALF_HEIGHT + HALF_STEP);

    ctx.moveTo(HALF_WIDTH - DASH_SIZE, HALF_HEIGHT + STEP);
    ctx.lineTo(HALF_WIDTH + DASH_SIZE, HALF_HEIGHT + STEP);

    ctx.moveTo(HALF_WIDTH - HALF_STEP, HALF_HEIGHT - DASH_SIZE);
    ctx.lineTo(HALF_WIDTH - HALF_STEP, HALF_HEIGHT + DASH_SIZE);

    ctx.moveTo(HALF_WIDTH - STEP, HALF_HEIGHT - DASH_SIZE);
    ctx.lineTo(HALF_WIDTH - STEP, HALF_HEIGHT + DASH_SIZE);

    ctx.moveTo(HALF_WIDTH + HALF_STEP, HALF_HEIGHT - DASH_SIZE);
    ctx.lineTo(HALF_WIDTH + HALF_STEP, HALF_HEIGHT + DASH_SIZE);

    ctx.moveTo(HALF_WIDTH + STEP, HALF_HEIGHT - DASH_SIZE);
    ctx.lineTo(HALF_WIDTH + STEP, HALF_HEIGHT + DASH_SIZE);

    ctx.stroke();
    ctx.closePath();
}

function drawFigures() {
    ctx.beginPath();
    ctx.fillStyle = '#23b8fd';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    // Прямоугольник
    ctx.rect(HALF_WIDTH, HALF_HEIGHT, -STEP, -STEP);

    // Четверть окружности
    ctx.moveTo(HALF_WIDTH, HALF_HEIGHT);
    ctx.arc(HALF_WIDTH, HALF_HEIGHT, HALF_STEP, Math.PI/2, Math.PI);

    // Треугольник
    ctx.moveTo(HALF_WIDTH, HALF_HEIGHT);
    ctx.lineTo(HALF_WIDTH, HALF_HEIGHT + HALF_STEP);
    ctx.lineTo(HALF_WIDTH + HALF_STEP, HALF_HEIGHT);

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawValues(r) {
    let label, label2;

    if (isNaN(r)) {
        label = r
        label2 = r + '/2'
    } else {
        label = r
        label2 = r / 2
    }

    ctx.font = `600 ${20}px Roboto`;

    // По оси X
    ctx.fillText(label, HALF_WIDTH + STEP - DASH_SIZE/2, HALF_HEIGHT + DASH_SIZE * 3);
    ctx.fillText(label2, HALF_WIDTH/2 + STEP + DASH_SIZE * 4 + DASH_SIZE/2, HALF_HEIGHT + DASH_SIZE * 3);
    ctx.fillText('-' + label, HALF_WIDTH - STEP - DASH_SIZE, HALF_HEIGHT + DASH_SIZE * 3);
    ctx.fillText('-' + label2, HALF_WIDTH/2 + DASH_SIZE * 2, HALF_HEIGHT + DASH_SIZE * 3);

    // По оси Y
    ctx.fillText(label, HALF_WIDTH + DASH_SIZE * 2, HALF_HEIGHT - STEP + DASH_SIZE/2);
    ctx.fillText(label2, HALF_WIDTH + DASH_SIZE * 2, HALF_HEIGHT/2 + 5 * DASH_SIZE + DASH_SIZE/2);
    ctx.fillText('-' + label, HALF_WIDTH + DASH_SIZE * 2, HALF_HEIGHT + STEP + DASH_SIZE/2);
    ctx.fillText('-' + label2, HALF_WIDTH + DASH_SIZE * 2, HALF_HEIGHT + HALF_STEP + DASH_SIZE/2);
}
