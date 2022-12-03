'use strict';

let elementX = document.querySelector('#x_value');
let elementY = document.querySelector('#y_value');
let elementR = document.querySelector('#r_value');
let timezone = document.querySelector('#timezone');

let form = document.querySelector('#form');
let clearButton = document.querySelector('#clear_button');
let graph = document.querySelector('#graph');
let htmlTableRows = document.querySelectorAll('#results_container tr');
let resultsContainer = [];

// Сохранение позиции курсора и его возврат после перезагрузки страницы
// (чисто для себя, раздражает, когда слетает)
window.addEventListener('scroll',function() {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});
window.addEventListener('load',function() {
    let scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
    }
});

// Заполнение таблицы и отрисовка графика при загрузке страницы
// (если R было выбрано до этого - оно останется на графике)
document.addEventListener('DOMContentLoaded', function () {
    // Возврат предыдущего значения радиуса после перезагрузки
    let prevRadiusValue = sessionStorage.getItem('prevRadiusValue');
    if (prevRadiusValue) {
        elementR.value = prevRadiusValue
        drawGraph(elementR.value);
    } else {
        drawGraph();
    }

    collectData(htmlTableRows, resultsContainer);
    drawData(resultsContainer);
});

// Отправка данных при нажатии кнопки "Подтвердить"
form.addEventListener('submit', function (event) {
    removeErrors();

    let allValid = validSelectOption(elementX) &
        validTextField(elementY, -3, 5) &
        validSelectOption(elementR);

    if (!allValid) {
        event.preventDefault();
        return;
    }

    timezone.value = new Date().getTimezoneOffset();

    // event.preventDefault();
    // $.ajax({
    //     url: 'controller',
    //     method: 'POST',
    //     data: $(this).serialize() + '&timezone=' + new Date().getTimezoneOffset(),
    //     dataType: 'html',
    //     success: function () {
    //         window.location.replace('form-result');
    //     },
    //     error: function (error) {
    //         console.log(error);
    //     }
    // });
});

// Очистка полей и графика при нажатии кнопки "Сбросить"
form.addEventListener('reset', function () {
    // Обнуление сохранённого значения радиуса
    sessionStorage.removeItem('prevRadiusValue');

    removeErrors();
    drawGraph();
});

// Очистка таблицы при нажатии соответствующей кнопки
clearButton.addEventListener('click', function () {
    let parameter = {
        clear: 'true'
    }

    $.ajax({
        url: 'controller',
        method: 'POST',
        data: serialize(parameter),
        dataType: 'html',
        success: function () {
            // аналогично location.reload(), но не требует подтверждение перезагрузки при POST запросе
            window.location = window.location;
        },
        error: function (error) {
            console.log(error);
        }
    });
});

// Перерисовка графика при изменении R
elementR.addEventListener('change', function () {
    // Сохранение значения радиуса
    sessionStorage.setItem('prevRadiusValue', this.value);

    drawGraph(this.value);
    drawData(resultsContainer);
});

// Отрисовка точки при нажатии на график
graph.onmousedown = function (event) {
    // 1 - левая кнопка мыши (игнор клика правой кнопкой)
    if (event.which === 1) {
        removeErrors();

        if (validSelectOption(elementR, false)) {
            let rect = this.getBoundingClientRect();

            let canvasX = event.clientX - rect.left;
            let canvasY = event.clientY - rect.top;

            let x = ((canvasX - HALF_WIDTH) * elementR.value/2)/HALF_STEP;
            let y = ((HALF_HEIGHT - canvasY) * elementR.value/2)/HALF_STEP;

            let roundX = x.toFixed(2);
            let roundY = y.toFixed(2);

            if (!validCoordinate(roundX, -3, 5, false)) {
                insertError('Координата X вне диапазона [-3, 5]', this, false);
                return;
            }

            if (!validCoordinate(roundY, -3, 5, true)) {
                insertError('Координата Y вне диапазона (-3, 5)', this, false);
                return;
            }

            let result = {
                x: roundX,
                y: roundY,
                r: elementR.value,
                timezone: new Date().getTimezoneOffset()
            };

            $.ajax({
                url: 'controller',
                method: 'POST',
                data: serialize(result),
                dataType: 'html',
                success: function () {
                    // аналогично location.reload(), но не требует подтверждение перезагрузки при POST запросе
                    window.location = window.location;
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } else {
            insertError('Выберите радиус!', this, false);
        }
    }
}

// Двойной клик по графику не будет выделять текст ошибки
graph.onselectstart = function () {
    return false;
}

// Сбор данных из HTML таблички в массив JS объектов
function collectData(htmlTableRows, resultsContainer) {
    htmlTableRows.forEach((tr, i) => {
        if (i === 0) return; // Пропуск заголовков
        let x, y, isInside;
        for (let j = 0; j < tr.cells.length; j++) {
            let cell = tr.cells[j];
            if (cell.className === 'x_cell') x = cell.innerHTML;
            else if (cell.className === 'y_cell') y = cell.innerHTML;
            else if (cell.className === 'isInside_cell') isInside = cell.innerHTML;
        }
        let result = {
            x: x,
            y: y,
            isInside: (isInside.trim() === 'Попадание')
        };
        resultsContainer.push(result);
    });
}

// Отрисовка точек на графике
function drawData(resultsContainer) {
    for (let i = 0; i < resultsContainer.length; i++) {
        let result = resultsContainer[i];
        drawDot(result.x, result.y, result.isInside);
    }
}

// Сериализация объекта (в строку запроса)
function serialize(object) {
    let string = [];
    for (let property in object) {
        if (object.hasOwnProperty(property)) {
            let line = encodeURIComponent(property) + '=' + encodeURIComponent(object[property]);
            string.push(line);
        }
    }
    return string.join('&');
}
