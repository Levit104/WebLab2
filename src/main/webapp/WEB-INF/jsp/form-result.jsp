<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="result" class="levit104.web.lab2.beans.Result" scope="session"/>
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Web Lab №2 - Результат</title>
    <link rel="stylesheet" href="<c:url value="/css/style.css"/>">
</head>
<body>
<div>
    <h1>Результат запроса</h1>
    <table>
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
        <tr>
            <td>${result.x}</td>
            <td>${result.y}</td>
            <td>${result.r}</td>
            <td style="color: ${result.isInside ? "green" : "red"}">
                ${result.isInside ? "Попадание" : "Промах"}
            </td>
            <td>${result.currentTime}</td>
            <td>${result.executionTime}</td>
        </tr>
        </tbody>
    </table>
    <br>
    <form method="post" action="main">
        <input type="submit" value="Вернуться назад" class="custom_button">
    </form>
    <br>
</div>
</body>
</html>
