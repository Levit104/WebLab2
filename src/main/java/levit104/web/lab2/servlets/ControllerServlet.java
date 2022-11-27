package levit104.web.lab2.servlets;

import levit104.web.lab2.beans.ResultsContainer;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "ControllerServlet", value = "/controller")
public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        getServletContext().getRequestDispatcher("/main").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (hasParameters(request)) {
            getServletContext().getRequestDispatcher("/area-check").forward(request, response);
        } else if (request.getParameter("clear") != null) {
            // Очистка таблицы при нажатии кнопки
            String attributeName = "resultsContainer";
            clearTable(request, attributeName);
            getServletContext().getRequestDispatcher("/main").forward(request, response);
        } else {
            getServletContext().getRequestDispatcher("/main").forward(request, response);
        }
    }

    private boolean hasParameters(HttpServletRequest request) {
        return request.getParameter("x") != null &&
                request.getParameter("y") != null &&
                request.getParameter("r") != null;
    }

    private void clearTable(HttpServletRequest request, String attributeName) {
        ResultsContainer resultsContainer = (ResultsContainer) request.getSession().getAttribute(attributeName);
        if (resultsContainer == null) resultsContainer = new ResultsContainer();
        resultsContainer.getResults().clear();
        request.getSession().setAttribute(attributeName, resultsContainer);
    }
}
