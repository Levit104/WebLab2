package levit104.web.lab2.servlets;

import levit104.web.lab2.beans.*;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.time.DateTimeException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@WebServlet(name = "AreaCheckServlet", value = "/area-check")
public class AreaCheckServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        long startTime = System.nanoTime();

        String xString = request.getParameter("x");
        String yString = request.getParameter("y");
        String rString = request.getParameter("r");

        boolean allValid = validValue(xString, -3, 5, false) &&
                validValue(yString, -3, 5, true) &&
                validValue(rString, 1, 5, false);

        if (allValid) {
            double xValue = Double.parseDouble(xString);
            double yValue = Double.parseDouble(yString);
            double rValue = Double.parseDouble(rString);
            boolean isInside = insideArea(xValue, yValue, rValue);

            String parameterName = "timezone";
            String pattern = "dd-MM-yyyy HH:mm:ss";
            String currentTime = calculateCurrentTime(request, parameterName, pattern);
            String executionTime = calculateExecutionTime(startTime);

            String containerName = "resultsContainer";
            String resultName = "result";
            Result result = new Result(xValue, yValue, rValue, isInside, currentTime, executionTime);
            addResultToTable(request, containerName, resultName, result);

            getServletContext().getRequestDispatcher("/form-result").forward(request, response);
        } else {
            // Если использовать приложение как задумано else не выполнится никогда и error_page не откроется
            getServletContext().getRequestDispatcher("/form-error").forward(request, response);
        }
    }

    private boolean validValue(String valueString, double min, double max, boolean isStrict) {
        try {
            double value = Double.parseDouble(valueString);
            return (isStrict) ? (value > min && value < max) : (value >= min && value <= max);
        } catch (NumberFormatException e) {
            return false;
        }

    }

    private boolean insideArea(double x, double y, double r) {
        return insideRectangle(x, y, r) || insideQuadrant(x, y, r) || insideTriangle(x, y, r);
    }

    private boolean insideRectangle(double x, double y, double r) {
        return x <= 0 && y >= 0 && x >= -r && y <= r;
    }

    private boolean insideQuadrant(double x, double y, double r) {
        return x <= 0 && y <= 0 && Math.sqrt(x * x + y * y) <= r / 2;
    }

    private boolean insideTriangle(double x, double y, double r) {
        return x >= 0 && y <= 0 && y >= (x - r / 2);
    }

    private String calculateCurrentTime(HttpServletRequest request, String parameterName, String pattern) {
        String currentTime;
        try {
            currentTime = OffsetDateTime.now(ZoneOffset.UTC)
                    .minusMinutes(Long.parseLong(request.getParameter(parameterName)))
                    .format(DateTimeFormatter.ofPattern(pattern));
        } catch (NumberFormatException | DateTimeException e) {
            currentTime = "Н/Д";
        }
        return currentTime;
    }

    private String calculateExecutionTime(long startTime) {
        // 1 секунда = 1_000_000_000 наносекунд
        return String.format("%.7f", (System.nanoTime() - startTime) / 1_000_000_000.0);
    }

    private void addResultToTable(HttpServletRequest request, String containerName, String resultName, Result result) {
        HttpSession session = request.getSession();
        ResultsContainer resultsContainer = (ResultsContainer) session.getAttribute(containerName);
        if (resultsContainer == null) resultsContainer = new ResultsContainer();
        resultsContainer.getResults().add(result);
        session.setAttribute(containerName, resultsContainer);
        session.setAttribute(resultName, result);
    }

}
