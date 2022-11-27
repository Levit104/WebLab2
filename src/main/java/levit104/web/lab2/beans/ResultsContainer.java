package levit104.web.lab2.beans;

import java.util.ArrayList;
import java.util.List;

public class ResultsContainer {
    private List<Result> results;

    public ResultsContainer() {
        results = new ArrayList<>();
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }
}
