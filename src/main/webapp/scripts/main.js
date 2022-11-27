'use strict';

let elementX = document.querySelector('#x_value');
let elementY = document.querySelector('#y_value');
let elementR = document.querySelector('#r_value');
let timezone = document.querySelector('#timezone');

let form = document.querySelector('#form');
let clearButton = document.querySelector('#clear_button');
let graph = document.querySelector('#graph');
let htmlTableRows = document.querySelectorAll('#result_table tr');
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
    // TODO убрать или оставить?
    drawData(resultsContainer);
});

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

// Проверка списка
function validSelectOption(element, displayMessage = true) {
    if (element.selectedIndex === 0) {
        if (displayMessage) insertError('Значение не выбрано', element);
        return false;
    }
    return true;
}

// Проверка текстового поля
function validTextField(element, min, max) {
    let value = element.value;

    if (!value) {
        insertError('Пустое поле', element);
        return false;
    } else if (!isNumeric(value) || value <= min || value >= max) {
        insertError('Недопустимое значение', element);
        return false;
    } else if (value.length > 1 && value.slice(-1) === '0') {
        insertError('Лишние нули', element);
        return false;
    } else if (value.slice(-1) === '.' || value.slice(-1) === ',' || /[,]{2,}/.test(value) || /[.]{2,}/.test(value)) {
        insertError('Лишний разделитель', element);
        return false;
    } else if (value.search(',') !== -1) {
        insertError('Разделитель - точка', element);
        return false;
    }

    return true;
}

// Проверка координаты на графике
function validCoordinate(value, min, max, isStrict) {
    return (isStrict) ? (value > min && value < max) : (value >= min && value <= max);
}

// Проверка является ли строка числом
function isNumeric(string) {
    let number = parseFloat(string);
    return !isNaN(number) && isFinite(number);
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

// Вставка блока с ошибкой (по умолчанию до элемента)
function insertError(message, element, insertBefore = true) {
    if (insertBefore) {
        element.parentElement.insertBefore(createError(message), element);
    } else {
        element.parentNode.insertBefore(createError(message), element.nextSibling);
    }
}

// Создание блока с ошибкой (цвета, рамки и т.д. в CSS)
function createError(message) {
    let error = document.createElement('div');
    error.className = 'error';
    error.innerHTML = message;
    return error;
}

// Очистка ошибок (чтобы не появлялось несколько надписей подряд)
function removeErrors() {
    document.querySelectorAll('.error').forEach(error => {
        error.remove();
    });
}
