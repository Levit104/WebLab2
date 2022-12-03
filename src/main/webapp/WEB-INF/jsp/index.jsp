<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="resultsContainer" class="levit104.web.lab2.beans.ResultsContainer" scope="session"/>
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Web Lab №2</title>
    <link rel="stylesheet" href="<c:url value="/css/style.css"/>">
</head>
<body>
<div>
    <h1>Лабораторная работа №2</h1>
</div>
<div id="title">
    Герасимов Артём Кириллович<br>Группа P32111<br>Вариант 112221
</div>
<div>
    <h1>График</h1>
    <canvas id="graph" width="600px" height="600px"></canvas>
</div>
<div>
    <h1>Выбор координат и значений</h1>
    <form id="form" method="post" action="controller" autocomplete="off">
        <label for="x_value" class="value_label">Координата X:</label>
        <select name="x" id="x_value">
            <option disabled selected>Выберите значение</option>
            <option value="-3">-3</option>
            <option value="-2">-2</option>
            <option value="-1">-1</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <br><br>
        <label for="y_value" class="value_label">Координата Y:</label>
        <input type="text" name="y" id="y_value" placeholder="от -3 до 5 не включительно, до сотых" maxlength="4">
        <br><br>
        <label for="r_value" class="value_label">Значение R:</label>
        <select name="r" id="r_value">
            <option disabled selected>Выберите значение</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <br><br>
        <input type="reset" value="Сбросить" class="custom_button">
        <br><br>
        <input type="submit" value="Подтвердить" class="custom_button">
        <input type="hidden" name="timezone" value="" id="timezone">
        <br><br>
    </form>
</div>
<div>
    <h1>Предыдущие запросы</h1>
    <table id="results_container">
        <thead>
        <tr>
            <th>X</th>
            <th>Y</th>
            <th>R</th>
            <th>Результат</th>
            <th>Текущее время</th>
            <th>Время выполнения</th>
        </tr>
        </thead>
        <tbody>
        <c:forEach var="result" items="${resultsContainer.results}">
            <tr>
                <td class="x_cell">${result.x}</td>
                <td class="y_cell">${result.y}</td>
                <td>${result.r}</td>
                <td class="isInside_cell" style="color: ${result.isInside ? "green" : "red"}">
                        ${result.isInside ? "Попадание" : "Промах"}
                </td>
                <td>${result.currentTime}</td>
                <td>${result.executionTime}</td>
            </tr>
        </c:forEach>
        </tbody>
    </table>
    <br>
    <input type="button" value="Очистить таблицу" class="custom_button" id="clear_button">
    <br><br>
</div>
<div id="logo">
    <img src="<c:url value="/img/logo-horizontal.png"/>" alt="Университет ИТМО">
</div>
<script src="<c:url value="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"/>"></script>
<script src="<c:url value="/scripts/main.js"/>"></script>
<script src="<c:url value="/scripts/graph.js"/>"></script>
</body>
</html>
