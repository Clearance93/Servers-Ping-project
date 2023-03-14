package com.example.demo.enumuration;

public enum Status {
    SERVER_UP("SERVER_UP"),
    SERVER_DAWN("SERVER_DAWN");

    private final String status;

    Status(String status) {
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }

}
