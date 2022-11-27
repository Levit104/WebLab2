package levit104.web.lab2.beans;

public class Result {
    private double x;
    private double y;
    private double r;
    private boolean isInside;
    private String currentTime;
    private String executionTime;

    public Result() {}

    public Result(double x, double y, double r, boolean isInside, String currentTime, String executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isInside = isInside;
        this.currentTime = currentTime;
        this.executionTime = executionTime;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public double getR() {
        return r;
    }

    public boolean getIsInside() {
        return isInside;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public String getExecutionTime() {
        return executionTime;
    }

    public void setX(double x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setR(double r) {
        this.r = r;
    }

    public void setIsInside(boolean isInside) {
        this.isInside = isInside;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }

    public void setExecutionTime(String executionTime) {
        this.executionTime = executionTime;
    }
}
