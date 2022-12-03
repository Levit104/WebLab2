'use strict';

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